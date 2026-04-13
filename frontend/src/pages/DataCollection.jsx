import React, { useState, useEffect } from "react";
import "./DataCollection.css";

const DataCollection = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRecording, setIsRecording] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const handleFile = () => {
    setShowPreview(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 200);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setTranscript(
        "Water shortage reported in Village A. Around 150 people affected."
      );
    }
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-brand">SRA System</div>

          <div className="nav-links">
            <a className="nav-link active">Upload</a>
            <a className="nav-link">Review</a>
            <a className="nav-link">Priority</a>
            <a className="nav-link">Volunteers</a>
            <a className="nav-link">Matching</a>
            <a className="nav-link">Dashboard</a>
          </div>

          <div className="nav-status">
            <span className={`status-indicator ${isOnline ? "" : "offline"}`} />
            {isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </nav>

      {!isOnline && (
        <div className="offline-indicator">
          📴 Offline Mode — Changes saved locally
        </div>
      )}

      <div className="container">
        {/* HEADER */}
        <header>
          <h1>Smart Resource Allocation System</h1>
          <p>Data Collection Module — Step 1</p>
        </header>

        {/* TABS */}
        <div className="nav-tabs">
          {["upload", "voice", "manual", "pending"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {activeTab === "upload" && (
          <div className="tab-content">
            <div className="upload-area" onClick={handleFile}>
              <div className="upload-icon">📂</div>
              <p>Click to simulate upload</p>
              <button className="btn btn-primary">Select File</button>
            </div>

            {showPreview && (
              <div className="preview-section">
                <h3>Processing...</h3>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <pre className="result-box">
{JSON.stringify(
  {
    issue: "Water shortage",
    location: "Village A",
    people: 150,
    severity: "high",
  },
  null,
  2
)}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === "voice" && (
          <div className="tab-content">
            <div className="voice-recorder">
              <button
                className={`mic-btn ${isRecording ? "recording" : ""}`}
                onClick={toggleRecording}
              >
                🎙️
              </button>
              <p>
                {isRecording
                  ? "Recording..."
                  : "Tap to start / stop recording"}
              </p>

              {transcript && (
                <textarea value={transcript} readOnly />
              )}
            </div>
          </div>
        )}

        {activeTab === "manual" && (
          <div className="tab-content">
            <form className="data-form">
              <input placeholder="Issue Type" />
              <input placeholder="Location" />
              <input type="number" placeholder="People Affected" />
              <select>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        )}

        {activeTab === "pending" && (
          <div className="tab-content">
            <div className="empty-state">No pending items</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCollection;