import React, { useState, useEffect } from "react";
import "./EditBudget.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const EditBudget = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    month: "",
    year: "",
  });

  useEffect(() => {
    if (!state) {
      navigate("/budget");
      return;
    }

    setForm({
      categoryId: state.categoryId,
      amount: state.amount,
      month: state.month,
      year: state.year,
    });

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/category?type=Expense`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCategories(res.data);
  };

  const handleChange = (e) => {
    let value = e.target.value;

    if (e.target.name === "amount" || e.target.name === "categoryId") {
      value = value === "" ? "" : Number(value);
    }

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const API = `${import.meta.env.VITE_API_URL}/api/Budget`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(`${API}/${state.budgetId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Budget updated");
      navigate("/budget");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update budget");
    }
  };

  return (
    <div className="editbudget-page">
      <div className="editbudget-card">

        <h2 className="editbudget-title">Edit Budget</h2>
        <p className="editbudget-subtitle">Edit your budget details</p>

        <form className="editbudget-form" onSubmit={handleSubmit}>

          <select
            className="editbudget-input"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <input
            className="editbudget-input"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
          />

          <input
            className="editbudget-input"
            type="number"
            name="month"
            value={form.month}
            onChange={handleChange}
          />

          <input
            className="editbudget-input"
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
          />

          <div className="editbudget-buttons">
            <button className="editbudget-submit">
              Update Budget
            </button>

            <button
              className="editbudget-cancel"
              type="button"
              onClick={() => navigate("/budget")}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditBudget;