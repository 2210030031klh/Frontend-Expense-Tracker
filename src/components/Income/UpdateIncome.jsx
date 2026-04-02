import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./UpdateIncome.css";

const UpdateIncome = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p className="update-income-no-data">No data found</p>;

  const [form, setForm] = useState({
    name: "",
    amount: "",
    description: "",
    date: "",
    source: "",
  });

  const INCOME_API = `${import.meta.env.VITE_API_URL}/api/income`;

  useEffect(() => {
    if (state) {
      setForm({
        name: state.name || "",
        amount: state.amount || "",
        description: state.description || "",
        date: state.date ? state.date.split("T")[0] : "",
        source: state.source || "",
      });
    }
  }, [state]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.source.trim()) {
      toast.error("Source is required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `${INCOME_API}/${state.incomeId}`,
        {
          ...form,
          amount: Number(form.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Income updated successfully");
      navigate("/Income");
    } catch (error) {
      console.error("Updating income failed:", error);

      if (!error.response) {
        toast.error("Server not reachable. Try again later.");
        return;
      }

      const data = error.response.data;

      if (data?.errors) {
        const allErrors = Object.values(data.errors).flat();
        toast.error(allErrors[0]);
        return;
      }

      const errorMessage =
        data?.message || data?.title || "Income update failed";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="update-income-page">
      <div className="update-income-card">
        <h2 className="update-income-title">Update Income</h2>
        <p className="update-income-subtitle">
          Edit your income details and save the changes.
        </p>

        <form className="update-income-form" onSubmit={handleSubmit}>
          <input
            className="update-income-input"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Income title"
          />

          <input
            className="update-income-input"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
          />

          {/* 🔥 THIS IS THE MAIN CHANGE */}
          <input
            className="update-income-input"
            name="source"
            value={form.source}
            onChange={handleChange}
            placeholder="Source (Salary, Freelance, etc.)"
          />

          <input
            className="update-income-input"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <textarea
            className="update-income-textarea"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="update-income-buttons">
            <button
              className="update-income-btn update-income-submit"
              type="submit"
            >
              Update Income
            </button>

            <button
              className="update-income-btn update-income-cancel"
              type="button"
              onClick={() => navigate("/Income")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateIncome;