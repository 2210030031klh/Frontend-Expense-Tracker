import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ExpenseFilters.css";

const ExpenseFilters = ({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  onCategoryChange,
  onDateFilter,
  onClear,
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const CATEGORY_API = `${import.meta.env.VITE_API_URL}/api/category?type=Expense`;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      onDateFilter(fromDate, toDate);
    }
  }, [fromDate, toDate]);


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

  const handleApplyDate = () => {
    onDateFilter(fromDate, toDate);
  };

  

  const handleClear = () => {
    setSearch("");
    setSelectedCategory("");
    setSortOrder("recent");
    setFromDate("");
    setToDate("");
    onClear();
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
          onClick={() => {setSelectedCategory("");
            onCategoryChange("");
          }
          }
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
            onClick={() => {setSelectedCategory(cat.categoryName);
              onCategoryChange(cat.categoryName);
            }}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExpenseFilters;