import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Income.css";
import IncomeCards from "./IncomeCards";
import IncomeFilters from "./IncomeFilters";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmModel from "../Common/ConfirmModel";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [displayedIncomes, setDisplayedIncomes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  const API = `${import.meta.env.VITE_API_URL}/api/Income`;
  const navigate = useNavigate();

  const getAuthConfig = () => {
    const token = localStorage.getItem("accessToken");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, getAuthConfig());

      const data = res.data || [];
      setIncomes(data);
      setFilteredIncomes(data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      toast.error("Failed to load incomes");
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomesBySource = async (source) => {
    try {
      setLoading(true);

      if (!source || !source.trim()) {
        await fetchIncomes();
        return;
      }

      const res = await axios.get(
        `${API}/source/${encodeURIComponent(source.trim())}`,
        getAuthConfig()
      );

      setFilteredIncomes(res.data || []);
    } catch (error) {
      console.error("Error fetching incomes by source:", error);
      setFilteredIncomes([]);
      toast.error("Failed to filter incomes by source");
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomesByDateRange = async (fromDate, toDate) => {
    try {
      if (!fromDate || !toDate) {
        toast.error("Select both from and to dates");
        return;
      }

      setLoading(true);

      const res = await axios.get(`${API}/ByDateRange`, {
        ...getAuthConfig(),
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
      });

      setFilteredIncomes(res.data || []);
    } catch (error) {
      console.error("Error fetching incomes by date range:", error);
      setFilteredIncomes([]);
      toast.error("Failed to filter incomes by date range");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API}/summary`, getAuthConfig());
      setSummary(res.data);
    } catch (error) {
      console.error("Error fetching income summary:", error);
    }
  };

  useEffect(() => {
    fetchIncomes();
    fetchSummary();
  }, []);

  useEffect(() => {
    let updated = [...filteredIncomes];

    if (search.trim()) {
      updated = updated.filter(
        (income) =>
          (income.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (income.description || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (income.source || "").toLowerCase().includes(search.toLowerCase()) ||
          String(income.amount || "").includes(search)
      );
    }

    updated.sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });

    setDisplayedIncomes(updated);
  }, [filteredIncomes, search, sortOrder]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/${deleteId}`, getAuthConfig());

      const updatedIncomes = incomes.filter((income) => income.incomeId !== deleteId);
      const updatedFilteredIncomes = filteredIncomes.filter(
        (income) => income.incomeId !== deleteId
      );

      setIncomes(updatedIncomes);
      setFilteredIncomes(updatedFilteredIncomes);

      await fetchSummary();

      toast.success("Income deleted successfully");
      setShowConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income. Please try again.");
    }
  };

  const handleClearFilters = async () => {
    setSearch("");
    setSortOrder("recent");
    await fetchIncomes();
  };

  return (
    <>
      <div className="incomes-page">
        <div className="incomes-header">
          <h2 className="incomes-title">All Incomes</h2>

          <button
            className="incomes-add-button"
            onClick={() => navigate("/AddIncome")}
          >
            + Add Income
          </button>
        </div>

        <IncomeCards summary={summary} />

        <div className="incomes-container">
          <IncomeFilters
            search={search}
            setSearch={setSearch}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onSourceChange={fetchIncomesBySource}
            onDateFilter={fetchIncomesByDateRange}
            onClear={handleClearFilters}
          />

          <div className="incomes-table-wrapper">
            {loading ? (
              <p className="incomes-empty">Loading incomes...</p>
            ) : (
              <table className="incomes-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Source</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {displayedIncomes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="incomes-empty">
                        No incomes found
                      </td>
                    </tr>
                  ) : (
                    displayedIncomes.map((inc) => (
                      <tr key={inc.incomeId}>
                        <td>{inc.name}</td>
                        <td><span>{inc.source}</span></td>
                        <td className="incomes-amount">₹{inc.amount}</td>
                        <td>{new Date(inc.date).toLocaleDateString()}</td>
                        <td>{inc.description || "-"}</td>
                        <td className="incomes-actions">
                          <button
                            className="incomes-btn update"
                            onClick={() => navigate("/UpdateIncome", { state: inc })}
                          >
                            Update
                          </button>

                          <button
                            className="incomes-btn delete"
                            onClick={() => handleDelete(inc.incomeId)}
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
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModel
          message="Delete this income?"
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

export default Income;