import React from 'react'
import "./Income.css";
import IncomeCards from './IncomeCards';
import IncomeFilters from './IncomeFilters';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


const Income = () => {
  const[incomes, setIncomes] = useState([]);
  const[filteredIncomes, setFilteredIncomes] = useState([]);
  const API = `${import.meta.env.VITE_API_URL}/api/Income`;

  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncomes(res.data);
      setFilteredIncomes(res.data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };
  
  useEffect(() => {
    fetchIncomes();
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

      const updatedIncomes = incomes.filter((i) => i.incomeId !== id);
      setIncomes(updatedIncomes);
      setFilteredIncomes(updatedIncomes);
      toast.success("Income deleted successfully");
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income. Please try again.");
    }
  };

  const navigate = useNavigate();

   return (
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

      <IncomeCards incomes={filteredIncomes} />

      <div className="incomes-container">
        <IncomeFilters
          incomes={incomes}
          setFilteredIncomes={setFilteredIncomes}
        />

        <div className="incomes-table-wrapper">
          <table className="incomes-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="incomes-empty">
                    No incomes found
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((inc) => (
                  <tr key={inc.incomeId}>
                    <td>{inc.name}</td>
                    <td>{inc.categoryName}</td>
                    <td className="incomes-amount">₹{inc.amount}</td>
                    <td>{inc.description || "-"}</td>
                    <td>{inc.date}</td>

                    <td className="incomes-actions">
                      <button
                        className="incomes-btn update"
                        onClick={() =>
                          navigate("/UpdateIncome", { state: inc })
                        }
                      >
                        Update
                      </button>

                      <button
                        className="incomes-btn delete"
                        onClick={() =>
                          handleDelete(inc.incomeId)
                        }
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

export default Income;