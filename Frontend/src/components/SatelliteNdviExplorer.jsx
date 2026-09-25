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
    healthyRange: "0.72 - 0.95",
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
    healthyRange: "0.45 - 0.72",
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
  { id: "pass-0", date: "Today (Sentinel-2A)", time: "10:42 AM UTC", cloudCover: "1.2%", quality: "99.4%", modFactor: 1.0 },
  { id: "pass-1", date: "5 Days Ago (Sentinel-2B)", time: "11:15 AM UTC", cloudCover: "3.8%", quality: "98.1%", modFactor: 0.94 },
  { id: "pass-2", date: "10 Days Ago (Sentinel-2A)", time: "10:38 AM UTC", cloudCover: "0.5%", quality: "99.8%", modFactor: 0.88 },
  { id: "pass-3", date: "15 Days Ago (Sentinel-2B)", time: "11:04 AM UTC", cloudCover: "12.0%", quality: "94.2%", modFactor: 0.82 },
];

const SatelliteNdviExplorer = ({ sectors = [], onDispatchDrone }) => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState("ndvi");
  const [selectedPass, setSelectedPass] = useState(0);
  const [hoveredSectorId, setHoveredSectorId] = useState(null);
  const [opacity, setOpacity] = useState(85);
  const [isScanning, setIsScanning] = useState(false);

  // Helper to compute spectral values dynamically based on live biophysical sector telemetry
  const computeSectorSpectralData = (sec, mode, passIdx) => {
    if (!sec) return { val: "0.85", status: "Optimal", color: "#10b981", numVal: 0.85 };
    const factor = HISTORICAL_PASSES[passIdx]?.modFactor || 1.0;
    const health = sec.healthIndex * factor;

    if (mode === "ndvi") {
      let val = health >= 90
        ? (0.80 + (health - 90) * 0.015).toFixed(2)
        : health >= 75
        ? (0.60 + (health - 75) * 0.013).toFixed(2)
        : (0.28 + (health / 100) * 0.32).toFixed(2);
      let status = health >= 88 ? "Vigorous Biomass" : health >= 75 ? "Moderate Vigor" : "Critical Pathogen Stress";
      let color = health >= 88 ? "#10b981" : health >= 75 ? "#f59e0b" : "#ef4444";
      return { val: `${val} (${status.split(" ")[0]})`, status, color, numVal: parseFloat(val) };
    }

    if (mode === "ndre") {
      let val = (Math.max(0.12, (health / 100) * 0.70)).toFixed(2);
      let status = health >= 88 ? "Healthy Red Edge" : health >= 75 ? "Early Chlorosis" : "Mycelial Colonization Alert";
      let color = health >= 88 ? "#10b981" : health >= 75 ? "#f59e0b" : "#db2777";
      return { val: `${val} (${status.split(" ")[0]})`, status, color, numVal: parseFloat(val) };
    }

    if (mode === "ndwi") {
      let moisture = sec.soilMoisture || 38.0;
      let val = (((moisture - 10) / 70) * 0.55 - 0.05).toFixed(2);
      let status = moisture > 48 ? "Over-saturated (Spore Risk)" : moisture > 32 ? "Optimal Hydration" : "Moisture Deficit";
      let color = moisture > 48 ? "#3b82f6" : moisture > 32 ? "#06b6d4" : "#ca8a04";
      return { val: `${val} (${status.split(" ")[0]})`, status, color, numVal: parseFloat(val) };
    }

    if (mode === "thermal") {
      let temp = ((sec.canopyTemp || 21.0) + (100 - health) * 0.08).toFixed(1);
      let status = temp > 25.5 ? "Transpiration Blockage" : "Normal Canopy Thermal";
      let color = temp > 25.5 ? "#ef4444" : "#06b6d4";
      return { val: `${temp}°C`, status, color, numVal: parseFloat(temp) };
    }

    // Default RGB
    return {
      val: health >= 85 ? "Lush Green Foliage" : "Discolored / Chlorotic",
      status: health >= 85 ? "Optimal" : "Necrotic Risk",
      color: health >= 85 ? "#10b981" : "#ef4444",
      numVal: health,
    };
  };

  const currentModeObj = SATELLITE_INDEX_MODES.find((m) => m.id === activeMode) || SATELLITE_INDEX_MODES[0];

  // Dynamic farm-wide satellite health calculation
  const hasCriticalSector = sectors.some((s) => s.status === "critical" || s.healthIndex < 75);
  const criticalSector = sectors.find((s) => s.status === "critical" || s.healthIndex < 75) || sectors[2];
  const hoveredSector = sectors.find((s) => s.id === hoveredSectorId) || sectors[0] || {};
  const hoveredTelemetry = computeSectorSpectralData(hoveredSector, activeMode, selectedPass);

  // Dynamic False-Color Heatmap Gradient Generator based on live sectors
  const generateDynamicHeatmapStyle = () => {
    // Generate dynamic radial color stops corresponding to sectors 1A, 1B, 2A, 2B, 3A, 3B
    const sec2a = sectors.find((s) => s.id === "sec-2a");
    const sec2b = sectors.find((s) => s.id === "sec-2b");
    const is2aStressed = sec2a ? sec2a.healthIndex < 80 : false;
    const is2bStressed = sec2b ? sec2b.healthIndex < 80 : false;

    if (activeMode === "ndvi") {
      if (is2aStressed || is2bStressed) {
        return {
          background: "radial-gradient(circle at 75% 35%, #ef4444 0%, #f59e0b 28%, #84cc16 55%, #15803d 85%, #052e16 100%)",
          mixBlendMode: "screen",
        };
      }
      return {
        background: "radial-gradient(circle at 50% 50%, #10b981 0%, #059669 35%, #047857 70%, #064e3b 100%)",
        mixBlendMode: "screen",
      };
    }

    if (activeMode === "ndre") {
      if (is2aStressed || is2bStressed) {
        return {
          background: "radial-gradient(circle at 75% 35%, #c026d3 0%, #db2777 30%, #eab308 60%, #16a34a 90%)",
          mixBlendMode: "screen",
        };
      }
      return {
        background: "radial-gradient(circle at 50% 50%, #34d399 0%, #10b981 40%, #059669 80%, #064e3b 100%)",
        mixBlendMode: "screen",
      };
    }

    if (activeMode === "ndwi") {
      return {
        background: "radial-gradient(circle at 40% 60%, #0284c7 0%, #0369a1 40%, #10b981 80%, #065f46 100%)",
        mixBlendMode: "screen",
      };
    }

    if (activeMode === "thermal") {
      if (is2aStressed || is2bStressed) {
        return {
          background: "radial-gradient(circle at 75% 35%, #dc2626 0%, #f97316 35%, #eab308 65%, #06b6d4 100%)",
          mixBlendMode: "color-dodge",
        };
      }
      return {
        background: "radial-gradient(circle at 50% 50%, #06b6d4 0%, #0284c7 40%, #0369a1 80%, #0f172a 100%)",
        mixBlendMode: "screen",
      };
    }

    // RGB
    return {
      background: is2aStressed
        ? "radial-gradient(circle at 75% 35%, #ca8a04 0%, #4d7c0f 45%, #14532d 100%)"
        : "radial-gradient(circle at 50% 50%, #4d7c0f 0%, #365314 60%, #14532d 100%)",
      mixBlendMode: "normal",
    };
  };

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
            <span>Copernicus Sentinel-2 • 10m Ground Resolution (Live Telemetry Linked)</span>
          </div>
          <h3 className="satellite-main-heading">
            Multispectral Satellite Vegetation Health & Chlorophyll Index
          </h3>
          <p className="satellite-sub-desc">
            Early spectral detection of cellular foliar stress, pathogen mycelium colonization, and stomatal water loss dynamically synchronized with your farm's biophysical twin.
          </p>
        </div>

        <div className="satellite-meta-stats">
          <div className="satellite-stat-box">
            <span className="stat-label">Next Orbit Pass</span>
            <span className="stat-value highlight">In 18h 24m</span>
          </div>
          <div className="satellite-stat-box">
            <span className="stat-label">Farm Status</span>
            <span className={`stat-value ${hasCriticalSector ? "danger-text" : "highlight"}`}>
              {hasCriticalSector ? "Anomaly Detected" : "100% Vigorous"}
            </span>
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

            {/* Dynamic Multispectral False-Color Heatmap Layer */}
            <div
              className={`satellite-layer false-color-overlay mode-${activeMode} ${isScanning ? "scanning" : ""}`}
              style={{
                opacity: opacity / 100,
                ...generateDynamicHeatmapStyle(),
              }}
            ></div>

            {/* Dynamic Grid Coordinates Overlay */}
            <div className="satellite-grid-overlay">
              {sectors.map((sec) => {
                const secData = computeSectorSpectralData(sec, activeMode, selectedPass);
                const isStressed = sec.status === "critical" || sec.healthIndex < 75;
                const isWarning = sec.status === "warning" || (sec.healthIndex >= 75 && sec.healthIndex < 88);

                return (
                  <div
                    key={sec.id}
                    className={`grid-cell ${isStressed ? "stressed" : isWarning ? "warning-cell" : "healthy-cell"}`}
                    onMouseEnter={() => setHoveredSectorId(sec.id)}
                  >
                    <span className={`cell-label ${isStressed ? "warning" : ""}`}>
                      {sec.name.split("-")[0].trim()} ({sec.healthIndex}%)
                    </span>
                    {isStressed && <span className="anomaly-pulse"></span>}
                  </div>
                );
              })}
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

          {/* Live Hover Telemetry Linked to Active Sector */}
          <div className="analytics-card hover-telemetry-box">
            <h5 className="telemetry-heading">Target Pixel Inspection</h5>
            {hoveredSector?.name ? (
              <div className="telemetry-data-stack">
                <div className="telemetry-row">
                  <span className="row-key">Active Sector:</span>
                  <span className="row-val highlight">{hoveredSector.name}</span>
                </div>
                <div className="telemetry-row">
                  <span className="row-key">{currentModeObj.name} Value:</span>
                  <span className="row-val bold">{hoveredTelemetry.val}</span>
                </div>
                <div className="telemetry-row">
                  <span className="row-key">Pathology Status:</span>
                  <span
                    className="row-val badge"
                    style={{
                      background: `${hoveredTelemetry.color}22`,
                      color: hoveredTelemetry.color,
                      border: `1px solid ${hoveredTelemetry.color}44`,
                    }}
                  >
                    {hoveredTelemetry.status} (Health: {hoveredSector.healthIndex}%)
                  </span>
                </div>
                {hoveredSector.healthIndex < 80 && onDispatchDrone && (
                  <button
                    type="button"
                    className="dispatch-anomaly-btn"
                    onClick={() => onDispatchDrone(hoveredSector.id)}
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
