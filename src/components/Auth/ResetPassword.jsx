import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const isLoggedIn = !!token;

  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const RESET_API = `${import.meta.env.VITE_API_URL}/api/Auth/reset-password`;
  const CHANGE_API = `${import.meta.env.VITE_API_URL}/api/Auth/change-password`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      if (!form.currentPassword.trim()) {
        toast.error("Current password is required");
        return;
      }
    } else {
      if (!form.email.trim()) {
        toast.error("Email is required");
        return;
      }

      if (!form.otp.trim()) {
        toast.error("OTP is required");
        return;
      }
    }

    if (!form.newPassword.trim()) {
      toast.error("New password is required");
      return;
    }

    if (!form.confirmPassword.trim()) {
      toast.error("Confirm password is required");
      return;
    }

    if (form.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      let res;

      if (isLoggedIn) {
        res = await axios.post(
          CHANGE_API,
          {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        res = await axios.post(RESET_API, {
          email: form.email.trim(),
          otp: form.otp.trim(),
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        });
      }

      toast.success(res.data.message || "Password updated successfully");

      if (isLoggedIn) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resetpassword-page">
      <div className="resetpassword-card">
        <form onSubmit={handleSubmit} className="resetpassword-form">
          <h2 className="resetpassword-title">
            {isLoggedIn ? "Change Password" : "Reset Password"}
          </h2>

          <p className="resetpassword-subtitle">
            {isLoggedIn
              ? "Enter your current password and set a new one"
              : "Enter the OTP sent to your email and set a new password"}
          </p>

          {!isLoggedIn && (
            <>
              <input
                type="email"
                name="email"
                className="resetpassword-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="otp"
                className="resetpassword-input"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                required
              />
            </>
          )}

          {isLoggedIn && (
            <input
              type="password"
              name="currentPassword"
              className="resetpassword-input"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="password"
            name="newPassword"
            className="resetpassword-input"
            placeholder="Enter new password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            className="resetpassword-input"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="resetpassword-button"
            disabled={loading}
          >
            {loading
              ? isLoggedIn
                ? "Changing..."
                : "Resetting..."
              : isLoggedIn
              ? "Change Password"
              : "Reset Password"}
          </button>

          <p
            className="resetpassword-back"
            onClick={() => navigate(isLoggedIn ? "/home" : "/login")}
          >
            {isLoggedIn ? "Back to Home" : "Back to Login"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;