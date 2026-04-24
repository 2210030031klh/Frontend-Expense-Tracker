import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
      <p>
        Contact: +91 8096766928 |{" "}
        <span className="footer-email">
          <a href="mailto:gshashidhar.reddyy@gmail.com">
            gshashidhar.reddyy@gmail.com
          </a>
        </span>
      </p>
    </footer>
  );
};

export default Footer;