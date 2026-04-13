import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import "chart.js/auto";
import Header from "./header";

const Dashboard = () => {
  const [stats, setStats] = useState({
    priorities: {},
    volunteers: {},
    issues: {},
    system_health: {},
    locations: {},
  });

  const [trends, setTrends] = useState(null);

  useEffect(() => {
    loadData();
    loadTrends();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard/stats");
      const data = await res.json();
      setStats(data || {});
    } catch (err) {
      console.error(err);
    }
  };

  const loadTrends = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/dashboard/trends?days=30"
      );
      const data = await res.json();
      setTrends(data);
    } catch (err) {
      console.error(err);
    }
  };

  const trendData = trends?.daily_activity
    ? {
        labels: Object.keys(trends.daily_activity).slice(-14),
        datasets: [
          {
            label: "New Issues",
            data: Object.values(trends.daily_activity)
              .map((d) => d.new)
              .slice(-14),
          },
          {
            label: "Resolved",
            data: Object.values(trends.daily_activity)
              .map((d) => d.resolved)
              .slice(-14),
          },
        ],
      }
    : null;

  return (
    <div>
      <Header active="dashboard" />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Command Dashboard</h1>
          <p>Real-time overview</p>
        </div>

        {/* KPI */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div>Critical Issues</div>
            <div className="kpi-value">
              {stats?.priorities?.CRITICAL || 0}
            </div>
          </div>

          <div className="kpi-card">
            <div>Volunteers</div>
            <div className="kpi-value">
              {stats?.volunteers?.active_available || 0}
            </div>
          </div>

          <div className="kpi-card">
            <div>Resolution Rate</div>
            <div className="kpi-value">
              {stats?.issues?.resolution_rate || 0}%
            </div>
          </div>

          <div className="kpi-card">
            <div>Match Quality</div>
            <div className="kpi-value">
              {Math.round(stats?.system_health?.data_quality_avg || 0)}%
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          <div className="chart-panel">
            <h3>Trends</h3>
            {trendData && <Line data={trendData} />}
          </div>

          <div className="chart-panel">
            <h3>Types</h3>
            <Doughnut
              data={{
                labels: ["Water", "Medical", "Education"],
                datasets: [{ data: [30, 25, 20] }],
              }}
            />
          </div>
        </div>

        {/* Heatmap */}
        <div className="heatmap-grid">
          {Object.entries(stats?.locations || {}).map(([loc, count]) => (
            <div key={loc} className="location-cell">
              <div>{loc}</div>
              <strong>{count}</strong>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="chart-panel">
          <h3>Volunteer Skills</h3>
          <Bar
            data={{
              labels: ["Medical", "Teaching", "Logistics"],
              datasets: [{ data: [45, 38, 52] }],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;