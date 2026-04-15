import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API = `${import.meta.env.VITE_API_URL}/api/Auth/forgot-password`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(API, {
        email: email.trim(),
      });

      toast.success(res.data.message || "OTP sent to your email");

      navigate("/ResetPassword", {
        state: { email: email.trim() },
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="forgotpassword-page">
      <div className="forgotpassword-card">
        <form onSubmit={handleSubmit} className="forgotpassword-form">
          <h2 className="forgotpassword-title">Forgot Password</h2>
          <p className="forgotpassword-subtitle">
            Enter your email to receive an OTP
          </p>

          <input
            type="email"
            className="forgotpassword-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="forgotpassword-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <button
            type="button"
            className="forgotpassword-back"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;