import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.css";

export default function Header() {
  const location = useLocation();
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
            className={`nav-link ${location.pathname === "/review" ? "active" : ""}`}
          >
            Upload
          </Link>

          <Link
            to="/review"
            className={`nav-link ${location.pathname === "/review" ? "active" : ""}`}
          >
            Review
          </Link>

          <Link
            to="/priority"
            className={`nav-link ${location.pathname === "/review" ? "active" : ""}`}
          >
            Priority
          </Link>

          <Link
            to="/volunteers"
            className={`nav-link ${location.pathname === "/review" ? "active" : ""}`}
          >
            Volunteers
          </Link>

          <Link
            to="/matching"
            className={`nav-link ${location.pathname === "/review" ? "active" : ""}`}
          >
            Matching
          </Link>

          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === "/review" ? "active" : ""}`}
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