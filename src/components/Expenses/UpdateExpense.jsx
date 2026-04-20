import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./UpdateExpense.css";

const UpdateExpense = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p className="update-expense-no-data">No data found</p>;

  const [form, setForm] = useState({
    name: state.name || "",
    amount: state.amount || "",
    description: state.description || "",
    date: state.date ? state.date.split("T")[0] : "",
    categoryId: state.categoryId ? String(state.categoryId) : "",
  });

  const [categories, setCategories] = useState([]);

  const EXPENSE_API = `${import.meta.env.VITE_API_URL}/api/expense`;
  const CATEGORY_API = `${import.meta.env.VITE_API_URL}/api/category?type=Expense`;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.get(CATEGORY_API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedCategories = response.data;
        setCategories(fetchedCategories);

        setForm((prev) => {
          if (prev.categoryId) return prev;

          const matched = fetchedCategories.find(
            (cat) =>
              cat.categoryName?.toLowerCase() ===
              String(state.categoryName || "").toLowerCase()
          );

          if (matched) {
            return {
              ...prev,
              categoryId: String(matched.categoryId),
            };
          }

          return prev;
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [CATEGORY_API, state.categoryName]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.categoryId) {
      toast.error("Category is required");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(
        `${EXPENSE_API}/${state.expenseId}`,
        {
          ...form,
          amount: Number(form.amount),
          categoryId: Number(form.categoryId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Updated Successfully");
      navigate("/Expenses");
    } catch (error) {
      console.error("Updating expense failed:", error);

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
        data?.message || data?.title || "Expense update failed";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="update-expense-page">
      <div className="update-expense-card">
        <h2 className="update-expense-title">Update Expense</h2>
        <p className="update-expense-subtitle">
          Edit your expense details and save the changes.
        </p>

        <form className="update-expense-form" onSubmit={handleSubmit}>
          <input
            className="update-expense-input"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Expense title"
          />

          <input
            className="update-expense-input"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
          />

          <select
            className="update-expense-input"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={String(cat.categoryId)}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <input
            className="update-expense-input"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <textarea
            className="update-expense-textarea"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="update-expense-buttons">
            <button
              className="update-expense-btn update-expense-submit"
              type="submit"
            >
              Update Expense
            </button>

            <button
              className="update-expense-btn update-expense-cancel"
              type="button"
              onClick={() => navigate("/Expenses")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateExpense;