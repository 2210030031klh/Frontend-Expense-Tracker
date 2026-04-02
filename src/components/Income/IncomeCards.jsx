import React from "react";
import "./IncomeCards.css";

const IncomeCards = ({ incomes }) => {
  const total = incomes.reduce((sum, i) => sum + i.amount, 0);
  const count = incomes.length;

  const avg = count > 0 ? (total / count):0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonth = incomes.filter((i) => {
    const d = new Date(i.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  return (
    <div className="income-cards-container">
      <div className="income-cards-item">
        <h4 className="income-cards-title">Total Income</h4>
        <p className="income-cards-value income-cards-value-highlight">
          ₹{total.toLocaleString()}
        </p>
      </div>

      <div className="income-cards-item">
        <h4 className="income-cards-title">Transactions</h4>
        <p className="income-cards-value">{count}</p>
      </div>

      <div className="income-cards-item">
        <h4 className="income-cards-title">This Month</h4>
        <p className="income-cards-value">{thisMonth}</p>
      </div>

      <div className="income-cards-item">
        <h4 className="income-cards-title">Average</h4>
        <p className="income-cards-value">₹{avg.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default IncomeCards;