// src/components/DailyExpensePieChart.jsx
import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#6633FF"];

const DayWisePieChart = ({ expenses, selectedDay }) => {
  if (!Array.isArray(expenses) || !selectedDay) return null;

  const dayExpenses = expenses.filter(
    (exp) => new Date(exp.date || exp.createdAt).toLocaleDateString() === selectedDay
  );

  const data = dayExpenses.map((exp) => ({
    name: exp.title,
    value: Number(exp.amount),
  }));

  if (data.length === 0) return <p>No expenses recorded on {selectedDay}</p>;

  return (
    <div className="w-full h-64 p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Expenses on {selectedDay}</h2>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DayWisePieChart;
