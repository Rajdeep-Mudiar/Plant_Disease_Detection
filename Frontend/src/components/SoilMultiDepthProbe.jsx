import React, { useState } from "react";
import "./SoilMultiDepthProbe.css";
import { IconActivity, IconShield, IconPlant } from "./Icons";

const DEPTH_LAYERS = {
  d5: {
    depth: "5 cm (Topsoil / Seedling Root Zone)",
    soilType: "Sandy Loam Top Horizon",
    moisture: 38,
    nitrogen: 48,
    phosphorus: 32,
    potassium: 195,
    ec: 1.2,
    ph: 6.4,
    temp: 24.2,
    status: "Optimal Moisture & Nutrient Density",
    leachingRisk: "Low",
  },
  d15: {
    depth: "15 cm (Main Tuber / Root Absorption Core)",
    soilType: "Humus-Enriched Sub-Horizon",
    moisture: 45,
    nitrogen: 34,
    phosphorus: 28,
    potassium: 160,
    ec: 1.5,
    ph: 6.2,
    temp: 21.8,
    status: "Peak Active Root Absorption",
    leachingRisk: "Safe Catchment Zone",
  },
  d30: {
    depth: "30 cm (Deep Subsoil / Aquifer Transition)",
    soilType: "Clay-Loam Substratum",
    moisture: 58,
    nitrogen: 12,
    phosphorus: 14,
    potassium: 85,
    ec: 0.8,
    ph: 6.7,
    temp: 18.5,
    status: "Capillary Water Reserve",
    leachingRisk: "Leaching Detected (Minor N runoff)",
  },
};

export default function SoilMultiDepthProbe() {
  const [selectedDepth, setSelectedDepth] = useState("d15");
  const [probePowered, setProbePowered] = useState(true);

  const data = DEPTH_LAYERS[selectedDepth];

  return (
    <div className="soil-probe-card">
      <div className="probe-header">
        <div className="probe-title-group">
          <div className="probe-icon-frame">
            <IconActivity size={22} />
          </div>
          <div>
            <div className="probe-badge-row">
              <span className="probe-badge">PRECISION IOT TELEMETRY</span>
              <span className="probe-sub-badge">Multi-Depth Optical Soil Sensor</span>
            </div>
            <h3 className="probe-main-title">Multi-Depth Soil NPK, EC & Moisture Virtual Probe</h3>
            <p className="probe-sub-title">
              Inspect real-time underground root horizon telemetry at 5 cm, 15 cm, and 30 cm depths to detect fertilizer leaching, root salinity (EC), and soil pH.
            </p>
          </div>
        </div>

        <div className="probe-power-status">
          <span className={`probe-status-dot ${probePowered ? "active" : ""}`}></span>
          <span className="probe-status-text">{probePowered ? "Probe Active (LoRaWAN 868MHz)" : "Sensor Standby"}</span>
        </div>
      </div>

      <div className="probe-body-grid">
        {/* Left: Virtual Cross Section Soil Profile */}
        <div className="soil-profile-column">
          <div className="profile-depth-selector">
            {[
              { id: "d5", label: "5 cm Depth (Topsoil)", icon: "🌱", color: "#84cc16" },
              { id: "d15", label: "15 cm Depth (Active Roots)", icon: "🥔", color: "#eab308" },
              { id: "d30", label: "30 cm Depth (Deep Aquifer)", icon: "💧", color: "#0284c7" },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                className={`depth-button ${selectedDepth === d.id ? "active" : ""}`}
                onClick={() => setSelectedDepth(d.id)}
              >
                <div className="depth-btn-left">
                  <span className="depth-icon">{d.icon}</span>
                  <div className="depth-text-col">
                    <span className="depth-name">{d.label}</span>
                    <span className="depth-status-brief">{DEPTH_LAYERS[d.id].status}</span>
                  </div>
                </div>
                <span className="depth-val-tag">{DEPTH_LAYERS[d.id].moisture}% Moisture</span>
              </button>
            ))}
          </div>

          {/* Graphical Soil Horizon Strata */}
          <div className="soil-strata-diagram">
            <div className={`strata-layer s-5 ${selectedDepth === "d5" ? "highlight" : ""}`} onClick={() => setSelectedDepth("d5")}>
              <span className="strata-label">0–10 cm: Topsoil Horizon (pH {DEPTH_LAYERS.d5.ph})</span>
            </div>
            <div className={`strata-layer s-15 ${selectedDepth === "d15" ? "highlight" : ""}`} onClick={() => setSelectedDepth("d15")}>
              <span className="strata-label">10–20 cm: Root Feeding Horizon (N: {DEPTH_LAYERS.d15.nitrogen} ppm)</span>
            </div>
            <div className={`strata-layer s-30 ${selectedDepth === "d30" ? "highlight" : ""}`} onClick={() => setSelectedDepth("d30")}>
              <span className="strata-label">20–40 cm: Subsoil Aquifer Transition</span>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Telemetry Metrics Dashboard */}
        <div className="probe-telemetry-column">
          <div className="telemetry-hud-card">
            <div className="hud-top-bar">
              <span className="hud-layer-title">{data.depth}</span>
              <span className="hud-soil-tag">{data.soilType}</span>
            </div>

            <div className="telemetry-meters-grid">
              {/* Nitrogen */}
              <div className="t-meter-card">
                <span className="tm-label">Nitrogen (N)</span>
                <span className="tm-val green">{data.nitrogen} <small>mg/kg</small></span>
                <span className="tm-sub">Optimal (30–60)</span>
              </div>

              {/* Phosphorus */}
              <div className="t-meter-card">
                <span className="tm-label">Phosphorus (P)</span>
                <span className="tm-val blue">{data.phosphorus} <small>mg/kg</small></span>
                <span className="tm-sub">Available P (20–40)</span>
              </div>

              {/* Potassium */}
              <div className="t-meter-card">
                <span className="tm-label">Potassium (K)</span>
                <span className="tm-val orange">{data.potassium} <small>mg/kg</small></span>
                <span className="tm-sub">Rich (150–220)</span>
              </div>

              {/* Soil Moisture */}
              <div className="t-meter-card">
                <span className="tm-label">Volumetric Moisture</span>
                <span className="tm-val cyan">{data.moisture}%</span>
                <span className="tm-sub">Field Capacity</span>
              </div>

              {/* Electrical Conductivity (Salinity) */}
              <div className="t-meter-card">
                <span className="tm-label">Salinity EC</span>
                <span className="tm-val purple">{data.ec} <small>dS/m</small></span>
                <span className="tm-sub">Non-Saline (&lt;2.0)</span>
              </div>

              {/* Soil pH */}
              <div className="t-meter-card">
                <span className="tm-label">Soil pH Acidity</span>
                <span className="tm-val yellow">{data.ph}</span>
                <span className="tm-sub">Ideal for Potato (5.8–6.5)</span>
              </div>
            </div>

            {/* Leaching & Health Advisory */}
            <div className="leaching-advisory-box">
              <div className="adv-header">
                <IconShield size={16} />
                <span className="adv-title">Underground Fertilizer Leaching Status:</span>
              </div>
              <p className="adv-text">
                {selectedDepth === "d30"
                  ? "⚠️ Minor Nitrogen leaching detected in deep subsoil. Reduce single-dose irrigation runtime by 15 minutes to keep nutrients in the 15 cm active root zone."
                  : "✅ Nutrients are tightly bound within the primary root absorption zone. No groundwater contamination risk detected."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
