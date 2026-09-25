import React, { useState } from "react";
import "./RegionalOutbreakMap.css";
import {
  IconRadar,
  IconAlert,
  IconShield,
  IconCheck,
  IconRefresh,
  IconClock,
  IconSparkles,
} from "./Icons";
import { useTranslation } from "../context/LanguageContext";

const SAMPLE_COMMUNITY_OUTBREAKS = [
  {
    id: "out-1",
    district: "North Agri-Belt (Zone 4)",
    disease: "Late Blight (Phytophthora infestans)",
    crop: "Potato",
    distanceKm: 8.5,
    casesReported: 6,
    sporeRisk: "Critical (>85% RH)",
    timeAgo: "2 hours ago",
    status: "active",
  },
  {
    id: "out-2",
    district: "East Valley Terrace",
    disease: "Early Blight (Alternaria solani)",
    crop: "Tomato",
    distanceKm: 16.2,
    casesReported: 4,
    sporeRisk: "Moderate",
    timeAgo: "6 hours ago",
    status: "contained",
  },
  {
    id: "out-3",
    district: "Southern River Basin",
    disease: "Common Rust (Puccinia sorghi)",
    crop: "Corn (Maize)",
    distanceKm: 24.0,
    casesReported: 2,
    sporeRisk: "Low",
    timeAgo: "14 hours ago",
    status: "monitored",
  },
];

const RegionalOutbreakMap = () => {
  const { t } = useTranslation();
  const [filterRadius, setFilterRadius] = useState(25); // km
  const [outbreaks, setOutbreaks] = useState(SAMPLE_COMMUNITY_OUTBREAKS);
  const [reportedSuccess, setReportedSuccess] = useState(false);

  const filtered = outbreaks.filter((o) => o.distanceKm <= filterRadius);

  const handleReportOutbreak = () => {
    setReportedSuccess(true);
    setTimeout(() => {
      setReportedSuccess(false);
    }, 3000);
  };

  return (
    <div className="regional-outbreak-card">
      <div className="outbreak-header-row">
        <div className="outbreak-title-col">
          <div className="outbreak-badge">
            <span className="outbreak-pulse-dot"></span>
            <span>Regional Agricultural Epidemiology GIS</span>
          </div>
          <h3 className="outbreak-main-heading">
            Community Foliar Outbreak & Spore Contagion Cluster Map
          </h3>
          <p className="outbreak-sub-desc">
            Crowdsourced, anonymized disease reports from verified agricultural extension networks and IoT spore sensors within your regional perimeter.
          </p>
        </div>

        {/* Radius Filter */}
        <div className="outbreak-radius-filter">
          <label>Alert Radius: {filterRadius} km</label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={filterRadius}
            onChange={(e) => setFilterRadius(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Proactive Outbreak Alert Banner */}
      <div className="outbreak-alert-banner">
        <IconAlert size={20} className="alert-icon" />
        <div className="alert-banner-text">
          <span className="alert-banner-title">
            ⚠️ Active High-Risk Late Blight Cluster Detected ({filtered.length} Alerts within {filterRadius} km)
          </span>
          <span className="alert-banner-sub">
            Relative atmospheric humidity exceeding 82%. Microclimate models suggest high spore travel velocity downwind. Apply rain-fast protective contact fungicides within 36 hours.
          </span>
        </div>
      </div>

      {/* Outbreak Clusters List */}
      <div className="outbreak-clusters-grid">
        {filtered.map((item) => (
          <div key={item.id} className={`cluster-card status-${item.status}`}>
            <div className="cluster-top-row">
              <span className="cluster-district">{item.district}</span>
              <span className="cluster-distance">{item.distanceKm} km away</span>
            </div>

            <h4 className="cluster-disease">{item.disease}</h4>
            <span className="cluster-crop">Host Crop: <strong>{item.crop}</strong></span>

            <div className="cluster-metrics-row">
              <div className="cluster-metric">
                <span className="c-key">Cases:</span>
                <span className="c-val">{item.casesReported} Reported</span>
              </div>
              <div className="cluster-metric">
                <span className="c-key">Spore Risk:</span>
                <span className={`c-val ${item.sporeRisk.includes("Critical") ? "danger" : "warning"}`}>
                  {item.sporeRisk}
                </span>
              </div>
            </div>

            <div className="cluster-footer-row">
              <span className="cluster-time">
                <IconClock size={12} /> {item.timeAgo}
              </span>
              <span className={`cluster-badge ${item.status}`}>
                {item.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Community Contribution Bar */}
      <div className="community-contribute-bar">
        <div className="contribute-info">
          <span className="contribute-title">Spotted early symptoms on your farm?</span>
          <span className="contribute-sub">Submit an anonymized scan to warn neighbouring growers in your watershed.</span>
        </div>

        <button
          type="button"
          className="report-outbreak-btn"
          onClick={handleReportOutbreak}
        >
          {reportedSuccess ? (
            <>
              <IconCheck size={16} />
              <span>Report Anonymously Logged!</span>
            </>
          ) : (
            <>
              <IconSparkles size={16} />
              <span>Broadcast Field Outbreak Alert</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegionalOutbreakMap;
