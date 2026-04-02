import React from "react";
import "./ExpenseCards.css";

const ExpenseCards = ({ expenses }) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;

  const avg = count > 0 ? (total / count) : 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  return (
    <div className="expenses-cards-container">
      <div className="expenses-cards-item">
        <h4 className="expenses-cards-title">Total spent</h4>
        <p className="expenses-cards-value expenses-cards-value-highlight">
          ₹{total.toLocaleString()}
        </p>
      </div>

      <div className="expenses-cards-item">
        <h4 className="expenses-cards-title">Transactions</h4>
        <p className="expenses-cards-value">{count}</p>
      </div>

      <div className="expenses-cards-item">
        <h4 className="expenses-cards-title">This Month</h4>
        <p className="expenses-cards-value">{thisMonth}</p>
      </div>

      <div className="expenses-cards-item">
        <h4 className="expenses-cards-title">Average</h4>
        <p className="expenses-cards-value">₹{avg.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ExpenseCards;