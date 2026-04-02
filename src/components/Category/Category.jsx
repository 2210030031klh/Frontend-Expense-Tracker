import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [type, setType] = useState("Expense");
  const [loading, setLoading] = useState(true);

  const API = `${import.meta.env.VITE_API_URL}/api/Category`;

  const formatCategoryName = (value) => {
    return value
      .trim()
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchCategories = async (selectedType = type) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(`${API}?type=${selectedType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(type);
  }, [type]);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    const formattedCategoryName = formatCategoryName(categoryName);

    if (!formattedCategoryName) {
      toast.error("Category name is required");
      return;
    }

    const isDuplicate = categories.some(
      (cat) =>
        cat.categoryName?.trim().toLowerCase() ===
        formattedCategoryName.toLowerCase()
    );

    if (isDuplicate) {
      toast.error(`"${formattedCategoryName}" already exists as a ${type} category`);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      const payload = {
        categoryName: formattedCategoryName,
        type: type,
      };

      const res = await axios.post(API, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories((prev) => [...prev, res.data]);
      setCategoryName("");
      toast.success(`${type} category added successfully`);
    } catch (error) {
      console.error("Error adding category:", error);
      console.log("Backend response:", error.response?.data);

      if (!error.response) {
        toast.error("Server not reachable");
        return;
      }

      const data = error.response.data;

      if (data?.errors) {
        const allErrors = Object.values(data.errors).flat();
        toast.error(allErrors[0]);
        return;
      }

      const errorMessage =
        data?.message ||
        data?.title ||
        "Failed to add category";

      toast.error(errorMessage);
    }
  };

  const handleDeleteCategory = async (id) => {
    const confirmDelete = window.confirm("Delete this category?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("accessToken");

      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories((prev) =>
        prev.filter((cat) => cat.categoryId !== id)
      );

      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      console.log("Backend response:", error.response?.data);

      if (!error.response) {
        toast.error("Server not reachable");
        return;
      }

      const data = error.response.data;

      if (data?.errors) {
        const allErrors = Object.values(data.errors).flat();
        toast.error(allErrors[0]);
        return;
      }

      const errorMessage =
        data?.message ||
        data?.title ||
        "Failed to delete category";

      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <p className="category-loading">Loading categories...</p>;
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h2 className="category-title">My Categories</h2>
      </div>

      <div className="category-card">
        <div className="category-toggle-wrapper">
          <div className="category-toggle">
            <div
              className={`category-toggle-slider ${
                type === "Income" ? "right" : ""
              }`}
            ></div>

            <button
              type="button"
              className={`category-toggle-btn ${
                type === "Expense" ? "active" : ""
              }`}
              onClick={() => setType("Expense")}
            >
              Expense
            </button>

            <button
              type="button"
              className={`category-toggle-btn ${
                type === "Income" ? "active" : ""
              }`}
              onClick={() => setType("Income")}
            >
              Income
            </button>
          </div>
        </div>

        <form className="category-form" onSubmit={handleAddCategory}>
          <input
            className="category-input"
            type="text"
            placeholder={`Enter new ${type.toLowerCase()} category`}
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <button className="category-add-btn" type="submit" 
          >
            Add {type}
          </button>
        </form>

        <div className="category-list">
          {categories.length === 0 ? (
            <p className="category-empty">
              No {type.toLowerCase()} categories found
            </p>
          ) : (
            categories.map((cat) => (
              <div className="category-item" key={cat.categoryId}>
                <div className="category-info">
                  <span className="category-name">{cat.categoryName}</span>
                  <span className="category-type-badge">
                    {cat.type || type}
                  </span>
                </div>

                <button
                  className="category-delete-btn"
                  type="button"
                  onClick={() => handleDeleteCategory(cat.categoryId)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;