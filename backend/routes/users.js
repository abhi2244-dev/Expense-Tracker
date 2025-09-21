import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    salary: user.salary,
    token
  });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    salary: user.salary,
    token
  });
});

// Get Profile
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

// Get Salary
router.get("/salary", protect, async (req, res) => {
  res.json({ salary: req.user.salary });
});

// Update Salary
router.put("/salary", protect, async (req, res) => {
  const { salary } = req.body;
  if (salary == null) return res.status(400).json({ message: "Salary required" });

  req.user.salary = salary;
  await req.user.save();
  res.json({ salary: req.user.salary });
});

export default router;
