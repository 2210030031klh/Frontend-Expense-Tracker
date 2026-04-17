import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Budget.css";
import BudgetReports from "./BudgetReport";
import ConfirmModel from "../Common/ConfirmModel";

const Budget = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const API = `${import.meta.env.VITE_API_URL}/api/Budget`;

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
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchBudgets = async () => {
    try {
      const res = await axios.get(API, authHeaders);
      setBudgets(res.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      // toast.error("Failed to load budgets");
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

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBudgets(), fetchReport()]);
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

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteId}`, authHeaders);
      toast.success("Budget deleted successfully");
      setShowConfirm(false);
      setDeleteId(null);
      await Promise.all([fetchBudgets(), fetchReport()]);
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
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
    <>
      <div className="budget-page">
        <h1 className="budget-titlee">Your Budget 🎯
          <p className="budget-subtext">
            Plan your spending and stay on track with your financial goals
          </p>
          </h1>
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

              <button
                className="budget-add-button"
                onClick={() => navigate("/AddBudget")}
              >
                + Add Budget
              </button>
            </div>
          </div>

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
                        <td><span>{budget.categoryName}</span></td>
                        <td>₹{formatCurrency(budget.amount)}</td>
                        <td>{monthNames[budget.month - 1]}</td>
                        <td>{budget.year}</td>
                        <td className="budget-actions-cell">
                          <div className="budget-actions">
                            <button
                              className="budget-btn update"
                              onClick={() => navigate("/EditBudget", { state: budget })}
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

      {showConfirm && (
        <ConfirmModel
          message="Delete this budget?"
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

export default Budget;