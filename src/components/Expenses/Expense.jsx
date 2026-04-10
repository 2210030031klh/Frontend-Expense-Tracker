import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Expense.css";
import ExpenseCards from "./ExpenseCards";
import ExpenseFilters from "./ExpenseFilters";
import { toast } from "react-toastify";
import ConfirmModel from "../Common/ConfirmModel";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  const API = `${import.meta.env.VITE_API_URL}/api/Expense`;

  const getAuthConfig = () => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const applyPaginationResponse = (data) => {
    if (data.items) {
      setExpenses(data.items || []);
      setCurrentPage(data.pageNumber || 1);
      setTotalPages(data.totalPages || 1);
    } else {
      setExpenses(data || []);
      setCurrentPage(1);
      setTotalPages(1);
    }
  };

  const fetchExpenses = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}?pageNumber=${page}&pageSize=10`,
        getAuthConfig()
      );

      applyPaginationResponse(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
      setFilteredExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API}/summary`, getAuthConfig());
      setSummary(res.data);
    } catch (error) {
      console.error("Error fetching expense summary:", error);
      setSummary(null);
    }
  };

  const fetchExpensesByCategory = async (category, page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/category/${encodeURIComponent(category)}`,
        {
          ...getAuthConfig(),
          params: {
            pageNumber: page,
            pageSize: 10,
          },
        }
      );

      setExpenses(res.data.items || []);
      setCurrentPage(res.data.pageNumber || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching category expenses:", error);
      setExpenses([]);
      setFilteredExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesByDateRange = async (fromDate, toDate) => {
    try {
      if (!fromDate || !toDate) return;

      setSelectedCategory("");
      setLoading(true);

      const res = await axios.get(`${API}/ByDateRange`, {
        ...getAuthConfig(),
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
      });

      applyPaginationResponse(res.data);
    } catch (error) {
      console.error("Error fetching expenses by date range:", error);
      setExpenses([]);
      setFilteredExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category) => {
    if (!category || category === "All") {
      setSelectedCategory("");
      setCurrentPage(1);
      await fetchExpenses(1);
      return;
    }

    setSelectedCategory(category);
    setCurrentPage(1);
    await fetchExpensesByCategory(category, 1);
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchExpensesByCategory(selectedCategory, currentPage);
    } else {
      fetchExpenses(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    let updated = [...expenses];

    if (search.trim()) {
      updated = updated.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          (e.description || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    updated.sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });

    setFilteredExpenses(updated);
  }, [expenses, search, sortOrder]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteId}`, getAuthConfig());

      const updatedExpenses = expenses.filter((e) => e.expenseId !== deleteId);
      setExpenses(updatedExpenses);

      await fetchSummary();

      toast.success("Expense deleted successfully");
      setShowConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  const handleClearFilters = async () => {
    setSearch("");
    setSortOrder("recent");
    setSelectedCategory("");
    setCurrentPage(1);
    await fetchExpenses(1);
  };

  return (
    <>
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

        <ExpenseCards summary={summary} />

        <div className="expenses-container">
          <ExpenseFilters
            search={search}
            setSearch={setSearch}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onCategoryChange={handleCategoryChange}
            onDateFilter={fetchExpensesByDateRange}
            onClear={handleClearFilters}
          />

          <div className="expenses-table-wrapper">
            {loading ? (
              <p className="expenses-loading">Loading expenses...</p>
            ) : (
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
                        <td>
                          <span>{exp.categoryName}</span>
                        </td>
                        <td className="expenses-amount">₹{exp.amount}</td>
                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                        <td>{exp.description || "-"}</td>
                        <td className="expenses-actions">
                          <button
                            className="expenses-btn update"
                            onClick={() =>
                              navigate("/UpdateExpense", { state: exp })
                            }
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
            )}

            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModel
          message="Delete this expense?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setDeleteId(null);
          }}
        />
      )}
    </>
  );
};

export default Expense;