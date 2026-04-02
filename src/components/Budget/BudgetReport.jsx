import React from "react";

const BudgetReport = ({
  report,
  summary,
  maxChartValue,
  formatCurrency,
}) => {
  const getBarWidth = (spent, budget) => {
    if (!budget || budget <= 0) return "0%";
    return `${Math.min((spent / budget) * 100, 100)}%`;
  };

  return (
    <div className="budget-grid">
      <div className="budget-card">
        <h3 className="budget-card-title">Category Budgets</h3>

        {report.length === 0 ? (
          <p className="budget-empty">No budget report found</p>
        ) : (
          report.map((item, index) => (
            <div className="budget-row" key={`${item.categoryName}-${index}`}>
              <div className="budget-row-top">
                <span className="budget-category">{item.categoryName}</span>
                <span className="budget-values">
                  ₹{formatCurrency(item.spentAmount)} / ₹
                  {formatCurrency(item.budgetAmount)}
                </span>
              </div>

              <div className="budget-progress">
                <div
                  className={`budget-progress-fill ${
                    item.isOverBudget ? "over" : ""
                  }`}
                  style={{
                    width: getBarWidth(item.spentAmount, item.budgetAmount),
                  }}
                ></div>
              </div>

              <div className="budget-row-bottom">
                <span className={item.isOverBudget ? "over-text" : "safe-text"}>
                  {item.isOverBudget
                    ? `Over by ₹${formatCurrency(
                        Math.abs(item.remainingAmount)
                      )}`
                    : `Remaining ₹${formatCurrency(item.remainingAmount)}`}
                </span>

                <span>{Number(item.percentage).toFixed(0)}%</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="budget-side">
        <div className="budget-card">
          <h3 className="budget-card-title">Budget Summary</h3>

          <div className="budget-summary-row">
            <span>Total Budget</span>
            <strong>₹{formatCurrency(summary.totalBudget)}</strong>
          </div>

          <div className="budget-summary-row">
            <span>Total Spent</span>
            <strong>₹{formatCurrency(summary.totalSpent)}</strong>
          </div>

          <div className="budget-summary-row">
            <span>Remaining</span>
            <strong
              className={
                summary.remaining < 0
                  ? "summary-negative"
                  : "summary-positive"
              }
            >
              ₹{formatCurrency(summary.remaining)}
            </strong>
          </div>
        </div>

        <div className="budget-card">
          <h3 className="budget-card-title">Budget vs Actual</h3>

          <div className="budget-chart">
            {report.map((item, index) => {
              const budgetHeight =
                maxChartValue > 0
                  ? (item.budgetAmount / maxChartValue) * 150
                  : 0;

              const spentHeight =
                maxChartValue > 0
                  ? (item.spentAmount / maxChartValue) * 150
                  : 0;

              return (
                <div className="budget-chart-item" key={index}>
                  <div className="budget-chart-bars">
                    <div
                      className="budget-chart-bar budget-bar"
                      style={{ height: `${budgetHeight}px` }}
                    ></div>
                    <div
                      className={`budget-chart-bar spent-bar ${
                        item.isOverBudget ? "spent-over" : ""
                      }`}
                      style={{ height: `${spentHeight}px` }}
                    ></div>
                  </div>
                  <p className="budget-chart-label">
                    {item.categoryName.length > 6
                      ? item.categoryName.slice(0, 6)
                      : item.categoryName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetReport;