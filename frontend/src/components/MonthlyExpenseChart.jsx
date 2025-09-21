// src/components/MonthlyExpenseChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MonthlyExpenseChart = ({ expenses }) => {
  if (!Array.isArray(expenses)) return null;

  // Aggregate expenses by month
  const monthlyData = expenses.reduce((acc, exp) => {
    const dateObj = new Date(exp.date || exp.createdAt);
    const month = dateObj.toLocaleString("default", { month: "short", year: "numeric" }); // e.g., "Sep 2025"
    const found = acc.find((d) => d.month === month);
    if (found) found.amount += Number(exp.amount);
    else acc.push({ month, amount: Number(exp.amount) });
    return acc;
  }, []);

  monthlyData.sort((a, b) => new Date(a.month) - new Date(b.month));

  return (
    <div className="w-full h-64 p-4 border rounded shadow-md mt-6">
      <h2 className="text-xl font-bold mb-2">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={monthlyData}>
          <XAxis dataKey="month" label={{ value: "Month", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="amount" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyExpenseChart;
