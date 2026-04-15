import React from 'react'
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate= useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <div className="landing-navbar">
        <h1 className="landing-logo">ExpenseTracker</h1>
        <div className="landing-nav-buttons">
          <button onClick={() => navigate("/login")} className="landing-login-btn">Login</button>
          <button onClick={() => navigate("/register")} className="landing-register-btn">Sign Up</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="landing-hero">
        <div className="landing-hero-text">
          <h2>
            Take Control of Your <span> Finances</span>
          </h2>
          <p>
            Track your expenses, manage budgets, and gain insights into your spending habits — all in one place.
          </p>

          <div className="landing-hero-buttons">
            <button onClick={() => navigate("/register")} className="landing-primary-btn">
              Start Tracking
            </button>
            <button onClick={() => navigate("/login")} className="landing-secondary-btn">
              Login
            </button>
          </div>
        </div>

        <div className="landing-hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="finance"
          />
        </div>
      </div>

      {/* Features */}
      <div className="landing-features">
        <h3>Features</h3>

        <div className="landing-feature-cards">
          <div className="landing-card">
            <h4>Track Expenses</h4>
            <p>Easily log and monitor all your daily expenses.</p>
          </div>

          <div className="landing-card">
            <h4>Set Budgets</h4>
            <p>Create monthly budgets and stay within limits.</p>
          </div>

          <div className="landing-card">
            <h4>Visual Reports</h4>
            <p>Understand your spending with insightful charts.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        © 2026 ExpenseTracker. All rights reserved.
      </div>
    </div>
  );
}

export default LandingPage;