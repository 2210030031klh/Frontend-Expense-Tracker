import React from 'react'
import "./AddIncome.css"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddIncome = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        amount: "",
        description: "",
        date: "",
        source: "",
    });

    const handleChange = (e) => {
        let value = e.target.value;

        if (e.target.name === "amount") {
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

            const result = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/category?type=Income`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCategories(result.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const API = `${import.meta.env.VITE_API_URL}/api/Income`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || form.name.trim().length < 2) {
            toast.error("Income name must be at least 2 characters long.");
            return;
        }

        if (!form.amount || Number(form.amount) <= 0) {
            toast.error("Amount must be greater than 0.");
            return;
        }

        if (!form.date) {
            toast.error("Income date is required.");
            return;
        }

        if (!form.source) {
            toast.error("Please select a source.");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");

            await axios.post(API, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Income added successfully");
            navigate("/Income");
        } catch (error) {
            console.error("Full error:", error);
            console.error("Response data:", error.response?.data);

            const data = error.response?.data;
            let errorMessage = "Failed to add income";

            if (data?.errors) {
                const firstErrorKey = Object.keys(data.errors)[0];
                if (data.errors[firstErrorKey]?.length > 0) {
                    errorMessage = data.errors[firstErrorKey][0];
                }
            } else if (data?.message) {
                errorMessage = data.message;
            } else if (typeof data === "string") {
                errorMessage = data;
            }

            toast.error(errorMessage);
        }
    };

    return (
        <div className="addincome-page">
            <div className="addincome-card">

                <h2 className="addincome-title">Add Income</h2>

                <p className="addincome-subtitle">
                    Enter your income details and save them
                </p>

                <form className="addincome-form" onSubmit={handleSubmit}>

                    <input
                        className="addincome-input"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Income title (e.g. WinWire stipend)"
                        required
                    />

                    <input
                        className="addincome-input"
                        name="amount"
                        type="number"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        required
                    />

                    <input
                        className="addincome-input"
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                    />

                    
                    <select
                        className="addincome-input"
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select source</option>

                        {categories.map((cat) => (
                            <option
                                key={cat.categoryId}
                                value={cat.categoryName}
                            >
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>

                    <textarea
                        className="addincome-textarea"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <div className="addincome-buttons">
                        <button className="addincome-button-submit" type="submit">
                            Add Income
                        </button>

                        <button
                            className="addincome-button-cancel"
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

export default AddIncome;