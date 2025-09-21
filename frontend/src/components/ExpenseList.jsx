import React from "react";

const ExpenseList = ({ expenses, deleteExpenseHandler }) => {
  return (
    <ul>
      {expenses.map((exp) => (
        <li
          key={exp._id}
          className="flex justify-between border p-2 rounded mb-2"
        >
          <span>{exp.title} - ${exp.amount} ({exp.category})</span>
          <button
            onClick={() => deleteExpenseHandler(exp._id)}
            className="bg-red-600 text-white px-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
