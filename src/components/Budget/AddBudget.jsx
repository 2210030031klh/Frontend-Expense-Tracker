import React, { useState, useEffect } from "react";
import "./AddBudget.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddBudget = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const [form, setForm] = useState({
    categoryId: "",
    amount: "",
    month: currentMonth,
    year: currentYear,
  });

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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/category?type=Expense`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const API = `${import.meta.env.VITE_API_URL}/api/Budget`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId) return toast.error("Select category");
    if (!form.amount || form.amount <= 0)
      return toast.error("Amount must be > 0");

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(API, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Budget added successfully");
      navigate("/budget");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add budget");
    }
  };

  return (
    <div className="addbudget-page">
      <div className="addbudget-card">

        <h2 className="addbudget-title">Add Budget</h2>
        <p className="addbudget-subtitle">Enter your budget details</p>

        <form className="addbudget-form" onSubmit={handleSubmit}>

          <select
            className="addbudget-input"
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
            className="addbudget-input"
            type="number"
            name="amount"
            placeholder="Budget amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <select
            className="addbudget-input"
            name="month"
            value={form.month}
            onChange={handleChange}
          >
            {monthNames.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>

          <input
            className="addbudget-input"
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
          />

          <div className="addbudget-buttons">
            <button className="addbudget-submit" type="submit">
              Add Budget
            </button>

            <button
              className="addbudget-cancel"
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

export default AddBudget;