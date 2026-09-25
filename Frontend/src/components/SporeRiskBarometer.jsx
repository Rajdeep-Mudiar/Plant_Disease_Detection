import React, { useState } from "react";
import "./SporeRiskBarometer.css";
import {
  IconRadar,
  IconActivity,
  IconShield,
  IconAlert,
  IconCheck,
  IconClock,
} from "./Icons";

const HOURLY_TIMELINE = [
  { time: "00:00", temp: 16, rh: 92, lwd: 1.0, risk: "High", score: 78 },
  { time: "03:00", temp: 15, rh: 96, lwd: 1.0, risk: "Critical", score: 92 },
  { time: "06:00", temp: 17, rh: 94, lwd: 1.0, risk: "Critical", score: 95 },
  { time: "09:00", temp: 21, rh: 78, lwd: 0.5, risk: "Moderate", score: 54 },
  { time: "12:00", temp: 26, rh: 58, lwd: 0.0, risk: "Low", score: 22 },
  { time: "15:00", temp: 28, rh: 52, lwd: 0.0, risk: "Low", score: 18 },
  { time: "18:00", temp: 23, rh: 72, lwd: 0.2, risk: "Low", score: 35 },
  { time: "21:00", temp: 19, rh: 88, lwd: 0.8, risk: "Elevated", score: 68 },
];

const SporeRiskBarometer = () => {
  const [selectedHour, setSelectedHour] = useState(2); // 06:00 AM (Peak risk)

  const current = HOURLY_TIMELINE[selectedHour];

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Critical":
        return "#dc2626";
      case "High":
      case "Elevated":
        return "#ea580c";
      case "Moderate":
        return "#d97706";
      default:
        return "#16a34a";
    }
  };

  return (
    <div className="spore-barometer-card">
      <div className="spore-header-row">
        <div className="spore-title-col">
          <div className="spore-badge">
            <IconRadar size={14} />
            <span>Pathogen Biophysics &amp; Spore Inoculation Engine</span>
          </div>
          <h3 className="spore-main-title">
            Hourly Pathogen Spore Germination Risk Barometer
          </h3>
          <p className="spore-sub-desc">
            Calculated via the <strong>Smith Period &amp; BlightCast Algorithm</strong> (Leaf Wetness Duration &times; Consecutive RH &gt; 90% &times; Thermal Incubation Window).
          </p>
        </div>

        <div className="spore-current-gauge">
          <div
            className="gauge-circle"
            style={{
              background: `conic-gradient(${getRiskColor(
                current.risk
              )} ${current.score * 3.6}deg, rgba(203, 213, 225, 0.2) 0deg)`,
            }}
          >
            <div className="gauge-inner">
              <span className="gauge-score">{current.score}</span>
              <span className="gauge-label">RISK INDEX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Card */}
      <div className="spore-status-banner" style={{ borderLeftColor: getRiskColor(current.risk) }}>
        <div className="sb-left">
          <span
            className="risk-tag-pill"
            style={{
              background: `${getRiskColor(current.risk)}15`,
              color: getRiskColor(current.risk),
            }}
          >
            {current.risk.toUpperCase()} INFECTION PRESSURE ({current.time})
          </span>
          <p className="sb-explanation">
            {current.score >= 80
              ? "🚨 CRITICAL INOCULATION ALERT: Continuous free moisture on leaves exceeds 8 hours between 15°C–21°C. Zoospores actively releasing flagella and penetrating leaf stomata. Immediate protectant spray required."
              : current.score >= 50
              ? "⚠️ ELEVATED INFECTION RISK: Canopy dew condensation detected. Pre-emptive contact fungicide shield recommended before next evening dew period."
              : "✅ LOW SPORE PRESSURE: Low relative humidity and dry canopy surfaces inhibit fungal conidia germination."}
          </p>
        </div>

        <div className="sb-metrics-grid">
          <div className="sbm-item">
            <span className="sbm-label">Canopy Temp</span>
            <span className="sbm-val">{current.temp}°C</span>
          </div>
          <div className="sbm-item">
            <span className="sbm-label">Relative Humidity</span>
            <span className="sbm-val">{current.rh}%</span>
          </div>
          <div className="sbm-item">
            <span className="sbm-label">Leaf Wetness</span>
            <span className="sbm-val">{current.lwd > 0 ? `${current.lwd * 10} hrs` : "0 hrs (Dry)"}</span>
          </div>
          <div className="sbm-item">
            <span className="sbm-label">Spore Viability</span>
            <span className="sbm-val highlight" style={{ color: getRiskColor(current.risk) }}>
              {current.score}% Active
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Bar Timeline */}
      <div className="spore-hourly-timeline-section">
        <h4 className="sht-title">24-Hour Microclimate Pathogen Risk Timeline (Click hour to inspect)</h4>
        <div className="sht-bars-grid">
          {HOURLY_TIMELINE.map((item, index) => {
            const isSelected = index === selectedHour;
            const barColor = getRiskColor(item.risk);
            return (
              <div
                key={index}
                className={`sht-bar-col ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedHour(index)}
              >
                <div className="sht-bar-track">
                  <div
                    className="sht-bar-fill"
                    style={{
                      height: `${item.score}%`,
                      background: barColor,
                    }}
                  ></div>
                </div>
                <span className="sht-score-text">{item.score}</span>
                <span className="sht-time-label">{item.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SporeRiskBarometer;
