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
  const [fromInputType, setFromInputType] = useState("text");
  const [toInputType, setToInputType] = useState("text");

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

  const handleDateSet = () => {
    if (!fromDate || !toDate) return;

    if (fromDate > toDate) {
      alert("From date cannot be greater than To date");
      return;
    }

    onDateFilter(fromDate, toDate);
  };

  const handleClear = () => {
    setSearch("");
    setSelectedSource("");
    setSortOrder("recent");
    setFromDate("");
    setToDate("");
    setFromInputType("text");
    setToInputType("text");
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

        <input
          className="incomefilters-date"
          type={fromInputType}
          placeholder="From"
          value={fromDate}
          onFocus={() => setFromInputType("date")}
          onBlur={() => {
            if (!fromDate) setFromInputType("text");
          }}
          onChange={(e) => setFromDate(e.target.value)}
          aria-label="From date"
          title="From"
        />

        <input
          className="incomefilters-date"
          type={toInputType}
          placeholder="To"
          value={toDate}
          onFocus={() => setToInputType("date")}
          onBlur={() => {
            if (!toDate) setToInputType("text");
          }}
          onChange={(e) => setToDate(e.target.value)}
          aria-label="To date"
          title="To"
        />

        <button
          className="incomefilters-set"
          onClick={handleDateSet}
          type="button"
        >
          Set
        </button>

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

      <div className="incomefilters-categories">
        <button
          type="button"
          className={`incomefilters-category-btn ${
            selectedSource === "" ? "active" : ""
          }`}
          onClick={() => {
            setSelectedSource("");
            onSourceChange("");
          }}
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
            onClick={() => {
              setSelectedSource(cat.categoryName);
              onSourceChange(cat.categoryName);
            }}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IncomeFilters;