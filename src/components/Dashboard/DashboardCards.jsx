import React from 'react'
import './DashboardCards.css' 

const DashboardCards = ({ summary }) => {

    
  if (!summary) {
    return (
      <div className="dashboard-cards-container">
        <div className="dashboard-cards-item">
          <h4 className="dashboard-cards-title">Net Balance</h4>
          <p className="dashboard-cards-value dashboard-cards-value-highlight">₹0</p>
        </div>

        <div className="dashboard-cards-item">
          <h4 className="dashboard-cards-title">Total Income</h4>
          <p className="dashboard-cards-value dashboard-cards-value-highlight">₹0</p>
        </div>

        <div className="dashboard-cards-item">
          <h4 className="dashboard-cards-title">Total Expenses</h4>
          <p className="dashboard-cards-value dashboard-cards-value-highlight">₹0</p>
        </div>

        <div className="dashboard-cards-item">
          <h4 className="dashboard-cards-title">This Month</h4>
          <p className="dashboard-cards-value">₹0</p>
          <p className="dashboard-cards-thismonth">₹0 - ₹0</p>
        </div>
      </div>
    );
  }

    const monthlyIncome = summary.thisMonthIncome || 0;
    const monthlyExpense = summary.thisMonthExpense || 0;

    const spentPercentage =
        monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0;

    const remainingPercentage =
        monthlyIncome > 0 ? Math.max(100 - spentPercentage, 0) : 0;

    const getBarWidth = () => {
        if (monthlyIncome === 0) return "0%";
        return `${Math.min(spentPercentage, 100)}%`;
    };

  
    return (
        <div className="dashboard-cards-wrapper">
        <div className="dashboard-cards-container">
            <div className="dashboard-cards-item">
            <h4 className="dashboard-cards-title">Net Balance</h4>
            <p className="dashboard-cards-value dashboard-cards-value-highlight">
                ₹{summary.netBalance.toLocaleString()}
            </p>
            </div>

            <div className="dashboard-cards-item">
            <h4 className="dashboard-cards-title">Total Income</h4>
            <p className="dashboard-cards-value">
                ₹{summary.totalIncome.toLocaleString()}
            </p>
            </div>

            <div className="dashboard-cards-item">
            <h4 className="dashboard-cards-title">Total Expenses</h4>
            <p className="dashboard-cards-value">
                ₹{summary.totalExpenses.toLocaleString()}
            </p>
            </div>

            <div className="dashboard-cards-item">
            <h4 className="dashboard-cards-title">This Month</h4>
            <p className="dashboard-cards-value">
                ₹{summary.thisMonth.toLocaleString()}
            </p>
            <p className="dashboard-cards-thismonth">
                ₹{summary.thisMonthIncome.toLocaleString()} - ₹{summary.thisMonthExpense.toLocaleString()}
            </p>
            </div>
        </div>

        <div className="dashboard-month-progress-card">
            <h4 className="dashboard-cards-title">Monthly Usage</h4>

            <div className="dashboard-month-progress-values">
            <span className="dashboard-month-income">
                Income ₹{monthlyIncome.toLocaleString()}
            </span>
            <span className="dashboard-month-expense">
                Expense ₹{monthlyExpense.toLocaleString()}
            </span>
            </div>

            <div className="dashboardcards-progress-track">
            <div
                className="dashboardcards-progress-spent"
                style={{ width: getBarWidth() }}
            ></div>
            </div>

            <div className="dashboardcards-progress-info">
            <span>Spent {spentPercentage.toFixed(1)}%</span>
            <span>Left {remainingPercentage.toFixed(1)}%</span>
            </div>
        </div>
        </div>
    );
    };

    export default DashboardCards;