import React from "react";
import "./Home.css";
import Footer from "../Common/Footer";


export default function Home() {
  return (
    <div className="home-container">

      {/* Hero Section */}
      <div className="home-hero">
        <div className="home-hero-text">
          <h2>
            Take Control of Your <span>Finances</span>
          </h2>
          <p>
            Track your expenses, manage budgets, and gain insights into your spending habits — all in one place.
          </p>
        </div>

        <div className="home-hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="finance"
          />
        </div>
      </div>

      {/* Features */}
      <div className="home-features">
        <h3>Features</h3>

        <div className="home-feature-cards">
          <div className="home-card">
            <h4>Track Expenses</h4>
            <p>Easily log and monitor all your daily expenses.</p>
          </div>

          <div className="home-card">
            <h4>Set Budgets</h4>
            <p>Create monthly budgets and stay within limits.</p>
          </div>

          <div className="home-card">
            <h4>Visual Reports</h4>
            <p>Understand your spending with insightful charts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}