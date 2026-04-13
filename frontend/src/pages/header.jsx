import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

export default function Header({ active = "" }) {
  return (
    <nav className="main-nav">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand">
          <span>SRA System</span>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${active === "upload" ? "active" : ""}`}
          >
            Upload
          </Link>

          <Link
            to="/review"
            className={`nav-link ${active === "review" ? "active" : ""}`}
          >
            Review
          </Link>

          <Link
            to="/priority"
            className={`nav-link ${active === "priority" ? "active" : ""}`}
          >
            Priority
          </Link>

          <Link
            to="/volunteers"
            className={`nav-link ${active === "volunteers" ? "active" : ""}`}
          >
            Volunteers
          </Link>

          <Link
            to="/matching"
            className={`nav-link ${active === "matching" ? "active" : ""}`}
          >
            Matching
          </Link>

          <Link
            to="/dashboard"
            className={`nav-link ${active === "dashboard" ? "active" : ""}`}
          >
            Dashboard
          </Link>
        </div>

        {/* Status */}
        <div className="nav-status">
          <span className="status-indicator online"></span>
          <span>Online</span>
        </div>
      </div>
    </nav>
  );
}