import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseFilters.css";

const ExpenseFilters = ({ expenses = [], setFilteredExpenses }) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const CATEGORY_API = `${import.meta.env.VITE_API_URL}/api/category?type=Expense `;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, selectedCategory, sortOrder, fromDate, toDate, expenses]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(CATEGORY_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const applyFilters = () => {
    let updated = [...expenses];

    if (search.trim()) {
      updated = updated.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.description || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory) {
      updated = updated.filter(
        (e) => e.categoryName === selectedCategory
      );
    }

    if (fromDate) {
      updated = updated.filter(
        (e) => new Date(e.date) >= new Date(fromDate)
      );
    }

    if (toDate) {
      updated = updated.filter(
        (e) => new Date(e.date) <= new Date(toDate)
      );
    }

    updated.sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });

    setFilteredExpenses(updated);
  };

  const handleClear = () => {
    setSearch("");
    setSelectedCategory("");
    setSortOrder("recent");
    setFromDate("");
    setToDate("");
    setFilteredExpenses(expenses);
  };

  return (
    <div className="expensefilters-wrapper">
      <div className="expensefilters-container">
        <input
          className="expensefilters-input"
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="expensefilters-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="recent">Recent First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          className="expensefilters-clear"
          onClick={handleClear}
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="expensefilters-dates">
        <input
          className="expensefilters-date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          className="expensefilters-date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      <div className="expensefilters-categories">
        <button
          type="button"
          className={`expensefilters-category-btn ${
            selectedCategory === "" ? "active" : ""
          }`}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            type="button"
            key={cat.categoryId}
            className={`expensefilters-category-btn ${
              selectedCategory === cat.categoryName ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat.categoryName)}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExpenseFilters;