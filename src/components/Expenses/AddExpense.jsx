import React,{useState, useEffect} from 'react'
import './AddExpense.css'
import axios from "axios"
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const[categories,setCategories]=useState([]);
    const navigate = useNavigate();
    const [form, setForm]=useState({
        name:"",
        amount:"",
        description:"",
        date:"",
        categoryId:"",
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

    const fetchCategories=async()=>
    {
        try {
        const token = localStorage.getItem("accessToken");

        const result= await axios.get(`${import.meta.env.VITE_API_URL}/api/category?type=Expense`,{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        });
        setCategories(result.data);
    }
        catch(error)
        {
            console.error(error);
        }
    };
    useEffect(()=>{
        fetchCategories();
    },[]);

    const API= `${import.meta.env.VITE_API_URL}/api/Expense`;

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || form.name.trim().length < 2) {
        toast.error("Expense name must be at least 2 characters long.");
        return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
        toast.error("Amount must be greater than 0.");
        return;
    }

    if (!form.date) {
        toast.error("Expense date is required.");
        return;
    }

    if (!form.categoryId) {
        toast.error("Please select a category.");
        return;
    }

    try {
        const token = localStorage.getItem("accessToken");

        await axios.post(API, form, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        toast.success("Expense added successfully");
        navigate("/Expenses");

    } catch (error) {
        console.error("Full error:", error);
        console.error("Response data:", error.response?.data);

        const data = error.response?.data;
        let errorMessage = "Failed to add expense";

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
        <div className="addexpense-page">
        <div className="addexpense-card">

            <h2 className="addexpense-title">Add Expense</h2>

            <p className="addexpense-subtitle">
            Enter your expense details and save them
            </p>

            <form className="addexpense-form" onSubmit={handleSubmit}>

            <input
                className="addexpense-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Expense title"
                required
            />

            <input
                className="addexpense-input"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
            />

            <input
                className="addexpense-input"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
            />

            <select
                className="addexpense-input"
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

            <textarea
                className="addexpense-textarea"
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
            />

            <div className="addexpense-buttons">
                <button className="addexpense-button-submit" type="submit">
                Add Expense
                </button>

                <button
                className="addexpense-button-cancel"
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

export default AddExpense