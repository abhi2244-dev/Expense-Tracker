// src/components/DailyExpenseChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DailyExpenseChart = ({ expenses, onDayClick, month, year }) => {
  if (!Array.isArray(expenses)) return null;

  const currentDate = new Date();
  const targetMonth = month !== undefined ? month : currentDate.getMonth(); // 0-11
  const targetYear = year !== undefined ? year : currentDate.getFullYear();

  // Filter expenses for the target month/year
  const monthlyExpenses = expenses.filter((exp) => {
    const dateObj = new Date(exp.date || exp.createdAt);
    return (
      dateObj.getMonth() === targetMonth && dateObj.getFullYear() === targetYear
    );
  });

  // Aggregate expenses by day
  const dailyData = monthlyExpenses.reduce((acc, exp) => {
    const dateObj = new Date(exp.date || exp.createdAt);
    const day = dateObj.getDate(); // day of month
    const found = acc.find((d) => d.day === day);
    if (found) found.amount += Number(exp.amount);
    else acc.push({ day, amount: Number(exp.amount) });
    return acc;
  }, []);

  // Sort by day
  dailyData.sort((a, b) => a.day - b.day);

  return (
    <div className="w-full h-64 p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Daily Expenses</h2>
      {dailyData.length === 0 ? (
        <p>No expenses recorded for this month.</p>
      ) : (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={dailyData}>
            <XAxis
              dataKey="day"
              label={{ value: "Date", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis
              label={{ value: "Amount (₹)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar
              dataKey="amount"
              fill="#8884d8"
              cursor={onDayClick ? "pointer" : "default"}
              onClick={(data) => onDayClick && onDayClick(data.day)}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DailyExpenseChart;
