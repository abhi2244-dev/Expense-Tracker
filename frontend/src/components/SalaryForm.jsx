import { useState, useEffect } from "react";
import axios from "axios";

const SalaryForm = ({ token }) => {
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch current salary on load
    const fetchSalary = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/salary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalary(res.data.salary);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSalary();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/salary",
        { salary: Number(salary) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Salary updated: $${res.data.salary}`);
    } catch (err) {
      setMessage("Failed to update salary");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto my-4">
      <h2 className="text-lg font-semibold mb-2">Set Your Salary</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="number"
          placeholder="Enter your salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Save Salary
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default SalaryForm;
