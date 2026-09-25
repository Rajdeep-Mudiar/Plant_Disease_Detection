import React, { useState } from "react";
import "./GroundRoverScanner.css";
import { IconActivity, IconShield, IconRadar } from "./Icons";

const ROVER_POSITIONS = [
  {
    id: "ridge_1",
    label: "Row #04 • Sector 1A (Potato Ridge)",
    canopyZone: "Under-Canopy Stem Collar",
    speed: "0.8 m/s",
    battery: "89% Lithium-Iron",
    inspection: "Stem collar intact. Minor white mold hyphae detected on 1 stem.",
    risk: "LOW",
    underLeafAphids: 3,
    soilCrusting: "12% (Light Crusting)",
    stemLesions: 1,
  },
  {
    id: "ridge_2",
    label: "Row #12 • Sector 2A (Ridge Potato)",
    canopyZone: "Sub-Canopy Lower Foliage",
    speed: "0.6 m/s",
    battery: "82%",
    inspection: "Heavy Rhizoctonia black scurf mycelium detected around crown roots.",
    risk: "HIGH",
    underLeafAphids: 18,
    soilCrusting: "38% (Compacted Furrow)",
    stemLesions: 6,
  },
  {
    id: "ridge_3",
    label: "Row #08 • Sector 3A (Sweet Corn Furrow)",
    canopyZone: "Basal Internode & Brace Roots",
    speed: "1.2 m/s",
    battery: "76%",
    inspection: "Healthy brace root anchoring. Clean furrow drip moisture.",
    risk: "OPTIMAL",
    underLeafAphids: 0,
    soilCrusting: "5% (Porous)",
    stemLesions: 0,
  },
];

export default function GroundRoverScanner() {
  const [selectedRidgeId, setSelectedRidgeId] = useState("ridge_1");
  const [roverMoving, setRoverMoving] = useState(false);
  const [spotlightOn, setSpotlightOn] = useState(true);

  const activePos = ROVER_POSITIONS.find((r) => r.id === selectedRidgeId) || ROVER_POSITIONS[0];

  const handleDriveNextRow = () => {
    setRoverMoving(true);
    setTimeout(() => {
      setSelectedRidgeId((prev) => (prev === "ridge_1" ? "ridge_2" : prev === "ridge_2" ? "ridge_3" : "ridge_1"));
      setRoverMoving(false);
    }, 1000);
  };

  return (
    <div className="ground-rover-card">
      <div className="rover-header">
        <div className="rover-title-group">
          <div className="rover-icon-frame">
            <IconRadar size={22} />
          </div>
          <div>
            <div className="rover-badge-row">
              <span className="rover-badge">GROUND ROBOTICS TELE-OPERATION</span>
              <span className="rover-sub-badge">Sub-Canopy Micro-Rover Feed</span>
            </div>
            <h3 className="rover-main-title">Autonomous Ground Ag-Rover Sub-Canopy Scanner</h3>
            <p className="rover-sub-title">
              Navigates beneath the dense crop canopy where aerial drones cannot see, scanning stem bases for Rhizoctonia cankers, under-leaf aphid colonies, and soil compaction.
            </p>
          </div>
        </div>

        <div className="rover-battery-pill">
          <span className="rover-dot"></span>
          <span>ROVER ONLINE • {activePos.battery}</span>
        </div>
      </div>

      <div className="rover-body-grid">
        {/* Left: Real-Time Sub-Canopy Video Feed Simulation */}
        <div className="rover-viewport-column">
          <div className="rover-camera-box">
            <div className="cam-hud-header">
              <div className="cam-live-indicator">
                <span className="live-rec-dot"></span>
                <span>CAM 01 • SUB-CANOPY LIDAR STEREO</span>
              </div>
              <span className="cam-speed">{roverMoving ? "🚀 NAVIGATING..." : `SPEED: ${activePos.speed}`}</span>
            </div>

            {/* Virtual Sub-Canopy View */}
            <div className={`sub-canopy-scene ${spotlightOn ? "spotlight-active" : ""}`}>
              {/* Plant Stems and Under-Canopy Ground */}
              <svg viewBox="0 0 400 220" className="sub-canopy-svg">
                <defs>
                  <linearGradient id="groundSoilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#451a03" />
                    <stop offset="100%" stopColor="#1c1917" />
                  </linearGradient>
                  <radialGradient id="spotlightBeam" cx="50%" cy="10%" r="90%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="60%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Ground Furrow */}
                <path d="M 0 140 Q 200 110, 400 140 L 400 220 L 0 220 Z" fill="url(#groundSoilGrad)" />

                {/* Stems */}
                <path d="M 90 140 Q 80 40, 60 0" stroke="#15803d" strokeWidth="18" fill="none" />
                <path d="M 200 130 Q 200 30, 190 0" stroke="#16a34a" strokeWidth="22" fill="none" />
                <path d="M 310 145 Q 320 45, 340 0" stroke="#15803d" strokeWidth="18" fill="none" />

                {/* Under-Canopy Overhanging Leaves */}
                <ellipse cx="140" cy="50" rx="70" ry="24" fill="#22c55e" opacity="0.8" />
                <ellipse cx="260" cy="45" rx="80" ry="26" fill="#16a34a" opacity="0.85" />

                {/* Stem Cankers / Lesions */}
                {activePos.stemLesions > 0 && (
                  <g>
                    <ellipse cx="200" cy="115" rx="9" ry="14" fill="#78350f" stroke="#ef4444" strokeWidth="1.5" />
                    <text x="220" y="118" fill="#ef4444" fontSize="10" fontWeight="800">Canker Detected</text>
                  </g>
                )}

                {/* Spotlight Cone */}
                {spotlightOn && (
                  <polygon points="120,0 280,0 400,220 0,220" fill="url(#spotlightBeam)" pointerEvents="none" />
                )}
              </svg>

              {/* HUD Telemetry Overlay */}
              <div className="hud-corner-tl">
                <span>POS: {activePos.label}</span>
                <span>ZONE: {activePos.canopyZone}</span>
              </div>
              <div className="hud-corner-br">
                <span className={`risk-badge-rover ${activePos.risk.toLowerCase()}`}>
                  STATUS: {activePos.risk}
                </span>
              </div>
            </div>

            <div className="cam-controls-bar">
              <button
                type="button"
                className="cam-tool-btn"
                onClick={() => setSpotlightOn(!spotlightOn)}
              >
                {spotlightOn ? "💡 Spotlight ON" : "🌑 Spotlight OFF"}
              </button>
              <button
                type="button"
                className="cam-tool-btn primary"
                onClick={handleDriveNextRow}
                disabled={roverMoving}
              >
                {roverMoving ? "Driving..." : "🚜 Drive to Next Ridge"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Inspection Metrics & Agronomic Findings */}
        <div className="rover-metrics-column">
          <div className="rover-findings-card">
            <h4 className="findings-title">Sub-Canopy Autonomous Findings</h4>
            <p className="findings-desc">{activePos.inspection}</p>

            <div className="rover-stats-grid">
              <div className="r-stat-box">
                <span className="rs-lbl">Under-Leaf Aphids:</span>
                <span className={`rs-val ${activePos.underLeafAphids > 10 ? "red" : "green"}`}>
                  {activePos.underLeafAphids} / Leaf
                </span>
              </div>

              <div className="r-stat-box">
                <span className="rs-lbl">Soil Furrow Crusting:</span>
                <span className="rs-val orange">{activePos.soilCrusting}</span>
              </div>

              <div className="r-stat-box">
                <span className="rs-lbl">Stem Base Lesions:</span>
                <span className={`rs-val ${activePos.stemLesions > 0 ? "red" : "green"}`}>
                  {activePos.stemLesions} Lesions Found
                </span>
              </div>

              <div className="r-stat-box">
                <span className="rs-lbl">Rover Lidar Navigation:</span>
                <span className="rs-val blue">Obstacle Free (Clear)</span>
              </div>
            </div>

            <div className="rover-recommendation-strip">
              <span className="rec-hdr">Automated Agronomic Prescription:</span>
              <p className="rec-p">
                {activePos.stemLesions > 0
                  ? "⚠️ Direct chemical nozzle downward to hit crown collars with Azoxystrobin to halt Rhizoctonia girdle before lodging."
                  : "✅ Sub-canopy moisture and root collar ventilation are optimal. No soil crust aerator required."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
