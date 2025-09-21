import axios from "axios";

const API_URL = "http://localhost:5000"; // backend URL

// Auth
export const registerUser = (userData) =>
  axios.post(`${API_URL}/api/auth/register`, userData);

export const loginUser = (userData) =>
  axios.post(`${API_URL}/api/auth/login`, userData);

// Expenses
export const getExpenses = (token) =>
  axios.get(`${API_URL}/api/expenses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addExpense = (expenseData, token) =>
  axios.post(`${API_URL}/api/expenses`, expenseData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteExpense = (id, token) =>
  axios.delete(`${API_URL}/api/expenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
