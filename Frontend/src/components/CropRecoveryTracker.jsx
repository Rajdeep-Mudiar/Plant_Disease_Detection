import React, { useState } from "react";
import "./CropRecoveryTracker.css";
import { IconActivity, IconTrendingUp, IconCheck, IconClock, IconRefresh } from "./Icons";

const CropRecoveryTracker = ({ currentScan, onSelectCheckpoint }) => {
  const [timeline, setTimeline] = useState([
    {
      day: "Day 0",
      stage: "Baseline Infection",
      date: "Initial Scan",
      severityPct: currentScan?.prediction?.severity?.percentage || 45.0,
      lesions: currentScan?.prediction?.severity?.lesion_count || 5,
      treatmentApplied: "Mancozeb 75% WP + Bio-Stimulant",
      status: "Diagnosed",
    },
    {
      day: "Day 7",
      stage: "Foliar Healing",
      date: "Mid-Treatment Check",
      severityPct: Math.max(5, (currentScan?.prediction?.severity?.percentage || 45.0) * 0.45).toFixed(1),
      lesions: 2,
      treatmentApplied: "Copper Hydroxide Barrier Pass",
      status: "Improving",
    },
    {
      day: "Day 14",
      stage: "Canopy Recovery",
      date: "Post-Treatment Audit",
      severityPct: Math.max(1, (currentScan?.prediction?.severity?.percentage || 45.0) * 0.12).toFixed(1),
      lesions: 0,
      treatmentApplied: "Maintenance Compost Tea Foliar",
      status: "Resolved",
    },
  ]);

  const [selectedPointIndex, setSelectedPointIndex] = useState(0);

  const initialPct = parseFloat(timeline[0].severityPct);
  const currentPct = parseFloat(timeline[selectedPointIndex].severityPct);
  const healingIndex = Math.max(0, ((initialPct - currentPct) / (initialPct || 1)) * 100).toFixed(0);

  return (
    <div className="recovery-tracker-card">
      <div className="recovery-header-row">
        <div className="recovery-title-col">
          <div className="recovery-badge-row">
            <span className="recovery-icon-badge">
              <IconActivity size={16} />
            </span>
            <span className="recovery-tag-text">Multi-Day Healing Trajectory</span>
          </div>
          <h3 className="recovery-card-title">Foliar Pathology Recovery & Recovery Index</h3>
          <p className="recovery-card-sub">
            Track necrotic reduction and tissue regeneration over 14-day treatment milestones
          </p>
        </div>

        <div className="healing-score-pill">
          <span className="healing-score-num">{healingIndex}%</span>
          <span className="healing-score-label">Recovery Index</span>
        </div>
      </div>

      {/* SVG Interactive Trajectory Curve */}
      <div className="recovery-chart-container">
        <div className="chart-legend-row">
          <span className="legend-item">
            <span className="legend-dot active"></span> Necrotic Surface Area (%)
          </span>
          <span className="legend-target">Target: &lt; 5% Threshold</span>
        </div>

        <div className="trajectory-svg-wrap">
          <svg viewBox="0 0 500 120" className="trajectory-chart-svg">
            <defs>
              <linearGradient id="recoveryGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid guide lines */}
            <line x1="50" y1="20" x2="460" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
            <line x1="50" y1="60" x2="460" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />
            <line x1="50" y1="100" x2="460" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="3,3" />

            {/* Shaded Area */}
            <path
              d="M 80 30 Q 250 75 420 100 L 420 110 L 80 110 Z"
              fill="url(#recoveryGlow)"
            />

            {/* Smooth Curve */}
            <path
              d="M 80 30 Q 250 75 420 100"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Interactive Milestone Nodes */}
            <g
              className={`chart-node-group ${selectedPointIndex === 0 ? "active" : ""}`}
              onClick={() => setSelectedPointIndex(0)}
            >
              <circle cx="80" cy="30" r="7" className="chart-node-circle" />
              <text x="80" y="18" textAnchor="middle" className="chart-node-label">
                {timeline[0].severityPct}%
              </text>
            </g>

            <g
              className={`chart-node-group ${selectedPointIndex === 1 ? "active" : ""}`}
              onClick={() => setSelectedPointIndex(1)}
            >
              <circle cx="250" cy="72" r="7" className="chart-node-circle" />
              <text x="250" y="60" textAnchor="middle" className="chart-node-label">
                {timeline[1].severityPct}%
              </text>
            </g>

            <g
              className={`chart-node-group ${selectedPointIndex === 2 ? "active" : ""}`}
              onClick={() => setSelectedPointIndex(2)}
            >
              <circle cx="420" cy="100" r="7" className="chart-node-circle" />
              <text x="420" y="88" textAnchor="middle" className="chart-node-label">
                {timeline[2].severityPct}%
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Checkpoint Cards List */}
      <div className="recovery-milestones-grid">
        {timeline.map((point, idx) => {
          const isSelected = selectedPointIndex === idx;
          return (
            <div
              key={idx}
              className={`milestone-step-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedPointIndex(idx)}
            >
              <div className="milestone-top-row">
                <span className="milestone-day-pill">{point.day}</span>
                <span className={`milestone-status-badge ${point.status.toLowerCase()}`}>
                  {point.status}
                </span>
              </div>

              <h4 className="milestone-stage-name">{point.stage}</h4>
              <div className="milestone-metrics-row">
                <div>
                  <span className="m-metric-val">{point.severityPct}%</span>
                  <span className="m-metric-lbl">Necrotic Area</span>
                </div>
                <div>
                  <span className="m-metric-val">{point.lesions}</span>
                  <span className="m-metric-lbl">Active Spores</span>
                </div>
              </div>

              <div className="milestone-tx-note">
                <strong>Protocol:</strong> {point.treatmentApplied}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CropRecoveryTracker;
