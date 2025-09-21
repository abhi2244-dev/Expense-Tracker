import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Expense from "../models/Expense.js";

const router = express.Router();

// GET all expenses of logged-in user
router.get("/", protect, async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id });
  res.json(expenses);
});

// POST add expense
router.post("/", protect, async (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !category) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const expense = new Expense({
    user: req.user._id,
    title,
    amount,
    category,
    date: date || Date.now(),
  });

  const createdExpense = await expense.save();
  res.status(201).json(createdExpense);
});

// DELETE expense
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
