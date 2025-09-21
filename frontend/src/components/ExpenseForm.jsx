// components/ExpenseForm.jsx
import React, { useState } from "react";

const ExpenseForm = ({ onAddExpense }) => {
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
  });

  const [showOtherDesc, setShowOtherDesc] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate title and amount
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.category) {
      alert("Please fill in all required fields");
      return;
    }

    onAddExpense(expenseForm);

    // Reset form
    setExpenseForm({ title: "", amount: "", category: "", description: "" });
    setShowOtherDesc(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Title input */}
        <input
          type="text"
          placeholder="Title"
          value={expenseForm.title}
          onChange={(e) =>
            setExpenseForm({ ...expenseForm, title: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        {/* Amount input */}
        <input
          type="number"
          placeholder="Amount"
          value={expenseForm.amount}
          onChange={(e) =>
            setExpenseForm({ ...expenseForm, amount: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        {/* Category dropdown */}
        <select
          value={expenseForm.category}
          onChange={(e) => {
            setExpenseForm({ ...expenseForm, category: e.target.value });
            setShowOtherDesc(e.target.value === "Other");
          }}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        {/* Optional description if Other is selected */}
        {showOtherDesc && (
          <input
            type="text"
            placeholder="Description"
            value={expenseForm.description}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, description: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
