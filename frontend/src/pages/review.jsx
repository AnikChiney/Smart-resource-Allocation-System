import React, { useEffect, useState } from "react";
import "./review.css";

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

export default function Review() {
  const [issues, setIssues] = useState([]);
  const [grade, setGrade] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/issues`);
      const data = await res.json();
      setIssues(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = issues.filter((i) => {
    const matchGrade = grade
      ? i.data_quality?.grade === grade
      : true;

    const matchSearch = search
      ? (i.location || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      : true;

    return matchGrade && matchSearch;
  });

  const avgQuality =
    issues.length > 0
      ? Math.round(
          issues.reduce(
            (sum, i) => sum + (i.data_quality?.overall || 0),
            0
          ) / issues.length
        )
      : 0;

  const highGrades = issues.filter((i) =>
    ["A", "B"].includes(i.data_quality?.grade)
  ).length;

  const needsReview = issues.filter(
    (i) =>
      ["C", "D"].includes(i.data_quality?.grade) || i.is_duplicate
  ).length;

  return (
    <div className="review-container">
      <header className="page-header">
        <h1>Data Review & Cleaning</h1>
        <p>Review, validate and clean collected data before prioritization.</p>
      </header>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-value">{issues.length}</div>
          <div className="stat-label">Total Issues</div>
        </div>

        <div className="stat-card success">
          <div className="stat-value">{avgQuality}%</div>
          <div className="stat-label">Average Quality</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{highGrades}</div>
          <div className="stat-label">High Quality</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-value">{needsReview}</div>
          <div className="stat-label">Needs Review</div>
        </div>
      </div>

      {/* Filters */}
      <div className="actions-bar">
        <button className="btn btn-primary" onClick={loadIssues}>
          Refresh
        </button>

        <select
          className="prime-select"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">All Grades</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <input
          className="prime-input"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="issues-table">
        <table>
          <thead>
            <tr>
              <th>Quality</th>
              <th>Issue</th>
              <th>Location</th>
              <th>People</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((i) => (
              <tr key={i.id}>
                <td>
                  <span className={`quality-badge grade-${i.data_quality?.grade?.toLowerCase()}`}>
                    {i.data_quality?.grade || "D"}
                  </span>
                </td>
                <td>{i.issue}</td>
                <td>{i.location}</td>
                <td>{i.people_affected}</td>
                <td className={`severity-${i.severity}`}>
                  {i.severity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}