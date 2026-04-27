import React from "react";
import "./ExpenseCards.css";

const ExpenseCards = ({ summary }) => {
  if (!summary) {
    return (
      <div className="expenses-cards-container">
        <div className="expenses-cards-item">
          <h4 className="expenses-cards-title">Total spent</h4>
          <p className="expenses-cards-value expenses-cards-value-highlight">₹0</p>
        </div>

        <div className="expenses-cards-item">
          <h4 className="expenses-cards-title">Transactions</h4>
          <p className="expenses-cards-value">0</p>
        </div>

        <div className="expenses-cards-item">
          <h4 className="expenses-cards-title">This Month</h4>
          <p className="expenses-cards-value">0</p>
        </div>

        <div className="expenses-cards-item">
          <h4 className="expenses-cards-title">Average</h4>
          <p className="expenses-cards-value">₹0.00</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expenses-cards-container">
      <div className="expenses-cards-item">
        <h4 className="expenses-cards-title">Total spent</h4>
        <p className="expenses-cards-value expenses-cards-value-highlight">
          ₹{summary.totalAmount.toLocaleString()}
        </p>
      </div>

      <div className="expenses-cards-item">
        <h4 className="expenses-cards-title">Transactions</h4>
        <p className="expenses-cards-value">{summary.totalTransactions}</p>
      </div>

      <div className="expenses-cards-item">
        <h4 className="expenses-cards-title">This Month</h4>
        <p className="expenses-cards-value">{summary.thisMonthTransactions}</p>
      </div>

      <div className="expenses-cards-item">
        <h4 className="expenses-cards-title">Average</h4>
        <p className="expenses-cards-value">₹{(summary.averageAmount ?? 0).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ExpenseCards;