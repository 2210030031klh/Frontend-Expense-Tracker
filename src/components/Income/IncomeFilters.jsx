import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IncomeFilters.css";

const IncomeFilters = ({ incomes = [], setFilteredIncomes }) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const CATEGORY_API = `${import.meta.env.VITE_API_URL}/api/category?type=Income`;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, selectedSource, sortOrder, fromDate, toDate, incomes]);

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
      console.error("Error fetching income categories:", error);
    }
  };

  const applyFilters = () => {
    let updated = [...incomes];

    if (search.trim()) {
      updated = updated.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          (i.description || "").toLowerCase().includes(search.toLowerCase()) ||
          (i.source || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedSource) {
      updated = updated.filter((i) => i.source === selectedSource);
    }

    if (fromDate) {
      updated = updated.filter((i) => new Date(i.date) >= new Date(fromDate));
    }

    if (toDate) {
      updated = updated.filter((i) => new Date(i.date) <= new Date(toDate));
    }

    updated.sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });

    setFilteredIncomes(updated);
  };

  const handleClear = () => {
    setSearch("");
    setSelectedSource("");
    setSortOrder("recent");
    setFromDate("");
    setToDate("");
    setFilteredIncomes(incomes);
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
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          className="incomefilters-date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      <div className="incomefilters-categories">
        <button
          type="button"
          className={`incomefilters-category-btn ${
            selectedSource === "" ? "active" : ""
          }`}
          onClick={() => setSelectedSource("")}
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
            onClick={() => setSelectedSource(cat.categoryName)}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IncomeFilters;