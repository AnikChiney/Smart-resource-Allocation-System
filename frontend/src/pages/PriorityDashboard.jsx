import React, { useEffect, useState } from "react";
import "./priority.css";

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

export default function PriorityDashboard() {
  const [issues, setIssues] = useState([]);
  const [distribution, setDistribution] = useState({});
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [filters, setFilters] = useState({
    severity: "",
    issue_type: "",
    location: "",
    min_score: 0,
  });

  useEffect(() => {
    loadPriorities();
  }, []);

  const loadPriorities = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/priority/rank`);
      const data = await res.json();
      setIssues(data.ranked_issues);
      setFilteredIssues(data.ranked_issues);
      setDistribution(data.distribution);
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = () => {
    let data = [...issues];

    if (filters.severity) {
      data = data.filter((i) => i.severity === filters.severity);
    }

    if (filters.issue_type) {
      data = data.filter((i) =>
        (i.issue || "").toLowerCase().includes(filters.issue_type)
      );
    }

    if (filters.location) {
      data = data.filter((i) =>
        (i.location || "")
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }

    if (filters.min_score > 0) {
      data = data.filter((i) => i.priority_score >= filters.min_score);
    }

    setFilteredIssues(data);
  };

  return (
    <div className="priority-container">
      {/* HEADER */}
      <div className="priority-header">
        <div>
          <h1>🎯 Priority Dashboard</h1>
          <p>Issues ranked by urgency and impact</p>
        </div>
      </div>

      {/* DISTRIBUTION */}
      <div className="distribution-cards">
        {["CRITICAL", "HIGH", "MEDIUM", "LOW", "DEFERRED"].map((level) => (
          <div key={level} className={`dist-card ${level.toLowerCase()}`}>
            <div className="dist-count">{distribution[level] || 0}</div>
            <div className="dist-label">{level}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="filter-bar">
        <select
          onChange={(e) =>
            setFilters({ ...filters, severity: e.target.value })
          }
        >
          <option value="">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />

        <select
          onChange={(e) =>
            setFilters({ ...filters, min_score: Number(e.target.value) })
          }
        >
          <option value="0">All Scores</option>
          <option value="70">70+</option>
          <option value="85">85+</option>
        </select>

        <button onClick={applyFilters}>Apply</button>
      </div>

      {/* LIST */}
      <div className="priority-list">
        {filteredIssues.length === 0 ? (
          <p className="empty">No issues found</p>
        ) : (
          filteredIssues.map((issue, index) => {
            const level = (issue.priority_level || "medium").toLowerCase();

            return (
              <div key={index} className={`priority-item ${level}`}>
                <div className="rank-number">#{index + 1}</div>

                <div className="issue-info">
                  <h3>{issue.issue}</h3>
                  <p>
                    📍 {issue.location} • 👥 {issue.people_affected}
                  </p>

                  <div className="score-bar">
                    <div
                      className={`score-fill fill-${level}`}
                      style={{ width: `${issue.priority_score}%` }}
                    />
                  </div>
                </div>

                <div className="score">{issue.priority_score}</div>

                <div className={`priority-badge badge-${level}`}>
                  {issue.priority_level}
                </div>

                <button className="assign-btn">Assign</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}