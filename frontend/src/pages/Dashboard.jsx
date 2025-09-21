// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import DailyExpenseChart from "../components/DailyExpenseChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";
import DayWisePieChart from "../components/DailyExpensePieChart";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [salary, setSalary] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
  });
  const [showOtherDesc, setShowOtherDesc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/users/profile",
        config
      );
      setUser(data);
      setSalary(data.salary);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      navigate("/login");
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/expenses", config);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchUser();
    fetchExpenses();
  }, [token]);

  const handleSalaryUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/salary",
        { salary },
        config
      );
      setSalary(data.salary);
      alert("Salary updated");
    } catch (err) {
      console.error(err);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/expenses",
        expenseForm,
        config
      );
      setExpenses([...expenses, data]);
      setExpenseForm({ title: "", amount: "", category: "", description: "" });
      setShowOtherDesc(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, config);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // Filter selected day expenses
  const selectedDayExpenses = selectedDay
    ? expenses.filter(
        (exp) => new Date(exp.date || exp.createdAt).toLocaleDateString() === selectedDay
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>

      {/* Salary */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Salary</h2>
        <form onSubmit={handleSalaryUpdate} className="flex gap-2 items-center">
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Update Salary
          </button>
        </form>
      </div>

      {/* Add Expense */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
        <form onSubmit={handleExpenseSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Title"
            value={expenseForm.title}
            onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
            className="border p-2 rounded"
            required
          />
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
          {showOtherDesc && (
            <input
              type="text"
              placeholder="Description"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
              className="border p-2 rounded"
              required
            />
          )}
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Add Expense
          </button>
        </form>
      </div>

      {/* Charts */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Expenses Overview</h2>

        {/* Daily Bar Chart */}
        <DailyExpenseChart expenses={expenses} onDayClick={(day) => setSelectedDay(day)} />

        {/* Monthly Chart */}
        <MonthlyExpenseChart expenses={expenses} />

        {/* If a day selected → show pie chart + daily bar side by side + day’s table */}
        {selectedDay && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Details for {selectedDay}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DailyExpenseChart expenses={selectedDayExpenses} />
              <DayWisePieChart expenses={selectedDayExpenses} selectedDay={selectedDay} />
            </div>

            {/* Table for selected day */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Title</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDayExpenses.map((exp) => (
                    <tr key={exp._id} className="text-center">
                      <td className="p-2 border">{exp.title}</td>
                      <td className="p-2 border">₹{exp.amount}</td>
                      <td className="p-2 border">{exp.category}</td>
                      <td className="p-2 border">{exp.description || "-"}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setSelectedDay(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Previous Expenses */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Previous Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id} className="text-center">
                  <td className="p-2 border">{exp.title}</td>
                  <td className="p-2 border">₹{exp.amount}</td>
                  <td className="p-2 border">{exp.category}</td>
                  <td className="p-2 border">{exp.description || "-"}</td>
                  <td className="p-2 border">
                    {new Date(exp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDeleteExpense(exp._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
