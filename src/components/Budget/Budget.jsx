import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Budget.css";
import BudgetReports from "./BudgetReport";

const Budget = () => {
  const API = `${import.meta.env.VITE_API_URL}/api/Budget`;
  const CATEGORY_API = `${import.meta.env.VITE_API_URL}/api/Category?type=Expense`;

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [budgets, setBudgets] = useState([]);
  const [report, setReport] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState(null);

  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    month: currentMonth,
    year: currentYear,
  });

  const token = localStorage.getItem("accessToken");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(API, authHeaders);
      setBudgets(res.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to load budgets");
    }
  };

  const fetchReport = async () => {
    try {
      const res = await axios.get(
        `${API}/report?month=${month}&year=${year}`,
        authHeaders
      );
      setReport(res.data || []);
    } catch (error) {
      console.error("Error fetching budget report:", error);
      setReport([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API, authHeaders);
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBudgets(), fetchReport(), fetchCategories()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => b.month === month && b.year === year);
  }, [budgets, month, year]);

  const summary = useMemo(() => {
    const totalBudget = report.reduce((sum, item) => sum + item.budgetAmount, 0);
    const totalSpent = report.reduce((sum, item) => sum + item.spentAmount, 0);
    const remaining = report.reduce((sum, item) => sum + item.remainingAmount, 0);

    return { totalBudget, totalSpent, remaining };
  }, [report]);

  const maxChartValue = useMemo(() => {
    if (report.length === 0) return 0;
    return Math.max(
      ...report.map((item) => Math.max(item.budgetAmount, item.spentAmount))
    );
  }, [report]);

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const resetForm = () => {
    setForm({
      categoryId: "",
      amount: "",
      month,
      year,
    });
    setEditingBudgetId(null);
    setShowForm(false);
  };

  const handleAddClick = () => {
    setForm({
      categoryId: "",
      amount: "",
      month,
      year,
    });
    setEditingBudgetId(null);
    setShowForm(true);
  };

  const handleEdit = (budget) => {
    setForm({
      categoryId: budget.categoryId || "",
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });
    setEditingBudgetId(budget.budgetId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this budget?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/${id}`, authHeaders);
      toast.success("Budget deleted successfully");
      await Promise.all([fetchBudgets(), fetchReport()]);
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error(error.response?.data?.message || "Failed to delete budget");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId || !form.amount || !form.month || !form.year) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      categoryId: Number(form.categoryId),
      amount: Number(form.amount),
      month: Number(form.month),
      year: Number(form.year),
    };

    try {
      if (editingBudgetId) {
        await axios.put(`${API}/${editingBudgetId}`, payload, authHeaders);
        toast.success("Budget updated successfully");
      } else {
        await axios.post(API, payload, authHeaders);
        toast.success("Budget added successfully");
      }

      resetForm();
      await Promise.all([fetchBudgets(), fetchReport()]);
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error(error.response?.data?.message || "Failed to save budget");
    }
  };

  if (loading) {
    return (
      <div className="budget-page">
        <div className="budget-container">
          <p className="budget-empty">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-page">
      <div className="budget-container">
        <div className="budget-header">
          <h1 className="budget-title">Budget Tracker</h1>

          <div className="budget-header-right">
            <div className="budget-filters">
              <select
                className="budget-select"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {monthNames.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                className="budget-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[currentYear - 1, currentYear, currentYear + 1].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <button className="budget-add-button" onClick={handleAddClick}>
              + Add Budget
            </button>
          </div>
        </div>

        {showForm && (
          <form className="budget-form" onSubmit={handleSubmit}>
            <select
              className="budget-input"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            <input
              className="budget-input"
              type="number"
              name="amount"
              placeholder="Enter budget amount"
              value={form.amount}
              onChange={handleChange}
            />

            <select
              className="budget-input"
              name="month"
              value={form.month}
              onChange={handleChange}
            >
              {monthNames.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>

            <select
              className="budget-input"
              name="year"
              value={form.year}
              onChange={handleChange}
            >
              {[currentYear - 1, currentYear, currentYear + 1].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            <button className="budget-save-button" type="submit">
              {editingBudgetId ? "Update Budget" : "Save Budget"}
            </button>

            <button
              className="budget-cancel-button"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          </form>
        )}

        <BudgetReports
          report={report}
          summary={summary}
          maxChartValue={maxChartValue}
          formatCurrency={formatCurrency}
        />

        <div className="budget-card budget-table-card">
          <div className="budget-table-header">
            <h3 className="budget-card-title">All Budgets</h3>
          </div>

          <div className="budget-table-wrapper">
            <table className="budget-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="budget-empty">
                      No budgets found
                    </td>
                  </tr>
                ) : (
                  filteredBudgets.map((budget) => (
                    <tr key={budget.budgetId}>
                      <td>{budget.categoryName}</td>
                      <td>₹{formatCurrency(budget.amount)}</td>
                      <td>{monthNames[budget.month - 1]}</td>
                      <td>{budget.year}</td>
                      <td>
                        <div className="budget-actions">
                          <button
                            className="budget-btn update"
                            onClick={() => handleEdit(budget)}
                          >
                            Edit
                          </button>
                          <button
                            className="budget-btn delete"
                            onClick={() => handleDelete(budget.budgetId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;