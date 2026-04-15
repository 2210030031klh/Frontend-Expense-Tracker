import React from "react";
import "./IncomeCards.css";

const IncomeCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="income-cards-container">
      <div className="income-cards-item">
        <h4 className="income-cards-title">Total Income</h4>
        <p className="income-cards-value income-cards-value-highlight">
          ₹{(summary.totalAmount ?? 0).toLocaleString()}
        </p>
      </div>

      <div className="income-cards-item">
        <h4 className="income-cards-title">Transactions</h4>
        <p className="income-cards-value">{summary.totalTransactions ?? 0}</p>
      </div>

      <div className="income-cards-item">
        <h4 className="income-cards-title">This Month</h4>
        <p className="income-cards-value">{summary.thisMonthTransactions ?? 0}</p>
      </div>

      <div className="income-cards-item">
        <h4 className="income-cards-title">Average</h4>
        <p className="income-cards-value">
          ₹{(summary.averageAmount ?? 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default IncomeCards;