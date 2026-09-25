import React, { useState } from "react";
import "./PhytotoxicityRiskIndex.css";
import { IconSun, IconShield, IconActivity } from "./Icons";

const CHEMICAL_PROFILES = {
  sulfur: {
    name: "Elemental Wettable Sulfur (80% WDG)",
    icon: "🟡",
    type: "Fungicide / Acaricide",
    maxSafeTemp: 29,
    minSafeHumidity: 30,
    oilIntervalDays: 14,
    burnRiskFormula: (temp, rh, sun) => {
      if (temp >= 32) return { risk: "EXTREME", score: 98, warning: "🚨 CRITICAL: Do NOT spray. Vaporizes rapidly above 32°C causing massive leaf chlorosis and fruit russeting." };
      if (temp >= 28 && sun === "high") return { risk: "HIGH", score: 75, warning: "⚠️ HIGH RISK: Hot direct sun will cause sulfur phytotoxicity. Delay application until dusk (post 5 PM)." };
      if (temp < 15) return { risk: "LOW", score: 20, warning: "🟢 Safe to apply, though fungicidal vapor efficacy is reduced below 18°C." };
      return { risk: "OPTIMAL", score: 10, warning: "✅ Ideal window. Foliage safe from scorch." };
    },
  },
  copper: {
    name: "Copper Hydroxide (Kocide 3000)",
    icon: "🔵",
    type: "Bactericide / Fungicide",
    maxSafeTemp: 35,
    minSafeHumidity: 85, // slow drying causes ionic copper phytotoxicity
    oilIntervalDays: 0,
    burnRiskFormula: (temp, rh, sun) => {
      if (rh >= 88) return { risk: "HIGH", score: 80, warning: "⚠️ High humidity keeps leaf wet for >2 hours, releasing excessive free soluble Cu2+ ions that cause leaf speckling." };
      if (temp > 34) return { risk: "MODERATE", score: 55, warning: "🟡 Hot conditions may cause minor margin burn on tender new flush leaves." };
      return { risk: "OPTIMAL", score: 15, warning: "✅ Fast drying conditions ensure protective insoluble film formation without leaf scorch." };
    },
  },
  hort_oil: {
    name: "Mineral / Horticultural Spray Oil",
    icon: "🛢️",
    type: "Insecticide / Adjuvant",
    maxSafeTemp: 30,
    minSafeHumidity: 40,
    oilIntervalDays: 21,
    burnRiskFormula: (temp, rh, sun) => {
      if (temp >= 31) return { risk: "EXTREME", score: 95, warning: "🚨 Oil film breaks down plant respiration cuticle in hot sun (>31°C), suffocating tissue." };
      if (sun === "high") return { risk: "HIGH", score: 70, warning: "⚠️ Direct UV radiation concentrates through oil droplets like lenses. Spray only in overcast skies or sunset." };
      return { risk: "OPTIMAL", score: 12, warning: "✅ Safe to apply. No leaf desiccation risk." };
    },
  },
  foliar_npk: {
    name: "High-EC Foliar Fertilizer (19-19-19 + TE)",
    icon: "🧪",
    type: "Nutrient Foliar Salt",
    maxSafeTemp: 30,
    minSafeHumidity: 50,
    oilIntervalDays: 0,
    burnRiskFormula: (temp, rh, sun) => {
      if (temp >= 33 && rh < 40) return { risk: "HIGH", score: 85, warning: "⚠️ Rapid water evaporation leaves concentrated fertilizer salt crystals on leaf tips, causing Osmotic Burn." };
      if (temp >= 28) return { risk: "MODERATE", score: 45, warning: "🟡 Moderate risk of tip burn. Dilute spray volume by +20% with fresh water." };
      return { risk: "OPTIMAL", score: 10, warning: "✅ Safe stomatal uptake window." };
    },
  },
};

export default function PhytotoxicityRiskIndex() {
  const [selectedChemKey, setSelectedChemKey] = useState("sulfur");
  const [ambientTemp, setAmbientTemp] = useState(31);
  const [humidity, setHumidity] = useState(65);
  const [solarRadiation, setSolarRadiation] = useState("high"); // "low", "med", "high"
  const [recentOilSpray, setRecentOilSpray] = useState(false);

  const chem = CHEMICAL_PROFILES[selectedChemKey];
  let assessment = chem.burnRiskFormula(ambientTemp, humidity, solarRadiation);

  // Check sulfur-oil antagonism
  if (selectedChemKey === "sulfur" && recentOilSpray) {
    assessment = {
      risk: "CATASTROPHIC",
      score: 100,
      warning: "🚨 CATASTROPHIC PHYTOTOXICITY! Sulfur mixed with or applied within 14 days of Horticultural Oil will destroy leaf cuticle and defoliate entire canopy.",
    };
  }

  const getRiskColor = (risk) => {
    if (risk === "CATASTROPHIC" || risk === "EXTREME") return "#dc2626";
    if (risk === "HIGH") return "#ea580c";
    if (risk === "MODERATE") return "#d97706";
    return "#16a34a";
  };

  return (
    <div className="phytotoxicity-card">
      <div className="phyto-header">
        <div className="phyto-title-group">
          <div className="phyto-icon-frame">
            <IconSun size={22} />
          </div>
          <div>
            <div className="phyto-badge-row">
              <span className="phyto-badge">SAFETY & CROP PROTECTION</span>
              <span className="phyto-sub-badge">Chemical Burn Index</span>
            </div>
            <h3 className="phyto-main-title">Phytotoxicity & Chemical Leaf Burn Risk Index</h3>
            <p className="phyto-sub-title">
              Calculates whether weather conditions (Heat, Solar UV, Humidity) will cause chemical scorching or phytotoxic leaf burn before you fill your sprayer tank.
            </p>
          </div>
        </div>
      </div>

      <div className="phyto-body-grid">
        {/* Left: Input Controls */}
        <div className="phyto-inputs-column">
          <div className="input-group">
            <label className="input-label">Select Active Formulation:</label>
            <div className="chem-selector-grid">
              {Object.entries(CHEMICAL_PROFILES).map(([key, c]) => (
                <button
                  key={key}
                  type="button"
                  className={`chem-select-btn ${selectedChemKey === key ? "active" : ""}`}
                  onClick={() => setSelectedChemKey(key)}
                >
                  <span className="chem-btn-icon">{c.icon}</span>
                  <div className="chem-btn-text">
                    <span className="chem-btn-name">{c.name.split("(")[0]}</span>
                    <span className="chem-btn-type">{c.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="sliders-panel">
            <div className="slider-row">
              <div className="s-label-val">
                <span>Ambient Air Temperature:</span>
                <strong>{ambientTemp}°C ({((ambientTemp * 9) / 5 + 32).toFixed(0)}°F)</strong>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(Number(e.target.value))}
                className="phyto-slider temp"
              />
              <div className="slider-hints">
                <span>Cool (10°C)</span>
                <span>Threshold (28°C)</span>
                <span>Extreme Heat (45°C)</span>
              </div>
            </div>

            <div className="slider-row">
              <div className="s-label-val">
                <span>Relative Humidity (RH):</span>
                <strong>{humidity}%</strong>
              </div>
              <input
                type="range"
                min="15"
                max="98"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="phyto-slider rh"
              />
              <div className="slider-hints">
                <span>Dry / Evaporative</span>
                <span>Normal (55–70%)</span>
                <span>Saturated Dew (98%)</span>
              </div>
            </div>

            <div className="sun-intensity-toggle-row">
              <span className="sun-label">Direct Sunlight & UV Intensity:</span>
              <div className="sun-pills">
                {["low", "med", "high"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`sun-pill ${solarRadiation === level ? "active" : ""}`}
                    onClick={() => setSolarRadiation(level)}
                  >
                    {level === "low" ? "☁️ Overcast / Dusk" : level === "med" ? "⛅ Mild Sunlight" : "☀️ Intense Mid-Day"}
                  </button>
                ))}
              </div>
            </div>

            {selectedChemKey === "sulfur" && (
              <div className="oil-checkbox-box">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={recentOilSpray}
                    onChange={(e) => setRecentOilSpray(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    Field was sprayed with Horticultural/Mineral Oil in the last 14 days
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right: Real-Time Risk Meter & Recommendation */}
        <div className="phyto-results-column">
          <div className="risk-gauge-card" style={{ borderColor: getRiskColor(assessment.risk) }}>
            <div className="gauge-header">
              <span className="gauge-label">LEAF PHYTOTOXICITY RISK</span>
              <span
                className="risk-tag"
                style={{ background: getRiskColor(assessment.risk), color: "#ffffff" }}
              >
                {assessment.risk}
              </span>
            </div>

            <div className="risk-score-display">
              <span className="score-number" style={{ color: getRiskColor(assessment.risk) }}>
                {assessment.score}
              </span>
              <span className="score-denom">/ 100 Risk Index</span>
            </div>

            <div className="risk-bar-track">
              <div
                className="risk-bar-fill"
                style={{
                  width: `${assessment.score}%`,
                  background: getRiskColor(assessment.risk),
                }}
              ></div>
            </div>

            <div className="risk-warning-box">
              <p className="warning-text">{assessment.warning}</p>
            </div>

            <div className="spraying-advice-strip">
              <span className="advice-title">Agronomic Best Practice:</span>
              <span className="advice-body">
                {assessment.score > 70
                  ? "❌ Delay chemical spray until temperature drops below 26°C (typically between 5:30 PM and 7:30 PM)."
                  : assessment.score > 40
                  ? "⚠️ Ensure fine droplet calibration, avoid spraying in direct overhead sunlight, and maintain adequate water volume (500 L/ha)."
                  : "✅ Optimal window. Clear to spray with standard calibration and recommended surfactant."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
