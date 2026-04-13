import React, { useEffect, useState } from "react";
import "./volunteers.css";
import Header from "./header";

const API = "http://localhost:5000";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [skill, setSkill] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    busy: 0,
    tasks: 0,
  });

  useEffect(() => {
    loadVolunteers();
    loadStats();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, status, skill, volunteers]);

  const loadVolunteers = async () => {
    try {
      const res = await fetch(`${API}/api/volunteers`);
      const data = await res.json();
      setVolunteers(data.volunteers || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${API}/api/volunteers/stats`);
      const data = await res.json();
      setStats({
        total: data.total_volunteers,
        active: data.active_available,
        busy: data.currently_assigned,
        tasks: data.total_tasks_completed,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const filterData = () => {
    let data = [...volunteers];

    if (search) {
      data = data.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      data = data.filter((v) => v.status === status);
    }

    if (skill) {
      data = data.filter((v) => v.skills.includes(skill));
    }

    setFiltered(data);
  };

  return (
    <div>
      <Header active="volunteers" />

      <div className="volunteer-container">
        {/* HEADER */}
        <div className="volunteer-header">
          <div>
            <h1>Volunteer Management</h1>
            <p>Register, manage and assign volunteers</p>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-overview">
          <div className="stat-box">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>

          <div className="stat-box">
            <div className="stat-number">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>

          <div className="stat-box">
            <div className="stat-number">{stats.busy}</div>
            <div className="stat-label">Busy</div>
          </div>

          <div className="stat-box">
            <div className="stat-number">{stats.tasks}</div>
            <div className="stat-label">Tasks Done</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="action-bar">
          <input
            className="prime-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="prime-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="busy">Busy</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="prime-select"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          >
            <option value="">All Skills</option>
            <option value="medical">Medical</option>
            <option value="teaching">Teaching</option>
            <option value="logistics">Logistics</option>
          </select>
        </div>

        {/* GRID */}
        <div className="volunteer-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">No volunteers found</div>
          ) : (
            filtered.map((v) => (
              <div key={v.id} className={`volunteer-card status-${v.status}`}>
                <div className="card-header">
                  <div>
                    <h3>{v.name}</h3>
                    <p>{v.location}</p>
                  </div>
                  <span className={`badge-${v.status}`}>
                    {v.status}
                  </span>
                </div>

                <div className="skills-container">
                  {v.skills?.map((s, i) => (
                    <span key={i} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="card-actions">
                  <button className="btn btn-primary">
                    Assign
                  </button>
                  <button className="btn btn-secondary">
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}