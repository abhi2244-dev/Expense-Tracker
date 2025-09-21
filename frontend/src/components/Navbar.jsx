import React from "react";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Expense Tracker</h1>
      <button
        onClick={onLogout}
        className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
