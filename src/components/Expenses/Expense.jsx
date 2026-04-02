import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Expense.css";
import ExpenseCards from "./ExpenseCards";
import ExpenseFilters from "./ExpenseFilters";
import { toast } from "react-toastify";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API = `${import.meta.env.VITE_API_URL}/api/Expense`;

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExpenses(res.data);
      setFilteredExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedExpenses = expenses.filter((e) => e.expenseId !== id);
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      toast
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  if (loading) {
    return <p className="expenses-loading">Loading expenses...</p>;
  }

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <h2 className="expenses-title">All Expenses</h2>
        <button
          className="expenses-add-button"
          onClick={() => navigate("/AddExpense")}
        >
          + Add Expense
        </button>
      </div>

      <ExpenseCards expenses={filteredExpenses} />

      <div className="expenses-container">
        <ExpenseFilters
          expenses={expenses}
          setFilteredExpenses={setFilteredExpenses}
        />

        <div className="expenses-table-wrapper">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="expenses-empty">
                    No expenses found
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.expenseId}>
                    <td>{exp.name}</td>
                    <td>{exp.categoryName}</td>
                    <td className="expenses-amount">₹{exp.amount}</td>
                    <td>{exp.date}</td>
                    <td>{exp.description || "-"}</td>
                    <td className="expenses-actions">
                      <button
                        className="expenses-btn update"
                        onClick={() => navigate("/UpdateExpense", { state: exp })}
                      >
                        Update
                      </button>

                      <button
                        className="expenses-btn delete"
                        onClick={() => handleDelete(exp.expenseId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expense;