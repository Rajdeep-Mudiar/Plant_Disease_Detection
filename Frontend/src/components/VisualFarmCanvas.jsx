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

const SECTOR_INFO = {
  "sec-1a": {
    name: "Sector 1A",
    crop: "Potato Field",
    icon: "🥔",
    desc: "Main potato plot equipped with an automated circular center-pivot sprinkler.",
    cx: 159,
    cy: 117,
    minX: 75,
    maxX: 240,
    minY: 65,
    maxY: 160,
  },
  "sec-1b": {
    name: "Sector 1B",
    crop: "Tomato Greenhouse",
    icon: "🍅",
    desc: "Climate-controlled smart greenhouse with automated humidity & LED growth lights.",
    cx: 455,
    cy: 117,
    minX: 360,
    maxX: 545,
    minY: 65,
    maxY: 160,
  },
  "sec-2a": {
    name: "Sector 2A",
    crop: "Ridge Potato",
    icon: "🥔",
    desc: "High-elevation field on the central ridge. Susceptible to wind-blown fungal spores.",
    cx: 766,
    cy: 117,
    minX: 660,
    maxX: 870,
    minY: 65,
    maxY: 160,
  },
  "sec-2b": {
    name: "Sector 2B",
    crop: "Grape Vineyard",
    icon: "🍇",
    desc: "Terraced hillside vineyard with wooden trellises and micro-drip irrigation.",
    cx: 159,
    cy: 314,
    minX: 75,
    maxX: 240,
    minY: 265,
    maxY: 355,
  },
  "sec-3a": {
    name: "Sector 3A",
    crop: "Corn Field",
    icon: "🌽",
    desc: "Sweet corn crop bordered by the South River with sub-surface drip hydration.",
    cx: 455,
    cy: 314,
    minX: 360,
    maxX: 545,
    minY: 265,
    maxY: 355,
  },
  "sec-3b": {
    name: "Sector 3B",
    crop: "Apple Orchard",
    icon: "🍎",
    desc: "Fruit tree canopy grid with central IoT micro-weather sensor station.",
    cx: 766,
    cy: 314,
    minX: 660,
    maxX: 870,
    minY: 265,
    maxY: 355,
  },
};

const VisualFarmCanvas = ({
  sectors = [],
  selectedSectorId = "sec-3a",
  onSelectSector,
  activeScenario,
  onTriggerSpray,
  onTriggerDrip,
  onTriggerOutbreak,
  onReset,
}) => {
  const [viewMode, setViewMode] = useState("ndvi"); // "ndvi", "spore", "moisture", "rgb"
  const [showHelpGuide, setShowHelpGuide] = useState(false);

  const targetCoords = SECTOR_INFO[selectedSectorId] || SECTOR_INFO["sec-3a"];
  const targetSector = sectors.find((s) => s.id === selectedSectorId) || sectors[0];

  const droneStyle = {
    "--target-min-x": `${targetCoords.minX}px`,
    "--target-max-x": `${targetCoords.maxX}px`,
    "--target-min-y": `${targetCoords.minY}px`,
    "--target-mid-y": `${(targetCoords.minY + targetCoords.maxY) / 2}px`,
    "--target-max-y": `${targetCoords.maxY}px`,
  };

  const getPlotFill = (sector) => {
    if (viewMode === "ndvi") {
      if (sector.healthIndex >= 90) return "url(#ndviOptimalGrad)";
      if (sector.healthIndex >= 75) return "url(#ndviWarningGrad)";
      return "url(#ndviCriticalGrad)";
    }
    if (viewMode === "spore") {
      if (sector.sporeLoad > 200) return "url(#sporeCriticalGrad)";
      if (sector.sporeLoad > 80) return "url(#sporeWarningGrad)";
      return "url(#sporeSafeGrad)";
    }
    if (viewMode === "moisture") {
      if (sector.soilMoisture > 45) return "url(#moistureHighGrad)";
      if (sector.soilMoisture > 35) return "url(#moistureOptimalGrad)";
      return "url(#moistureLowGrad)";
    }
    // "rgb" natural satellite terrain
    return "url(#rgbTerrainGrad)";
  };

  const getPlotStroke = (sector) => {
    if (sector.id === selectedSectorId) return "#0095f6";
    if (sector.status === "critical") return "#ef4444";
    if (sector.status === "warning") return "#f59e0b";
    return "rgba(255, 255, 255, 0.4)";
  };

  const getHealthBadge = (healthIndex, status) => {
    if (status === "treating") {
      return { text: "🚁 Drone Spraying Active", className: "badge-treating", color: "#38bdf8" };
    }
    if (healthIndex >= 90) {
      return { text: `🟢 ${healthIndex}% Healthy (Great)`, className: "badge-optimal", color: "#22c55e" };
    }
    if (healthIndex >= 75) {
      return { text: `🟡 ${healthIndex}% Fair (Watch)`, className: "badge-warning", color: "#f59e0b" };
    }
    return { text: `🔴 ${healthIndex}% Sick (Needs Spray)`, className: "badge-critical", color: "#ef4444" };
  };

  return (
    <div className="visual-farm-card">
      {/* Top Header with Simple Title & Human-Friendly Layer Switcher */}
      <div className="farm-canvas-header">
        <div className="canvas-title-group">
          <div className="canvas-icon-frame">
            <IconLayers size={20} />
          </div>
          <div>
            <div className="canvas-title-badge-row">
              <span className="live-gis-badge">LIVE FARM MAP</span>
              <span className="user-guide-pill" onClick={() => setShowHelpGuide(!showHelpGuide)}>
                {showHelpGuide ? "✕ Close Guide" : "❓ How it works"}
              </span>
            </div>
            <h3 className="canvas-main-title">Interactive Smart Farm Map</h3>
            <p className="canvas-sub-title">
              Click any field to check crop health, turn on water sprinklers, or send the drone to spray medicine.
            </p>
          </div>
        </div>

        {/* Friendly View Mode Switcher */}
        <div className="simple-layer-controls">
          <span className="layer-ctrl-label">Map Mode:</span>
          <div className="layer-mode-pills">
            <button
              type="button"
              className={`layer-pill-btn ${viewMode === "ndvi" ? "active" : ""}`}
              onClick={() => setViewMode("ndvi")}
              title="Green = Healthy crops, Red = Sick crops"
            >
              🌿 Crop Health
            </button>
            <button
              type="button"
              className={`layer-pill-btn ${viewMode === "spore" ? "active" : ""}`}
              onClick={() => setViewMode("spore")}
              title="Shows where plant fungus & diseases are spreading"
            >
              🦠 Disease Risk
            </button>
            <button
              type="button"
              className={`layer-pill-btn ${viewMode === "moisture" ? "active" : ""}`}
              onClick={() => setViewMode("moisture")}
              title="Shows water level: Blue = Watered, Yellow = Dry"
            >
              💧 Water Level
            </button>
            <button
              type="button"
              className={`layer-pill-btn ${viewMode === "rgb" ? "active" : ""}`}
              onClick={() => setViewMode("rgb")}
              title="Real satellite photo view"
            >
              📷 Photo View
            </button>
          </div>
        </div>
      </div>

      {/* Beginner-Friendly Quick Help Guide Card */}
      {showHelpGuide && (
        <div className="beginner-guide-card">
          <div className="guide-col">
            <span className="guide-title">1. Select a Field 🗺️</span>
            <p className="guide-text">Click on any plot (like Potato, Tomato, Corn) on the map below to select it.</p>
          </div>
          <div className="guide-col">
            <span className="guide-title">2. Send Drone to Spray 🚁</span>
            <p className="guide-text">Click "Spray Selected Field" to send the drone with medicine directly to that field.</p>
          </div>
          <div className="guide-col">
            <span className="guide-title">3. Turn on Sprinklers 💧</span>
            <p className="guide-text">Click "Water All Fields" to turn on automated irrigation and nourish the crops.</p>
          </div>
        </div>
      )}

      {/* Interactive Quick Action Toolbar (Simple buttons that everyone understands) */}
      <div className="farm-quick-actions-toolbar">
        <div className="current-target-pill">
          <span className="target-label">CURRENTLY SELECTED:</span>
          <span className="target-name">
            {targetCoords.icon} {targetSector ? targetSector.name : "Sector 3A"}
          </span>
        </div>

        <div className="quick-buttons-row">
          <button
            type="button"
            className={`action-btn-drone ${activeScenario === "spray" ? "active" : ""}`}
            onClick={onTriggerSpray}
            title={`Send drone to spray bio-fungicide medicine directly on ${targetCoords.name}`}
          >
            <span className="btn-icon">🚁</span>
            <span>Spray {targetCoords.name.split(" ")[0]} with Drone</span>
          </button>

          <button
            type="button"
            className={`action-btn-water ${activeScenario === "drip" ? "active" : ""}`}
            onClick={onTriggerDrip}
            title="Turn on water sprinklers and drip irrigation"
          >
            <span className="btn-icon">💧</span>
            <span>Water All Fields</span>
          </button>

          <button
            type="button"
            className={`action-btn-outbreak ${activeScenario === "outbreak" ? "active" : ""}`}
            onClick={onTriggerOutbreak}
            title="Simulate a plant disease outbreak to test AI detection"
          >
            <span className="btn-icon">⚠️</span>
            <span>Simulate Outbreak</span>
          </button>

          <button
            type="button"
            className="action-btn-reset"
            onClick={onReset}
            title="Reset all fields back to 100% healthy"
          >
            <span className="btn-icon">🔄</span>
            <span>Reset Farm</span>
          </button>
        </div>
      </div>

      {/* Main Graphical Map & HUD Container */}
      <div className="farm-canvas-viewport">
        {/* Interactive Selected Field Control Banner (Appears at top of map) */}
        <div className="map-selected-hud-banner">
          <div className="banner-left">
            <span className="banner-icon">{targetCoords.icon}</span>
            <div>
              <div className="banner-name-row">
                <span className="banner-name">{targetSector.name}</span>
                <span className={`banner-badge ${getHealthBadge(targetSector.healthIndex, targetSector.status).className}`}>
                  {getHealthBadge(targetSector.healthIndex, targetSector.status).text}
                </span>
              </div>
              <p className="banner-desc">{targetCoords.desc}</p>
            </div>
          </div>

          <div className="banner-actions">
            <button
              type="button"
              className="banner-spray-btn"
              onClick={onTriggerSpray}
            >
              🚁 Spray This Plot
            </button>
          </div>
        </div>

        {/* SVG Interactive Farm Layout */}
        <svg
          viewBox="0 0 940 500"
          className="farm-svg-canvas"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Topographical Elevation Contours */}
            <pattern id="topoLines" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 30 Q 50 10, 100 30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <path d="M 0 70 Q 50 90, 100 70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </pattern>

            {/* Farm Ground Field Patterns */}
            <pattern id="potatoRows" width="12" height="12" patternUnits="userSpaceOnUse">
              <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(255,255,255,0.14)" strokeWidth="2.5" />
              <line x1="0" y1="6" x2="12" y2="6" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
            </pattern>
            <pattern id="vineyardRows" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="9" x2="18" y2="9" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
              <circle cx="9" cy="9" r="1.5" fill="rgba(0,0,0,0.2)" />
            </pattern>
            <pattern id="cornGrid" width="14" height="14" patternUnits="userSpaceOnUse">
              <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <circle cx="7" cy="7" r="2.2" fill="rgba(255,255,255,0.2)" />
            </pattern>
            <pattern id="orchardGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="16" cy="16" r="6.5" fill="rgba(16, 185, 129, 0.4)" stroke="rgba(5, 150, 105, 0.6)" strokeWidth="1" />
              <circle cx="16" cy="16" r="3" fill="rgba(255,255,255,0.3)" />
            </pattern>

            {/* Multispectral NDVI False-Color Gradients */}
            <linearGradient id="ndviOptimalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.82" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient id="ndviWarningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.82" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient id="ndviCriticalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0.9" />
            </linearGradient>

            {/* Spore Heatmap Density Gradients */}
            <linearGradient id="sporeCriticalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#f97316" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="sporeWarningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="sporeSafeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.75" />
            </linearGradient>

            {/* Soil Moisture Hydrological Gradients */}
            <linearGradient id="moistureHighGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="moistureOptimalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="moistureLowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.85" />
            </linearGradient>

            {/* RGB TrueColor Natural Satellite Gradients */}
            <linearGradient id="rgbTerrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#15803d" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#16a34a" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#166534" stopOpacity="0.85" />
            </linearGradient>

            {/* River Gradient & Water Reflection */}
            <linearGradient id="riverDepthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#0369a1" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#075985" stopOpacity="1" />
              <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.95" />
            </linearGradient>

            {/* Volumetric Spore Dispersion Plume */}
            <radialGradient id="sporePlumeAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#f97316" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>

            {/* Drone Laser LIDAR Footprint Cone */}
            <radialGradient id="lidarBeamCone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#22c55e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>

            {/* Field Drop Shadow Filter */}
            <filter id="plotShadow" x="-5%" y="-5%" width="110%" height="115%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.18" />
            </filter>
            <filter id="glowSelect" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#0095f6" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* --- SATELLITE BASE TERRAIN MAP --- */}
          <rect x="8" y="8" width="924" height="484" rx="14" fill="#1e293b" className="farm-base-ground" />
          <rect x="8" y="8" width="924" height="484" rx="14" fill="url(#topoLines)" pointerEvents="none" />

          {/* Perimeter Shelterbelt Trees */}
          <g opacity="0.4" pointerEvents="none">
            {[20, 60, 100, 140, 180, 220, 260, 300, 340, 380, 420, 460, 500, 540, 580, 620, 660, 700, 740, 780, 820, 860, 900].map((x, i) => (
              <circle key={i} cx={x} cy="14" r="7" fill="#166534" />
            ))}
            {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map((y, i) => (
              <React.Fragment key={i}>
                <circle cx="14" cy={y} r="7" fill="#166534" />
                <circle cx="926" cy={y} r="7" fill="#166534" />
              </React.Fragment>
            ))}
          </g>

          {/* Farm Access Service Roads */}
          <g stroke="#475569" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" pointerEvents="none">
            <path d="M 305 20 L 305 440" />
            <path d="M 605 20 L 605 440" />
            <path d="M 20 220 L 920 220" />
          </g>
          <g stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 8" strokeLinecap="round" opacity="0.8" pointerEvents="none">
            <path d="M 305 20 L 305 440" />
            <path d="M 605 20 L 605 440" />
            <path d="M 20 220 L 920 220" />
          </g>

          {/* --- NATURAL SOUTH RIVER IRRIGATION AQUIFER --- */}
          <path
            d="M 8 410 Q 240 380, 460 425 T 932 395 L 932 492 L 8 492 Z"
            fill="url(#riverDepthGrad)"
          />
          <path
            d="M 8 410 Q 240 380, 460 425 T 932 395"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeOpacity="0.8"
          />
          <path
            d="M 20 425 Q 260 395, 480 440 T 920 415"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            strokeDasharray="14 12"
            className="river-flow-stream"
          />
          <rect x="445" y="405" width="28" height="20" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="459" cy="415" r="4" fill="#0284c7" />
          <text x="490" y="475" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle" opacity="0.9" letterSpacing="0.08em">
            SOUTH RIVER WATER SOURCE • AUTOMATED PUMP ACTIVE
          </text>

          {/* ========================================================================= */}
          {/* 6 INTERACTIVE PRECISION SECTOR PLOTS                                      */}
          {/* ========================================================================= */}

          {/* --- PLOT 1: SECTOR 1A (Potato Field) --- */}
          {sectors[0] && (
            <g
              className={`svg-plot-interactive ${selectedSectorId === "sec-1a" ? "active-sector" : ""}`}
              onClick={() => onSelectSector("sec-1a")}
              filter={selectedSectorId === "sec-1a" ? "url(#glowSelect)" : "url(#plotShadow)"}
            >
              <rect
                x="28"
                y="28"
                width="262"
                height="178"
                rx="10"
                fill={getPlotFill(sectors[0])}
                stroke={getPlotStroke(sectors[0])}
                strokeWidth={selectedSectorId === "sec-1a" ? "3.5" : "1.8"}
              />
              <rect x="28" y="28" width="262" height="178" rx="10" fill="url(#potatoRows)" />

              {/* Center-Pivot Sprayer */}
              <circle cx="159" cy="117" r="68" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx="159" cy="117" r="40" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
              <g className="pivot-arm-rotating" transform-origin="159px 117px">
                <line x1="159" y1="117" x2="227" y2="117" stroke="#ffffff" strokeWidth="2.5" />
                <circle cx="193" cy="117" r="3" fill="#0284c7" />
                <circle cx="227" cy="117" r="4" fill="#0284c7" />
                <path d="M 159 117 L 227 117 A 68 68 0 0 1 217 157 Z" fill="rgba(56, 189, 248, 0.25)" />
              </g>
              <circle cx="159" cy="117" r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />

              <g transform="translate(36, 36)">
                <rect width="180" height="42" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                <circle cx="14" cy="15" r="4" fill="#22c55e" />
                <text x="24" y="18" fill="#ffffff" fontSize="11" fontWeight="800">🥔 Sector 1A • Potato</text>
                <text x="10" y="33" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                  Health: <tspan fill="#4ade80" fontWeight="800">{sectors[0].healthIndex}%</tspan> • Sprinkler On
                </text>
              </g>
            </g>
          )}

          {/* --- PLOT 2: SECTOR 1B (Tomato Greenhouse Alpha) --- */}
          {sectors[1] && (
            <g
              className={`svg-plot-interactive ${selectedSectorId === "sec-1b" ? "active-sector" : ""}`}
              onClick={() => onSelectSector("sec-1b")}
              filter={selectedSectorId === "sec-1b" ? "url(#glowSelect)" : "url(#plotShadow)"}
            >
              <rect
                x="320"
                y="28"
                width="270"
                height="178"
                rx="10"
                fill={getPlotFill(sectors[1])}
                stroke={getPlotStroke(sectors[1])}
                strokeWidth={selectedSectorId === "sec-1b" ? "3.5" : "1.8"}
              />

              {/* Glass Greenhouse Roofs */}
              <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="rgba(255,255,255,0.06)">
                <rect x="330" y="80" width="55" height="116" rx="2" />
                <rect x="390" y="80" width="55" height="116" rx="2" />
                <rect x="450" y="80" width="55" height="116" rx="2" />
                <rect x="510" y="80" width="65" height="116" rx="2" />
                <line x1="357" y1="80" x2="357" y2="196" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="417" y1="80" x2="417" y2="196" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="477" y1="80" x2="477" y2="196" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="542" y1="80" x2="542" y2="196" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
              </g>
              <circle cx="357" cy="138" r="14" fill="#a855f7" opacity="0.35" />
              <circle cx="417" cy="138" r="14" fill="#a855f7" opacity="0.35" />
              <circle cx="477" cy="138" r="14" fill="#a855f7" opacity="0.35" />
              <circle cx="542" cy="138" r="14" fill="#a855f7" opacity="0.35" />

              <g transform="translate(328, 36)">
                <rect width="200" height="42" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                <circle cx="14" cy="15" r="4" fill="#22c55e" />
                <text x="24" y="18" fill="#ffffff" fontSize="11" fontWeight="800">🍅 Sector 1B • Greenhouse</text>
                <text x="10" y="33" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                  Tomato • <tspan fill="#4ade80" fontWeight="800">{sectors[1].healthIndex}% Health</tspan> • Optimal
                </text>
              </g>
            </g>
          )}

          {/* --- PLOT 3: SECTOR 2A (Central Valley Ridge Potato) --- */}
          {sectors[2] && (
            <g
              className={`svg-plot-interactive ${selectedSectorId === "sec-2a" ? "active-sector" : ""}`}
              onClick={() => onSelectSector("sec-2a")}
              filter={selectedSectorId === "sec-2a" ? "url(#glowSelect)" : "url(#plotShadow)"}
            >
              <rect
                x="620"
                y="28"
                width="292"
                height="178"
                rx="10"
                fill={getPlotFill(sectors[2])}
                stroke={getPlotStroke(sectors[2])}
                strokeWidth={selectedSectorId === "sec-2a" ? "3.5" : "2"}
              />
              <rect x="620" y="28" width="292" height="178" rx="10" fill="url(#potatoRows)" />

              <path d="M 640 90 Q 760 60, 890 90" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
              <path d="M 640 140 Q 760 110, 890 140" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />

              {/* Spore Hazard Plume */}
              {sectors[2].status === "critical" && (
                <g className="active-spore-hazard-group">
                  <ellipse cx="780" cy="115" rx="85" ry="60" fill="url(#sporePlumeAura)" className="pulse-spore-aura" />
                  <ellipse cx="780" cy="115" rx="50" ry="35" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" className="spore-ring-expand" />
                  <circle cx="760" cy="110" r="3.5" fill="#fca5a5" className="floating-spore s1" />
                  <circle cx="785" cy="95" r="4.5" fill="#ef4444" className="floating-spore s2" />
                  <circle cx="810" cy="80" r="3" fill="#dc2626" className="floating-spore s3" />
                  <circle cx="835" cy="70" r="2.5" fill="#f87171" className="floating-spore s4" />
                  <circle cx="780" cy="115" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="780" cy="115" r="14" fill="none" stroke="#ef4444" strokeWidth="2" className="beacon-ping" />
                </g>
              )}

              <g transform="translate(628, 36)">
                <rect
                  width="210"
                  height="42"
                  rx="6"
                  fill="rgba(15, 23, 42, 0.88)"
                  stroke={sectors[2].status === "critical" ? "#ef4444" : "rgba(255,255,255,0.2)"}
                  strokeWidth="1.2"
                />
                <circle cx="14" cy="15" r="4" fill={sectors[2].status === "critical" ? "#ef4444" : "#22c55e"} className="beacon-ping" />
                <text x="24" y="18" fill="#ffffff" fontSize="11" fontWeight="800">🥔 Sector 2A • Ridge Potato</text>
                <text x="10" y="33" fill={sectors[2].status === "critical" ? "#fca5a5" : "#94a3b8"} fontSize="9.5" fontWeight="700">
                  {sectors[2].status === "critical" ? (
                    <tspan fill="#ef4444" fontWeight="800">🔴 Disease Alert! Needs Spray</tspan>
                  ) : (
                    `Health: ${sectors[2].healthIndex}% • Safe`
                  )}
                </text>
              </g>
            </g>
          )}

          {/* --- PLOT 4: SECTOR 2B (East Hillside Vineyard) --- */}
          {sectors[3] && (
            <g
              className={`svg-plot-interactive ${selectedSectorId === "sec-2b" ? "active-sector" : ""}`}
              onClick={() => onSelectSector("sec-2b")}
              filter={selectedSectorId === "sec-2b" ? "url(#glowSelect)" : "url(#plotShadow)"}
            >
              <rect
                x="28"
                y="232"
                width="262"
                height="165"
                rx="10"
                fill={getPlotFill(sectors[3])}
                stroke={getPlotStroke(sectors[3])}
                strokeWidth={selectedSectorId === "sec-2b" ? "3.5" : "1.8"}
              />
              <rect x="28" y="232" width="262" height="165" rx="10" fill="url(#vineyardRows)" />

              <g stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
                <line x1="38" y1="290" x2="278" y2="290" />
                <line x1="38" y1="335" x2="278" y2="335" />
                <line x1="38" y1="380" x2="278" y2="380" />
              </g>

              <g transform="translate(36, 240)">
                <rect width="180" height="42" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                <circle cx="14" cy="15" r="4" fill="#f59e0b" />
                <text x="24" y="18" fill="#ffffff" fontSize="11" fontWeight="800">🍇 Sector 2B • Vineyard</text>
                <text x="10" y="33" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                  Grapevine • <tspan fill="#f59e0b" fontWeight="800">{sectors[3].healthIndex}% Health</tspan>
                </text>
              </g>
            </g>
          )}

          {/* --- PLOT 5: SECTOR 3A (South River Basin Corn) --- */}
          {sectors[4] && (
            <g
              className={`svg-plot-interactive ${selectedSectorId === "sec-3a" ? "active-sector" : ""}`}
              onClick={() => onSelectSector("sec-3a")}
              filter={selectedSectorId === "sec-3a" ? "url(#glowSelect)" : "url(#plotShadow)"}
            >
              <rect
                x="320"
                y="232"
                width="270"
                height="165"
                rx="10"
                fill={getPlotFill(sectors[4])}
                stroke={getPlotStroke(sectors[4])}
                strokeWidth={selectedSectorId === "sec-3a" ? "3.5" : "1.8"}
              />
              <rect x="320" y="232" width="270" height="165" rx="10" fill="url(#cornGrid)" />

              {/* Drip Lines */}
              <g stroke="rgba(2, 132, 199, 0.4)" strokeWidth="1.5" strokeDasharray="3 3">
                <line x1="330" y1="290" x2="580" y2="290" />
                <line x1="330" y1="335" x2="580" y2="335" />
                <line x1="330" y1="380" x2="580" y2="380" />
              </g>

              <g transform="translate(328, 240)">
                <rect width="200" height="42" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                <circle cx="14" cy="15" r="4" fill={sectors[4].status === "treating" ? "#38bdf8" : "#22c55e"} />
                <text x="24" y="18" fill="#ffffff" fontSize="11" fontWeight="800">🌽 Sector 3A • Corn Field</text>
                <text x="10" y="33" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                  Corn • <tspan fill="#4ade80" fontWeight="800">{sectors[4].healthIndex}% Health</tspan> • {sectors[4].status === "treating" ? "Spraying" : "Watered"}
                </text>
              </g>
            </g>
          )}

          {/* --- PLOT 6: SECTOR 3B (West Orchard Apple) --- */}
          {sectors[5] && (
            <g
              className={`svg-plot-interactive ${selectedSectorId === "sec-3b" ? "active-sector" : ""}`}
              onClick={() => onSelectSector("sec-3b")}
              filter={selectedSectorId === "sec-3b" ? "url(#glowSelect)" : "url(#plotShadow)"}
            >
              <rect
                x="620"
                y="232"
                width="292"
                height="165"
                rx="10"
                fill={getPlotFill(sectors[5])}
                stroke={getPlotStroke(sectors[5])}
                strokeWidth={selectedSectorId === "sec-3b" ? "3.5" : "1.8"}
              />
              <rect x="620" y="232" width="292" height="165" rx="10" fill="url(#orchardGrid)" />

              <g transform="translate(766, 315)">
                <circle cx="0" cy="0" r="5" fill="#0095f6" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="16" fill="none" stroke="#0095f6" strokeWidth="1.2" className="beacon-ping" />
                <line x1="0" y1="0" x2="0" y2="-12" stroke="#0095f6" strokeWidth="2" />
                <circle cx="0" cy="-12" r="2.5" fill="#38bdf8" />
              </g>

              <g transform="translate(628, 240)">
                <rect width="190" height="42" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
                <circle cx="14" cy="15" r="4" fill="#22c55e" />
                <text x="24" y="18" fill="#ffffff" fontSize="11" fontWeight="800">🍎 Sector 3B • Orchard</text>
                <text x="10" y="33" fill="#94a3b8" fontSize="9.5" fontWeight="600">
                  Apple • <tspan fill="#4ade80" fontWeight="800">{sectors[5].healthIndex}% Health</tspan> • Optimal
                </text>
              </g>
            </g>
          )}

          {/* ========================================================================= */}
          {/* DYNAMIC FLIGHT VECTOR & WAYPOINTS (TARGETS SELECTED SECTOR)               */}
          {/* ========================================================================= */}
          {activeScenario === "spray" ? (
            <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 5" fill="none" pointerEvents="none">
              <path
                d={`M ${targetCoords.minX} ${targetCoords.minY} L ${targetCoords.maxX} ${targetCoords.minY} L ${targetCoords.maxX} ${(targetCoords.minY + targetCoords.maxY) / 2} L ${targetCoords.minX} ${(targetCoords.minY + targetCoords.maxY) / 2} L ${targetCoords.minX} ${targetCoords.maxY} L ${targetCoords.maxX} ${targetCoords.maxY}`}
              />
              <circle cx={targetCoords.cx} cy={targetCoords.cy} r="6" fill="#38bdf8" opacity="0.6" className="beacon-ping" />
            </g>
          ) : (
            <g stroke="rgba(0, 149, 246, 0.55)" strokeWidth="1.5" strokeDasharray="6 6" fill="none" pointerEvents="none">
              <path d="M 159 117 L 450 117 L 780 115 L 766 315 L 455 315 L 159 315 Z" />
            </g>
          )}

          {/* ========================================================================= */}
          {/* AUTONOMOUS HEXACOPTER AG-DRONE (TARGETS SELECTED SECTOR DIRECTLY)         */}
          {/* ========================================================================= */}
          <g
            className={`autonomous-drone-svg ${activeScenario === "spray" ? "spraying-mission" : "patrol-mission"}`}
            style={droneStyle}
          >
            <ellipse cx="0" cy="32" rx="22" ry="9" fill="rgba(0,0,0,0.45)" />

            <ellipse
              cx="0"
              cy="32"
              rx={activeScenario === "spray" ? "52" : "42"}
              ry={activeScenario === "spray" ? "24" : "18"}
              fill={activeScenario === "spray" ? "rgba(56, 189, 248, 0.28)" : "url(#lidarBeamCone)"}
              className="lidar-sweep"
            />

            {activeScenario === "spray" && (
              <g className="drone-spray-plume">
                <polygon points="-16,10 -6,10 -22,48 -46,48" fill="rgba(56, 189, 248, 0.5)" />
                <polygon points="6,10 16,10 46,48 22,48" fill="rgba(56, 189, 248, 0.5)" />
                <circle cx="-32" cy="42" r="2.5" fill="#38bdf8" opacity="0.9" />
                <circle cx="32" cy="42" r="2.5" fill="#38bdf8" opacity="0.9" />
                <circle cx="-18" cy="32" r="1.8" fill="#bae6fd" opacity="0.8" />
                <circle cx="18" cy="32" r="1.8" fill="#bae6fd" opacity="0.8" />
              </g>
            )}

            <g stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round">
              <line x1="0" y1="0" x2="-22" y2="-13" />
              <line x1="0" y1="0" x2="22" y2="-13" />
              <line x1="0" y1="0" x2="-25" y2="0" />
              <line x1="0" y1="0" x2="25" y2="0" />
              <line x1="0" y1="0" x2="-22" y2="13" />
              <line x1="0" y1="0" x2="22" y2="13" />
            </g>

            <g fill="rgba(56, 189, 248, 0.25)" stroke="#0095f6" strokeWidth="1.2">
              <circle cx="-22" cy="-13" r="8.5" className="rotor-spin" />
              <circle cx="22" cy="-13" r="8.5" className="rotor-spin" />
              <circle cx="-25" cy="0" r="8.5" className="rotor-spin" />
              <circle cx="25" cy="0" r="8.5" className="rotor-spin" />
              <circle cx="-22" cy="13" r="8.5" className="rotor-spin" />
              <circle cx="22" cy="13" r="8.5" className="rotor-spin" />
            </g>

            <rect x="-11" y="-14" width="22" height="28" rx="7" fill="#1e293b" stroke="#64748b" strokeWidth="1.8" />
            <circle cx="0" cy="4" r="5" fill="#0f172a" stroke="#0095f6" strokeWidth="1.2" />
            <circle cx="0" cy="4" r="2" fill="#38bdf8" />
            <circle cx="0" cy="-6" r="3.5" fill="#f8fafc" stroke="#0284c7" strokeWidth="1" />
            <circle cx="-10" cy="-10" r="1.8" fill="#ef4444" className="nav-strobe" />
            <circle cx="10" cy="-10" r="1.8" fill="#22c55e" className="nav-strobe" />
            <circle cx="0" cy="12" r="1.8" fill="#38bdf8" className="nav-strobe" />
          </g>

          <g transform="translate(900, 48)" pointerEvents="none" opacity="0.85">
            <circle cx="0" cy="0" r="18" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <polygon points="0,-14 4,0 -4,0" fill="#ef4444" />
            <polygon points="0,14 4,0 -4,0" fill="#94a3b8" />
            <text x="0" y="-5" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff">N</text>
          </g>
        </svg>

        {/* Floating Simple Legend */}
        <div className="canvas-legend-strip">
          <div className="simple-legend-guide">
            <span className="legend-guide-label">Field Colors:</span>
            <div className="legend-pills-row">
              <span className="legend-chip optimal">🟢 Green = Healthy (&gt;90%)</span>
              <span className="legend-chip warning">🟡 Yellow = Needs Attention</span>
              <span className="legend-chip critical">🔴 Red = Sick (Needs Spray)</span>
            </div>
          </div>

          <div className="drone-mission-status-pill">
            <span className="mission-dot"></span>
            <span>
              {activeScenario === "spray"
                ? `Drone Status: Spraying ${targetCoords.name}`
                : "Drone Status: Guarding & Scouting Farm"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualFarmCanvas;
