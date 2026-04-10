import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IncomeFilters.css";

const IncomeFilters = ({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
  onSourceChange,
  onDateFilter,
  onClear,
}) => {
  const [categories, setCategories] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const CATEGORY_API = `${import.meta.env.VITE_API_URL}/api/category?type=Income`;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(CATEGORY_API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching income categories:", error);
    }
  };

  const handleSourceClick = (source) => {
    setSelectedSource(source);
    onSourceChange(source);
  };

  const handleDateChange = (newFromDate, newToDate) => {
    setFromDate(newFromDate);
    setToDate(newToDate);

    if (newFromDate && newToDate) {
      onDateFilter(newFromDate, newToDate);
    }
  };

  const handleClear = () => {
    setSearch("");
    setSortOrder("recent");
    setSelectedSource("");
    setFromDate("");
    setToDate("");
    onClear();
  };

  return (
    <div className="incomefilters-wrapper">
      <div className="incomefilters-container">
        <input
          className="incomefilters-input"
          type="text"
          placeholder="Search incomes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="incomefilters-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="recent">Recent First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button
          className="incomefilters-clear"
          onClick={handleClear}
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="incomefilters-dates">
        <input
          className="incomefilters-date"
          type="date"
          value={fromDate}
          onChange={(e) => handleDateChange(e.target.value, toDate)}
        />

        <input
          className="incomefilters-date"
          type="date"
          value={toDate}
          onChange={(e) => handleDateChange(fromDate, e.target.value)}
        />
      </div>

      <div className="incomefilters-categories">
        <button
          type="button"
          className={`incomefilters-category-btn ${
            selectedSource === "" ? "active" : ""
          }`}
          onClick={() => handleSourceClick("")}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            type="button"
            key={cat.categoryId}
            className={`incomefilters-category-btn ${
              selectedSource === cat.categoryName ? "active" : ""
            }`}
            onClick={() => handleSourceClick(cat.categoryName)}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IncomeFilters;