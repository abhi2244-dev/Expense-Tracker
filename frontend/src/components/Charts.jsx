import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Charts = ({ expenses }) => {
  const dataMap = {};
  expenses.forEach((exp) => {
    dataMap[exp.category] = (dataMap[exp.category] || 0) + exp.amount;
  });

  const data = {
    labels: Object.keys(dataMap),
    datasets: [
      {
        label: "Amount ($)",
        data: Object.values(dataMap),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Expenses by Category" } },
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default Charts;
