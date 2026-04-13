import React, { useEffect, useState } from "react";
import "./Matching.css";
import Header from "./header";

const Matching = () => {
  const [allIssues, setAllIssues] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    available: 0,
    matched: 0,
    avgScore: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadIssues(), loadStats()]);
  };

  const loadIssues = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/issues");
      const data = await res.json();
      const pending = data.filter((i) => i.status === "pending");

      setAllIssues(pending);
      setStats((prev) => ({ ...prev, pending: pending.length }));
    } catch {
      alert("Failed to load issues");
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/volunteers?active_only=true"
      );
      const data = await res.json();

      setStats((prev) => ({ ...prev, available: data.count }));
    } catch (e) {
      console.error(e);
    }
  };

  const selectIssue = async (issueId) => {
    setSelectedIssueId(issueId);

    try {
      const res = await fetch("http://localhost:5000/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue_id: issueId,
          min_score: 30,
          max_results: 5,
        }),
      });

      const data = await res.json();
      setMatches(data.matches);
    } catch {
      alert("Failed to load matches");
    }
  };

  const executeMatch = async (volunteerId, issueId) => {
    if (!window.confirm("Confirm assignment?")) return;

    try {
      await fetch("http://localhost:5000/api/match/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volunteer_id: volunteerId,
          issue_id: issueId,
        }),
      });

      alert("Assigned successfully");
      setAllIssues((prev) => prev.filter((i) => i.id !== issueId));
      setMatches([]);
      loadStats();
    } catch {
      alert("Assignment failed");
    }
  };

  return (
    <div className="matching-container">
      <Header active="matching" />  
      {/* Header */}
      <div className="matching-header">
        <div>
          <h1>🔗 Smart Matching System</h1>
          <p>AI-powered volunteer-task assignment optimization</p>
        </div>
        <button className="btn-auto-match">⚡ Auto-Match All Pending</button>
      </div>

      {/* Stats */}
      <div className="match-stats">
        <div className="match-stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending Issues</div>
        </div>

        <div className="match-stat-card">
          <div className="stat-number">{stats.available}</div>
          <div className="stat-label">Available Volunteers</div>
        </div>

        <div className="match-stat-card">
          <div className="stat-number">{stats.matched}</div>
          <div className="stat-label">Optimal Matches</div>
        </div>

        <div className="match-stat-card">
          <div className="stat-number">{stats.avgScore}%</div>
          <div className="stat-label">Avg Match Quality</div>
        </div>
      </div>

      {/* Layout */}
      <div className="match-layout">
        {/* Issues */}
        <div className="panel">
          <div className="panel-header">📋 Pending Issues</div>
          <div className="panel-body">
            {allIssues.map((issue) => (
              <div
                key={issue.id}
                className={`issue-item ${
                  selectedIssueId === issue.id ? "selected" : ""
                }`}
                onClick={() => selectIssue(issue.id)}
              >
                <div
                  className={`issue-priority priority-${issue.priority_level.toLowerCase()}`}
                >
                  {issue.priority_level}
                </div>

                <h4>{issue.issue}</h4>
                <p>
                  📍 {issue.location} • 👥 {issue.people_affected}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Matches */}
        <div className="panel">
          <div className="panel-header">🎯 Recommended Matches</div>
          <div className="panel-body">
            {matches.length === 0 ? (
              <p>Select an issue to see matches</p>
            ) : (
              matches.map((match) => {
                const vol = match.volunteer;
                const details = match.match_details;

                return (
                  <div
                    key={vol.id}
                    className={`match-card ${details.match_quality}`}
                  >
                    <div className="match-header">
                      <h3>{vol.name}</h3>
                      <div className="match-score">
                        {details.overall_score}
                      </div>
                    </div>

                    <p>📍 {vol.location}</p>

                    <div className="match-actions">
                      <button
                        className="btn-primary"
                        onClick={() =>
                          executeMatch(vol.id, selectedIssueId)
                        }
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matching;