import React, { useState } from "react";
import "./PheromoneTrapNetwork.css";
import { IconRadar, IconShield, IconActivity } from "./Icons";

const TRAP_NODES = [
  {
    id: "trap-1",
    name: "Trap #01 • North Potato Sector 1A",
    targetPest: "Potato Tuber Moth (Phthorimaea operculella)",
    lureType: "Synthetic Sex Pheromone Septa",
    count24h: 34,
    thresholdEIL: 20, // Economic Injury Level
    battery: "94% (Solar Recharge)",
    lastSync: "2 mins ago",
    status: "CRITICAL_EIL",
    icon: "🦋",
    locationCoords: "Lat 28.452, Long 77.021",
    aiConfidence: "98.4% Optical ML",
  },
  {
    id: "trap-2",
    name: "Trap #02 • Greenhouse Tomato Sector 1B",
    targetPest: "Silverleaf Whitefly (Bemisia tabaci)",
    lureType: "Yellow Sticky Wavelength + Kairomone",
    count24h: 12,
    thresholdEIL: 25,
    battery: "88%",
    lastSync: "5 mins ago",
    status: "NORMAL",
    icon: "🪰",
    locationCoords: "Lat 28.455, Long 77.024",
    aiConfidence: "96.1% Optical ML",
  },
  {
    id: "trap-3",
    name: "Trap #03 • Ridge Potato Sector 2A",
    targetPest: "Green Peach Aphid (Myzus persicae)",
    lureType: "Suction Trap + Yellow Visual Matrix",
    count24h: 42,
    thresholdEIL: 30,
    battery: "91%",
    lastSync: "Just now",
    status: "WARNING_EIL",
    icon: "🦗",
    locationCoords: "Lat 28.459, Long 77.028",
    aiConfidence: "99.1% Optical ML",
  },
  {
    id: "trap-4",
    name: "Trap #04 • Vineyard Sector 2B",
    targetPest: "Grape Berry Moth (Paralobesia viteana)",
    lureType: "Delta Pheromone Capsule",
    count24h: 6,
    thresholdEIL: 15,
    battery: "97%",
    lastSync: "12 mins ago",
    status: "OPTIMAL",
    icon: "🍇",
    locationCoords: "Lat 28.450, Long 77.019",
    aiConfidence: "97.5% Optical ML",
  },
];

export default function PheromoneTrapNetwork() {
  const [selectedTrapId, setSelectedTrapId] = useState("trap-1");
  const [simulatingLureRefresh, setSimulatingLureRefresh] = useState(false);

  const activeTrap = TRAP_NODES.find((t) => t.id === selectedTrapId) || TRAP_NODES[0];

  const handleRefreshLure = () => {
    setSimulatingLureRefresh(true);
    setTimeout(() => {
      setSimulatingLureRefresh(false);
    }, 1200);
  };

  return (
    <div className="pheromone-trap-card">
      <div className="trap-header">
        <div className="trap-title-group">
          <div className="trap-icon-frame">
            <IconRadar size={22} />
          </div>
          <div>
            <div className="trap-badge-row">
              <span className="trap-badge">AUTOMATED BIO-SURVEILLANCE</span>
              <span className="trap-sub-badge">Optical Pest Camera Network</span>
            </div>
            <h3 className="trap-main-title">Smart Pheromone Insect Trap Network & Optical AI</h3>
            <p className="trap-sub-title">
              IoT sticky and delta traps equipped with macro vision cameras automatically count pest landings every 24 hours, alerting you when populations cross the Economic Injury Level (EIL).
            </p>
          </div>
        </div>
      </div>

      <div className="trap-body-grid">
        {/* Left: Trap Node List */}
        <div className="trap-nodes-column">
          <div className="nodes-list">
            {TRAP_NODES.map((trap) => {
              const isSelected = selectedTrapId === trap.id;
              const isCritical = trap.count24h >= trap.thresholdEIL;

              return (
                <div
                  key={trap.id}
                  className={`trap-item-card ${isSelected ? "selected" : ""} ${isCritical ? "critical-border" : ""}`}
                  onClick={() => setSelectedTrapId(trap.id)}
                >
                  <div className="trap-item-top">
                    <span className="trap-item-icon">{trap.icon}</span>
                    <div className="trap-item-names">
                      <span className="trap-item-name">{trap.name.split("•")[0]}</span>
                      <span className="trap-item-sub">{trap.name.split("•")[1]}</span>
                    </div>
                  </div>

                  <div className="trap-item-bottom">
                    <div className="count-pill">
                      <span className="count-num">{trap.count24h}</span>
                      <span className="count-lbl">Pests / 24h</span>
                    </div>

                    <span className={`eil-tag ${isCritical ? "eil-danger" : "eil-safe"}`}>
                      {isCritical ? "⚠️ EIL Breached" : "🟢 Below EIL"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Trap Deep Inspector HUD */}
        <div className="trap-inspector-column">
          <div className="inspector-card">
            <div className="inspector-header">
              <div>
                <span className="insp-tag">CAMERA OPTICAL AI FEED</span>
                <h4 className="insp-name">{activeTrap.name}</h4>
              </div>
              <span className="insp-battery">🔋 {activeTrap.battery}</span>
            </div>

            {/* Virtual Camera Capture Viewport */}
            <div className="camera-viewport-box">
              <div className="viewport-overlay-header">
                <span className="rec-dot"></span>
                <span>AI OPTICAL COUNT: {activeTrap.count24h} TARGETS DETECTED</span>
              </div>

              {/* Simulated Sticky Matrix with Insect Bounding Boxes */}
              <div className="sticky-grid-matrix">
                {[...Array(Math.min(activeTrap.count24h, 16))].map((_, i) => (
                  <div key={i} className="pest-bounding-box">
                    <span className="bbox-tag">{activeTrap.targetPest.split(" ")[0]} ({activeTrap.aiConfidence})</span>
                    <span className="bbox-insect">{activeTrap.icon}</span>
                  </div>
                ))}
              </div>

              <div className="viewport-footer">
                <span>GPS: {activeTrap.locationCoords}</span>
                <span>SYNC: {activeTrap.lastSync}</span>
              </div>
            </div>

            {/* Trap Agronomic Details & Action Strip */}
            <div className="inspector-specs-grid">
              <div className="spec-tile">
                <span className="sp-label">Target Insect Pest:</span>
                <span className="sp-val">{activeTrap.targetPest}</span>
              </div>
              <div className="spec-tile">
                <span className="sp-label">Pheromone Lure:</span>
                <span className="sp-val">{activeTrap.lureType}</span>
              </div>
              <div className="spec-tile">
                <span className="sp-label">Economic Injury Level:</span>
                <span className="sp-val orange">&gt;{activeTrap.thresholdEIL} insects / 24h</span>
              </div>
              <div className="spec-tile">
                <span className="sp-label">Action Protocol:</span>
                <span className="sp-val blue">
                  {activeTrap.count24h >= activeTrap.thresholdEIL
                    ? "🚨 Deploy Bio-Pesticide / Trichogramma Parasitoid Wasps"
                    : "🟢 Routine scouting. No chemical spray warranted."}
                </span>
              </div>
            </div>

            <div className="trap-actions-bar">
              <button
                type="button"
                className="trap-action-btn"
                onClick={handleRefreshLure}
                disabled={simulatingLureRefresh}
              >
                {simulatingLureRefresh ? "🔄 Calibrating Sensor..." : "🧪 Virtual Lure Replacement"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
