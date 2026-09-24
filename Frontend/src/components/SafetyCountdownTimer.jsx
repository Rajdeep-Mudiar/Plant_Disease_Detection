import React, { useState, useEffect } from "react";
import "./SafetyCountdownTimer.css";
import { IconClock, IconShield, IconAlert, IconCheck, IconPlus } from "./Icons";

const DEFAULT_CHEMICALS = [
  {
    id: 1,
    name: "Mancozeb 75% WP",
    targetCrop: "Potato (Plot Sector 4A)",
    appliedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    phiDays: 14, // Pre-Harvest Interval (days)
    reiHours: 24, // Restricted Entry Interval (hours)
    status: "active",
  },
  {
    id: 2,
    name: "Copper Hydroxide 53.8%",
    targetCrop: "Potato (Plot Sector 2B)",
    appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    phiDays: 7,
    reiHours: 48,
    status: "cleared",
  },
];

const PRESET_CHEMICAL_DATABASE = [
  { name: "Mancozeb 75% WP", defaultPhi: 14, defaultRei: 24 },
  { name: "Chlorothalonil 720 SC", defaultPhi: 7, defaultRei: 12 },
  { name: "Metalaxyl-M & Mancozeb (Ridomil Gold)", defaultPhi: 14, defaultRei: 48 },
  { name: "Copper Oxychloride 50 WP", defaultPhi: 1, defaultRei: 24 },
  { name: "Azoxystrobin 23% SC", defaultPhi: 3, defaultRei: 4 },
  { name: "Dimethomorph 50% WP", defaultPhi: 7, defaultRei: 12 },
  { name: "Neem Oil 1500 PPM (Organic)", defaultPhi: 0, defaultRei: 0 },
  { name: "Bacillus subtilis Bio-Fungicide", defaultPhi: 0, defaultRei: 4 },
];

const SafetyCountdownTimer = () => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("agropath_phi_logs");
    return saved ? JSON.parse(saved) : DEFAULT_CHEMICALS;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newChemical, setNewChemical] = useState({
    name: PRESET_CHEMICAL_DATABASE[0].name,
    targetCrop: "Potato (Sector 4A)",
    appliedDate: new Date().toISOString().split("T")[0],
    phiDays: 14,
    reiHours: 24,
  });

  useEffect(() => {
    localStorage.setItem("agropath_phi_logs", JSON.stringify(logs));
  }, [logs]);

  const handleChemicalChange = (e) => {
    const selected = PRESET_CHEMICAL_DATABASE.find((c) => c.name === e.target.value);
    if (selected) {
      setNewChemical({
        ...newChemical,
        name: selected.name,
        phiDays: selected.defaultPhi,
        reiHours: selected.defaultRei,
      });
    }
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      name: newChemical.name,
      targetCrop: newChemical.targetCrop,
      appliedDate: newChemical.appliedDate,
      phiDays: Number(newChemical.phiDays),
      reiHours: Number(newChemical.reiHours),
    };
    setLogs([newEntry, ...logs]);
    setShowAddModal(false);
  };

  const calculateStatus = (log) => {
    const applied = new Date(log.appliedDate).getTime();
    const now = Date.now();
    const daysPassed = (now - applied) / (1000 * 60 * 60 * 24);
    const hoursPassed = (now - applied) / (1000 * 60 * 60);

    const phiRemaining = Math.max(0, Math.ceil(log.phiDays - daysPassed));
    const reiRemaining = Math.max(0, Math.ceil(log.reiHours - hoursPassed));

    const percentPhiCompleted = Math.min(100, Math.round((daysPassed / (log.phiDays || 1)) * 100));

    const isReiCleared = reiRemaining === 0;
    const isPhiCleared = phiRemaining === 0;

    const safeHarvestDate = new Date(applied + log.phiDays * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      phiRemaining,
      reiRemaining,
      percentPhiCompleted,
      isReiCleared,
      isPhiCleared,
      safeHarvestDate,
    };
  };

  const handleDelete = (id) => {
    setLogs(logs.filter((l) => l.id !== id));
  };

  return (
    <div className="phi-safety-card">
      <div className="phi-header-bar">
        <div className="phi-title-group">
          <div className="phi-icon-frame">
            <IconClock size={18} />
          </div>
          <div>
            <h3 className="phi-main-title">Pre-Harvest Interval (PHI) & Chemical Safety Tracker</h3>
            <p className="phi-sub-title">Restricted-entry intervals, chemical residue clearance, and safe harvest countdowns</p>
          </div>
        </div>

        <button
          type="button"
          className="phi-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <IconPlus size={14} />
          <span>Log Spray Application</span>
        </button>
      </div>

      {/* Grid of Active Chemical Trackers */}
      <div className="phi-timers-grid">
        {logs.map((log) => {
          const stats = calculateStatus(log);
          return (
            <div key={log.id} className={`phi-timer-item ${stats.isPhiCleared ? "cleared" : "active-quarantine"}`}>
              <div className="phi-timer-top">
                <div>
                  <h4 className="phi-chem-name">{log.name}</h4>
                  <span className="phi-crop-badge">{log.targetCrop}</span>
                </div>
                <div className={`phi-badge ${stats.isPhiCleared ? "safe" : "quarantine"}`}>
                  {stats.isPhiCleared ? (
                    <>
                      <IconCheck size={12} />
                      <span>Safe to Harvest</span>
                    </>
                  ) : (
                    <>
                      <IconAlert size={12} />
                      <span>Quarantine Active</span>
                    </>
                  )}
                </div>
              </div>

              {/* Progress & Countdown */}
              <div className="phi-progress-block">
                <div className="phi-countdown-main">
                  <span className="phi-days-number">{stats.phiRemaining}</span>
                  <div className="phi-days-unit">
                    <span>Days Remaining</span>
                    <small>PHI: {log.phiDays} Days Standard</small>
                  </div>
                </div>

                <div className="phi-progress-bar-bg">
                  <div
                    className={`phi-progress-bar-fill ${stats.isPhiCleared ? "full" : ""}`}
                    style={{ width: `${stats.percentPhiCompleted}%` }}
                  />
                </div>
              </div>

              {/* Safety Metrics Strip */}
              <div className="phi-metrics-strip">
                <div className="phi-metric-col">
                  <span className="phi-m-label">Applied Date</span>
                  <span className="phi-m-val">{log.appliedDate}</span>
                </div>
                <div className="phi-metric-col">
                  <span className="phi-m-label">Earliest Harvest</span>
                  <span className="phi-m-val highlight">{stats.safeHarvestDate}</span>
                </div>
                <div className="phi-metric-col">
                  <span className="phi-m-label">Worker REI Status</span>
                  <span className={`phi-m-val ${stats.isReiCleared ? "cleared-text" : "restricted-text"}`}>
                    {stats.isReiCleared ? "Entry Safe (PPE Optional)" : `Restricted (${stats.reiRemaining}h left)`}
                  </span>
                </div>
              </div>

              <div className="phi-timer-footer">
                <span className="phi-compliance-text">EPA / FAO Residue Guidelines Compliance</span>
                <button
                  type="button"
                  className="phi-del-btn"
                  onClick={() => handleDelete(log.id)}
                  title="Remove record"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="phi-modal-overlay">
          <div className="phi-modal-box">
            <div className="phi-modal-header">
              <h4 className="phi-modal-title">Log Chemical Spray Application</h4>
              <button
                type="button"
                className="phi-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddLog} className="phi-form">
              <div className="form-group">
                <label>Fungicide / Chemical Active Ingredient</label>
                <select
                  value={newChemical.name}
                  onChange={handleChemicalChange}
                  className="phi-input"
                >
                  {PRESET_CHEMICAL_DATABASE.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} (PHI: {c.defaultPhi}d, REI: {c.defaultRei}h)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Field Plot / Sector</label>
                <input
                  type="text"
                  className="phi-input"
                  value={newChemical.targetCrop}
                  onChange={(e) => setNewChemical({ ...newChemical, targetCrop: e.target.value })}
                  placeholder="e.g. Potato Sector 4A"
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Application Date</label>
                  <input
                    type="date"
                    className="phi-input"
                    value={newChemical.appliedDate}
                    onChange={(e) => setNewChemical({ ...newChemical, appliedDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>PHI (Days to Harvest)</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    className="phi-input"
                    value={newChemical.phiDays}
                    onChange={(e) => setNewChemical({ ...newChemical, phiDays: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="phi-modal-actions">
                <button
                  type="button"
                  className="phi-btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="phi-btn-primary">
                  Start Safety Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyCountdownTimer;
