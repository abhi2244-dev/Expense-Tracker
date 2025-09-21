import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BD4", "#FF6666", "#66CCFF", "#FF99CC"];

const ExpenseCharts = ({ expenses }) => {
  const categoryMap = {};
  expenses.forEach(exp => {
    if (!categoryMap[exp.category]) categoryMap[exp.category] = 0;
    categoryMap[exp.category] += exp.amount;
  });

  const data = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  return (
    <div className="w-full h-64 p-4 border rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">Expenses by Category</h2>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={true}      // Draw lines from pie to labels
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}  // Show % outside
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}`} />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseCharts;
