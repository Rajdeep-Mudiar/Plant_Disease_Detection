import React, { useState, useEffect } from "react";
import "./SatelliteNdviExplorer.css";
import {
  IconActivity,
  IconLayers,
  IconShield,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconRadar,
  IconSparkles,
  IconCheck,
  IconRefresh,
} from "./Icons";
import { useTranslation } from "../context/LanguageContext";

const SATELLITE_INDEX_MODES = [
  {
    id: "ndvi",
    name: "NDVI",
    fullName: "Normalized Difference Vegetation Index",
    formula: "(NIR - Red) / (NIR + Red)",
    spectrum: "665nm (B4) & 842nm (B8)",
    description: "Measures photosynthetically active chlorophyll biomass and canopy density.",
    palette: ["#8B0000", "#FF4500", "#FFD700", "#ADFF2F", "#008000", "#004d00"],
    healthyRange: "0.72 - 0.92",
    stressedRange: "0.20 - 0.50",
  },
  {
    id: "ndre",
    name: "NDRE",
    fullName: "Normalized Difference Red Edge",
    formula: "(NIR - RedEdge) / (NIR + RedEdge)",
    spectrum: "705nm (B5) & 842nm (B8)",
    description: "Detects early cellular chlorophyll decay and fungal blight before visible necrotic spots appear.",
    palette: ["#4a0e4e", "#8b008b", "#ff1493", "#ffa500", "#32cd32", "#006400"],
    healthyRange: "0.45 - 0.70",
    stressedRange: "0.10 - 0.30",
  },
  {
    id: "ndwi",
    name: "NDWI",
    fullName: "Normalized Difference Water Index",
    formula: "(Green - NIR) / (Green + NIR)",
    spectrum: "560nm (B3) & 842nm (B8)",
    description: "Monitors leaf liquid water content, irrigation saturation, and drought stress.",
    palette: ["#a0522d", "#deb887", "#e0ffff", "#00bfff", "#0000cd", "#000080"],
    healthyRange: "0.20 - 0.45",
    stressedRange: "-0.20 - 0.05",
  },
  {
    id: "thermal",
    name: "Thermal Evapotranspiration",
    fullName: "Canopy Surface Heat Anomaly",
    formula: "TIR Band 11 / TIR Band 12",
    spectrum: "10.4µm - 12.5µm",
    description: "Detects stomatal closure and transpiration blockage caused by foliar mycelia.",
    palette: ["#00008b", "#00ced1", "#ffff00", "#ff8c00", "#ff0000", "#8b0000"],
    healthyRange: "19.5°C - 22.0°C",
    stressedRange: "26.5°C - 31.0°C",
  },
  {
    id: "rgb",
    name: "True Color RGB",
    fullName: "High-Resolution Optical (10m)",
    formula: "Red (B4) + Green (B3) + Blue (B2)",
    spectrum: "400nm - 700nm Visible",
    description: "Natural satellite photographic reflectance for physical visual inspection.",
    palette: ["#2d4a22", "#416d33", "#5c9447", "#84b568", "#a6c88e"],
    healthyRange: "Vibrant Green",
    stressedRange: "Chlorotic Yellow/Brown",
  },
];

const HISTORICAL_PASSES = [
  { id: "pass-0", date: "Today (Sentinel-2A)", time: "10:42 AM UTC", cloudCover: "1.2%", quality: "99.4%" },
  { id: "pass-1", date: "5 Days Ago (Sentinel-2B)", time: "11:15 AM UTC", cloudCover: "3.8%", quality: "98.1%" },
  { id: "pass-2", date: "10 Days Ago (Sentinel-2A)", time: "10:38 AM UTC", cloudCover: "0.5%", quality: "99.8%" },
  { id: "pass-3", date: "15 Days Ago (Sentinel-2B)", time: "11:04 AM UTC", cloudCover: "12.0%", quality: "94.2%" },
];

const SatelliteNdviExplorer = ({ onDispatchDrone }) => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState("ndvi");
  const [selectedPass, setSelectedPass] = useState(0);
  const [hoveredPixel, setHoveredPixel] = useState(null);
  const [opacity, setOpacity] = useState(85);
  const [isScanning, setIsScanning] = useState(false);

  const currentModeObj = SATELLITE_INDEX_MODES.find((m) => m.id === activeMode) || SATELLITE_INDEX_MODES[0];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <div className="satellite-ndvi-card">
      {/* Top Header */}
      <div className="satellite-header-row">
        <div className="satellite-title-column">
          <div className="satellite-badge">
            <span className="satellite-pulse-dot"></span>
            <span>Copernicus Sentinel-2 • 10m Ground Resolution</span>
          </div>
          <h3 className="satellite-main-heading">
            Multispectral Satellite Vegetation Health & Chlorophyll Index
          </h3>
          <p className="satellite-sub-desc">
            Early spectral detection of cellular foliar stress, pathogen mycelium colonization, and stomatal water loss before symptoms appear to the naked eye.
          </p>
        </div>

        <div className="satellite-meta-stats">
          <div className="satellite-stat-box">
            <span className="stat-label">Next Orbit Pass</span>
            <span className="stat-value highlight">In 18h 24m</span>
          </div>
          <div className="satellite-stat-box">
            <span className="stat-label">Sun Elevation</span>
            <span className="stat-value">54.8° Optimal</span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="satellite-tabs-row">
        {SATELLITE_INDEX_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`satellite-tab-btn ${activeMode === mode.id ? "active" : ""}`}
            onClick={() => setActiveMode(mode.id)}
          >
            <span className="tab-mode-name">{mode.name}</span>
            <span className="tab-mode-desc">{mode.fullName.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Satellite Workspace */}
      <div className="satellite-workspace-grid">
        {/* Left Interactive Map Viewer */}
        <div className="satellite-viewport-panel">
          <div className={`satellite-canvas-container mode-${activeMode}`}>
            {/* Base Satellite Visual */}
            <div className="satellite-layer rgb-base"></div>

            {/* Multispectral False-Color Heatmap Layer */}
            <div
              className={`satellite-layer false-color-overlay mode-${activeMode} ${isScanning ? "scanning" : ""}`}
              style={{ opacity: opacity / 100 }}
            ></div>

            {/* Grid Coordinates Overlay */}
            <div className="satellite-grid-overlay">
              <div className="grid-cell" onMouseEnter={() => setHoveredPixel({ sector: "Sector 1A", val: activeMode === "ndvi" ? "0.88 (Vigorous)" : activeMode === "ndre" ? "0.62 (Healthy)" : "20.8°C", status: "Optimal" })}>
                <span className="cell-label">1A</span>
              </div>
              <div className="grid-cell" onMouseEnter={() => setHoveredPixel({ sector: "Sector 1B", val: activeMode === "ndvi" ? "0.82 (Healthy)" : activeMode === "ndre" ? "0.58 (Healthy)" : "22.1°C", status: "Optimal" })}>
                <span className="cell-label">1B</span>
              </div>
              <div className="grid-cell stressed" onMouseEnter={() => setHoveredPixel({ sector: "Sector 2A (Blight Outbreak)", val: activeMode === "ndvi" ? "0.41 (Critical Stress)" : activeMode === "ndre" ? "0.19 (Pathogen Alert)" : "28.4°C", status: "Severe Infestation Risk" })}>
                <span className="cell-label warning">2A (Outbreak)</span>
                <span className="anomaly-pulse"></span>
              </div>
              <div className="grid-cell warning-cell" onMouseEnter={() => setHoveredPixel({ sector: "Sector 2B", val: activeMode === "ndvi" ? "0.64 (Moderate)" : activeMode === "ndre" ? "0.38 (Watch)" : "24.5°C", status: "Early Stress" })}>
                <span className="cell-label">2B</span>
              </div>
              <div className="grid-cell" onMouseEnter={() => setHoveredPixel({ sector: "Sector 3A", val: activeMode === "ndvi" ? "0.91 (Max Vigor)" : activeMode === "ndre" ? "0.68 (Optimal)" : "21.0°C", status: "Optimal" })}>
                <span className="cell-label">3A</span>
              </div>
              <div className="grid-cell" onMouseEnter={() => setHoveredPixel({ sector: "Sector 3B", val: activeMode === "ndvi" ? "0.78 (Healthy)" : activeMode === "ndre" ? "0.52 (Healthy)" : "22.5°C", status: "Optimal" })}>
                <span className="cell-label">3B</span>
              </div>
            </div>

            {/* HUD Overlay */}
            <div className="satellite-hud-bar">
              <span className="hud-badge">LAT: 40.7128°N • LON: 74.0060°W</span>
              <span className="hud-badge">Band: {currentModeObj.spectrum}</span>
              <button type="button" className="hud-refresh-btn" onClick={handleSimulateScan}>
                <IconRefresh size={13} className={isScanning ? "spinning" : ""} />
                <span>{isScanning ? "Processing..." : "Re-fetch Orbit Tile"}</span>
              </button>
            </div>
          </div>

          {/* Opacity & Layer Slider Controls */}
          <div className="satellite-controls-bar">
            <div className="slider-group">
              <label className="slider-label">Spectral Layer Opacity: {opacity}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="opacity-range-slider"
              />
            </div>

            {/* Gradient Palette Legend */}
            <div className="palette-legend-group">
              <span className="legend-label">Stress</span>
              <div
                className="palette-color-strip"
                style={{
                  background: `linear-gradient(to right, ${currentModeObj.palette.join(", ")})`,
                }}
              ></div>
              <span className="legend-label">Healthy</span>
            </div>
          </div>
        </div>

        {/* Right Spectral Analytics & Details */}
        <div className="satellite-analytics-panel">
          <div className="analytics-card formula-box">
            <div className="analytics-title-row">
              <IconSparkles size={16} />
              <h4>{currentModeObj.fullName}</h4>
            </div>
            <p className="analytics-desc">{currentModeObj.description}</p>
            <div className="formula-tag">
              <code>{currentModeObj.formula}</code>
            </div>
          </div>

          {/* Live Hover Telemetry */}
          <div className="analytics-card hover-telemetry-box">
            <h5 className="telemetry-heading">Target Pixel Inspection</h5>
            {hoveredPixel ? (
              <div className="telemetry-data-stack">
                <div className="telemetry-row">
                  <span className="row-key">Active Sector:</span>
                  <span className="row-val highlight">{hoveredPixel.sector}</span>
                </div>
                <div className="telemetry-row">
                  <span className="row-key">{currentModeObj.name} Index:</span>
                  <span className="row-val bold">{hoveredPixel.val}</span>
                </div>
                <div className="telemetry-row">
                  <span className="row-key">Pathology Status:</span>
                  <span className={`row-val badge ${hoveredPixel.status.includes("Severe") ? "danger" : hoveredPixel.status.includes("Early") ? "warning" : "success"}`}>
                    {hoveredPixel.status}
                  </span>
                </div>
                {hoveredPixel.status.includes("Severe") && onDispatchDrone && (
                  <button
                    type="button"
                    className="dispatch-anomaly-btn"
                    onClick={() => onDispatchDrone("sec-2a")}
                  >
                    🚁 Dispatch Drone to Anomaly Hotspot
                  </button>
                )}
              </div>
            ) : (
              <p className="hover-hint">Hover over any farm sector on the satellite map to inspect real-time spectral reflectance values.</p>
            )}
          </div>

          {/* Historical Satellite Passes */}
          <div className="analytics-card passes-card">
            <h5 className="passes-heading">Historical Orbit Overflights</h5>
            <div className="passes-list">
              {HISTORICAL_PASSES.map((pass, idx) => (
                <div
                  key={pass.id}
                  className={`pass-item ${selectedPass === idx ? "selected" : ""}`}
                  onClick={() => setSelectedPass(idx)}
                >
                  <div className="pass-radio-dot"></div>
                  <div className="pass-text-col">
                    <span className="pass-date">{pass.date}</span>
                    <span className="pass-meta">Cloud: {pass.cloudCover} • Quality: {pass.quality}</span>
                  </div>
                  <IconCheck size={14} className="pass-check-icon" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteNdviExplorer;
