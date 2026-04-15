import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
      <p>Contact: +91 9876543210 | support@expensetracker.com</p>
    </footer>
  );
};

export default Footer;