import React, { useState } from "react";
import "./VisualFarmCanvas.css";
import {
  IconRadar,
  IconShield,
  IconActivity,
  IconLayers,
  IconCheck,
  IconClock,
  IconTrendingUp,
} from "./Icons";

const VisualFarmCanvas = ({
  sectors = [],
  selectedSectorId,
  onSelectSector,
  activeScenario,
}) => {
  const [viewMode, setViewMode] = useState("ndvi"); // "ndvi", "spore", "moisture", "rgb"
  const [droneMission, setDroneMission] = useState("patrolling"); // "patrolling", "spraying", "docked"

  const getPlotColor = (sector) => {
    if (viewMode === "ndvi") {
      if (sector.healthIndex >= 90) return "rgba(0, 186, 124, 0.35)"; // Emerald
      if (sector.healthIndex >= 75) return "rgba(255, 152, 0, 0.35)"; // Amber
      return "rgba(237, 73, 86, 0.45)"; // Ruby / Critical
    }
    if (viewMode === "spore") {
      if (sector.sporeLoad > 200) return "rgba(237, 73, 86, 0.55)";
      if (sector.sporeLoad > 80) return "rgba(255, 152, 0, 0.4)";
      return "rgba(0, 149, 246, 0.2)";
    }
    if (viewMode === "moisture") {
      if (sector.soilMoisture > 45) return "rgba(0, 149, 246, 0.6)";
      if (sector.soilMoisture > 35) return "rgba(0, 149, 246, 0.35)";
      return "rgba(255, 152, 0, 0.3)";
    }
    // "rgb" natural terrain
    return "rgba(34, 197, 94, 0.2)";
  };

  const getPlotStroke = (sector) => {
    if (sector.id === selectedSectorId) return "var(--ig-blue)";
    if (sector.status === "critical") return "var(--ig-red)";
    if (sector.status === "warning") return "var(--ig-amber)";
    return "var(--card-border)";
  };

  return (
    <div className="visual-farm-card">
      <div className="farm-canvas-header">
        <div className="canvas-title-group">
          <div className="canvas-icon-frame">
            <IconLayers size={18} />
          </div>
          <div>
            <h3 className="canvas-main-title">Interactive Visual Farm Twin (2D / Topographical Spatial HUD)</h3>
            <p className="canvas-sub-title">Spatial plot topography, autonomous drone flight path, center pivot sprayers, and spore aura</p>
          </div>
        </div>

        {/* View Mode Layer Switcher */}
        <div className="layer-mode-pills">
          <button
            type="button"
            className={`layer-pill-btn ${viewMode === "ndvi" ? "active" : ""}`}
            onClick={() => setViewMode("ndvi")}
          >
            NDVI Vigor
          </button>
          <button
            type="button"
            className={`layer-pill-btn ${viewMode === "spore" ? "active" : ""}`}
            onClick={() => setViewMode("spore")}
          >
            Spore Heatmap
          </button>
          <button
            type="button"
            className={`layer-pill-btn ${viewMode === "moisture" ? "active" : ""}`}
            onClick={() => setViewMode("moisture")}
          >
            Soil Moisture
          </button>
          <button
            type="button"
            className={`layer-pill-btn ${viewMode === "rgb" ? "active" : ""}`}
            onClick={() => setViewMode("rgb")}
          >
            RGB Aerial
          </button>
        </div>
      </div>

      {/* Main Graphical Map & HUD Container */}
      <div className="farm-canvas-viewport">
        {/* Drone HUD Status Bar */}
        <div className="drone-hud-overlay">
          <div className="hud-metric">
            <span className="hud-label">AG-DRONE 01</span>
            <span className="hud-val highlight">
              {activeScenario === "spray" ? "Deploying Spray (Active)" : "Autonomous Patrol"}
            </span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">ALTITUDE</span>
            <span className="hud-val">42m AGL</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">SPEED</span>
            <span className="hud-val">18.4 km/h</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">PAYLOAD</span>
            <span className="hud-val">88% (Bio-Fungicide)</span>
          </div>
          <div className="hud-metric">
            <span className="hud-label">BATTERY</span>
            <span className="hud-val good">94%</span>
          </div>
        </div>

        {/* SVG Interactive Farm Layout */}
        <svg
          viewBox="0 0 900 460"
          className="farm-svg-canvas"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Field Crop Row Patterns */}
            <pattern id="potatoRows" width="16" height="16" patternUnits="userSpaceOnUse">
              <line x1="0" y1="8" x2="16" y2="8" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            </pattern>
            <pattern id="vineyardRows" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="10" x2="20" y2="10" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            </pattern>
            <pattern id="cornGrid" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="2" fill="rgba(255,255,255,0.08)" />
            </pattern>
            <pattern id="orchardGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="14" cy="14" r="4" fill="rgba(34,197,94,0.25)" />
            </pattern>
            {/* River Gradient */}
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.7" />
            </linearGradient>
            {/* Spore Aura Glow */}
            <radialGradient id="sporeAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Farm Ground Base */}
          <rect x="10" y="10" width="880" height="440" rx="16" fill="var(--surface-secondary)" stroke="var(--card-border)" strokeWidth="1.5" />

          {/* Natural River Boundary Stream (South Border) */}
          <path
            d="M 10 390 Q 250 370, 450 410 T 890 380 L 890 440 L 10 440 Z"
            fill="url(#riverGrad)"
          />
          <text x="450" y="425" fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle" opacity="0.8">
            South River Irrigation Aquifer
          </text>

          {/* Plot 1: Sector 1A (North Drip Pivot) */}
          {sectors[0] && (
            <g
              className={`svg-plot-group ${selectedSectorId === "sec-1a" ? "active-plot" : ""}`}
              onClick={() => onSelectSector("sec-1a")}
            >
              <rect
                x="30"
                y="30"
                width="260"
                height="155"
                rx="12"
                fill={getPlotColor(sectors[0])}
                stroke={getPlotStroke(sectors[0])}
                strokeWidth={selectedSectorId === "sec-1a" ? "3" : "1.5"}
              />
              <rect x="30" y="30" width="260" height="155" rx="12" fill="url(#potatoRows)" />
              {/* Circular Center Pivot Irrigation Visualizer */}
              <circle cx="160" cy="107" r="58" fill="none" stroke="rgba(0, 149, 246, 0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="160" cy="107" r="4" fill="var(--ig-blue)" />
              <line x1="160" y1="107" x2="218" y2="107" stroke="var(--ig-blue)" strokeWidth="2" />

              {/* Plot Label */}
              <text x="45" y="55" fill="var(--text-main)" fontSize="12" fontWeight="800">
                Sector 1A • Potato
              </text>
              <text x="45" y="72" fill="var(--text-muted)" fontSize="10" fontWeight="600">
                Health: {sectors[0].healthIndex}% • Pivot Active
              </text>
            </g>
          )}

          {/* Plot 2: Sector 1B (Greenhouse Alpha) */}
          {sectors[1] && (
            <g
              className={`svg-plot-group ${selectedSectorId === "sec-1b" ? "active-plot" : ""}`}
              onClick={() => onSelectSector("sec-1b")}
            >
              <rect
                x="310"
                y="30"
                width="260"
                height="155"
                rx="12"
                fill={getPlotColor(sectors[1])}
                stroke={getPlotStroke(sectors[1])}
                strokeWidth={selectedSectorId === "sec-1b" ? "3" : "1.5"}
              />
              {/* Greenhouse Glass Canopy Ribs */}
              <line x1="310" y1="80" x2="570" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="310" y1="130" x2="570" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="375" y1="30" x2="375" y2="185" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="440" y1="30" x2="440" y2="185" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <line x1="505" y1="30" x2="505" y2="185" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

              <text x="325" y="55" fill="var(--text-main)" fontSize="12" fontWeight="800">
                Sector 1B • Greenhouse Alpha
              </text>
              <text x="325" y="72" fill="var(--text-muted)" fontSize="10" fontWeight="600">
                Tomato • {sectors[1].healthIndex}% Health
              </text>
            </g>
          )}

          {/* Plot 3: Sector 2A (Central Valley Ridge - Inoculum Hotspot) */}
          {sectors[2] && (
            <g
              className={`svg-plot-group ${selectedSectorId === "sec-2a" ? "active-plot" : ""}`}
              onClick={() => onSelectSector("sec-2a")}
            >
              <rect
                x="590"
                y="30"
                width="280"
                height="155"
                rx="12"
                fill={getPlotColor(sectors[2])}
                stroke={getPlotStroke(sectors[2])}
                strokeWidth={selectedSectorId === "sec-2a" ? "3" : "1.5"}
              />
              <rect x="590" y="30" width="280" height="155" rx="12" fill="url(#potatoRows)" />

              {/* Spore Outbreak Red Aura Circle if critical */}
              {sectors[2].status === "critical" && (
                <circle cx="730" cy="107" r="65" fill="url(#sporeAura)" className="pulse-spore-aura" />
              )}

              <text x="605" y="55" fill="var(--text-main)" fontSize="12" fontWeight="800">
                Sector 2A • Central Ridge
              </text>
              <text x="605" y="72" fill={sectors[2].status === "critical" ? "var(--ig-red)" : "var(--text-muted)"} fontSize="10" fontWeight="700">
                Potato • {sectors[2].sporeLoad} Spores/m³ ({sectors[2].status.toUpperCase()})
              </text>
            </g>
          )}

          {/* Plot 4: Sector 2B (East Hillside Terrace Vineyard) */}
          {sectors[3] && (
            <g
              className={`svg-plot-group ${selectedSectorId === "sec-2b" ? "active-plot" : ""}`}
              onClick={() => onSelectSector("sec-2b")}
            >
              <rect
                x="30"
                y="205"
                width="260"
                height="160"
                rx="12"
                fill={getPlotColor(sectors[3])}
                stroke={getPlotStroke(sectors[3])}
                strokeWidth={selectedSectorId === "sec-2b" ? "3" : "1.5"}
              />
              <rect x="30" y="205" width="260" height="160" rx="12" fill="url(#vineyardRows)" />

              <text x="45" y="230" fill="var(--text-main)" fontSize="12" fontWeight="800">
                Sector 2B • East Hillside
              </text>
              <text x="45" y="247" fill="var(--text-muted)" fontSize="10" fontWeight="600">
                Grapevine • {sectors[3].healthIndex}% Health
              </text>
            </g>
          )}

          {/* Plot 5: Sector 3A (South River Basin Corn) */}
          {sectors[4] && (
            <g
              className={`svg-plot-group ${selectedSectorId === "sec-3a" ? "active-plot" : ""}`}
              onClick={() => onSelectSector("sec-3a")}
            >
              <rect
                x="310"
                y="205"
                width="260"
                height="160"
                rx="12"
                fill={getPlotColor(sectors[4])}
                stroke={getPlotStroke(sectors[4])}
                strokeWidth={selectedSectorId === "sec-3a" ? "3" : "1.5"}
              />
              <rect x="310" y="205" width="260" height="160" rx="12" fill="url(#cornGrid)" />

              <text x="325" y="230" fill="var(--text-main)" fontSize="12" fontWeight="800">
                Sector 3A • South River Basin
              </text>
              <text x="325" y="247" fill="var(--text-muted)" fontSize="10" fontWeight="600">
                Corn • {sectors[4].healthIndex}% Health • Drip
              </text>
            </g>
          )}

          {/* Plot 6: Sector 3B (West Apple Orchard Block) */}
          {sectors[5] && (
            <g
              className={`svg-plot-group ${selectedSectorId === "sec-3b" ? "active-plot" : ""}`}
              onClick={() => onSelectSector("sec-3b")}
            >
              <rect
                x="590"
                y="205"
                width="280"
                height="160"
                rx="12"
                fill={getPlotColor(sectors[5])}
                stroke={getPlotStroke(sectors[5])}
                strokeWidth={selectedSectorId === "sec-3b" ? "3" : "1.5"}
              />
              <rect x="590" y="205" width="280" height="160" rx="12" fill="url(#orchardGrid)" />

              <text x="605" y="230" fill="var(--text-main)" fontSize="12" fontWeight="800">
                Sector 3B • West Orchard
              </text>
              <text x="605" y="247" fill="var(--text-muted)" fontSize="10" fontWeight="600">
                Apple • {sectors[5].healthIndex}% Health
              </text>
            </g>
          )}

          {/* Animated Autonomous Precision Drone Graphics */}
          <g className={`autonomous-drone-svg ${activeScenario === "spray" ? "spraying-mission" : "patrol-mission"}`}>
            {/* Drone Shadow */}
            <ellipse cx="0" cy="18" rx="14" ry="6" fill="rgba(0,0,0,0.35)" />
            {/* Spray Mist Cone if in spray scenario */}
            {activeScenario === "spray" && (
              <polygon points="-12,12 12,12 28,45 -28,45" fill="rgba(56, 189, 248, 0.35)" className="spray-mist-cone" />
            )}
            {/* Drone Quadcopter Body */}
            <circle cx="0" cy="0" r="10" fill="var(--card-bg)" stroke="var(--ig-blue)" strokeWidth="2.5" />
            <line x1="-15" y1="-15" x2="15" y2="15" stroke="var(--text-main)" strokeWidth="2.5" />
            <line x1="-15" y1="15" x2="15" y2="-15" stroke="var(--text-main)" strokeWidth="2.5" />
            {/* Rotors */}
            <circle cx="-15" cy="-15" r="5" fill="none" stroke="var(--ig-blue)" strokeWidth="1.5" className="rotor-spin" />
            <circle cx="15" cy="-15" r="5" fill="none" stroke="var(--ig-blue)" strokeWidth="1.5" className="rotor-spin" />
            <circle cx="-15" cy="15" r="5" fill="none" stroke="var(--ig-blue)" strokeWidth="1.5" className="rotor-spin" />
            <circle cx="15" cy="15" r="5" fill="none" stroke="var(--ig-blue)" strokeWidth="1.5" className="rotor-spin" />
            {/* Drone Center Status Beacon */}
            <circle cx="0" cy="0" r="3.5" fill="var(--ig-green)" />
          </g>
        </svg>

        {/* Floating Canvas Legend */}
        <div className="canvas-legend-strip">
          <div className="legend-item">
            <span className="legend-dot optimal"></span>
            <span>Optimal (&gt;90% Health)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot warning"></span>
            <span>Warning (Spore Inoculum)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot critical"></span>
            <span>Critical (Active Blight)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot drone"></span>
            <span>Drone Precision Flight Path</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualFarmCanvas;
