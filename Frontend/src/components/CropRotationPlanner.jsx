import React, { useState } from "react";
import "./CropRotationPlanner.css";
import { IconPlant, IconCheck, IconLayers, IconActivity } from "./Icons";

const CROPS_DATABASE = {
  potato: {
    name: "Solanum Tuberosum (Potato)",
    icon: "🥔",
    family: "Solanaceae",
    nDemand: "High (-140 kg N/ha)",
    pDemand: "Moderate (-45 kg P/ha)",
    kDemand: "Very High (-180 kg K/ha)",
    rootDepth: "Medium (40–60 cm)",
    nematodeHost: true,
    verticilliumHost: true,
    carbonCredit: 12,
    organicMatterContribution: "+1.2 Tonnes/ha",
  },
  legume: {
    name: "Field Pea / Chickpea (Legume)",
    icon: "🫛",
    family: "Fabaceae",
    nDemand: "Fixes Nitrogen (+45 kg N/ha)",
    pDemand: "Low (-25 kg P/ha)",
    kDemand: "Moderate (-35 kg K/ha)",
    rootDepth: "Deep (70–90 cm)",
    nematodeHost: false,
    verticilliumHost: false,
    carbonCredit: 38,
    organicMatterContribution: "+3.5 Tonnes/ha",
  },
  corn: {
    name: "Zea Mays (Field Corn)",
    icon: "🌽",
    family: "Poaceae",
    nDemand: "Heavy Feeder (-160 kg N/ha)",
    pDemand: "High (-60 kg P/ha)",
    kDemand: "Moderate (-50 kg K/ha)",
    rootDepth: "Very Deep (100–120 cm)",
    nematodeHost: false,
    verticilliumHost: false,
    carbonCredit: 45,
    organicMatterContribution: "+5.8 Tonnes/ha (High Biomass)",
  },
  mustard: {
    name: "Bio-Fumigant Brown Mustard",
    icon: "🌱",
    family: "Brassicaceae",
    nDemand: "Nutrient Catch (+15 kg N captured)",
    pDemand: "Low",
    kDemand: "Low",
    rootDepth: "Deep (80 cm)",
    nematodeHost: false,
    verticilliumHost: false,
    carbonCredit: 28,
    organicMatterContribution: "+4.0 Tonnes/ha (Glucosinolate Biofumigation)",
  },
  tomato: {
    name: "Solanum Lycopersicum (Tomato)",
    icon: "🍅",
    family: "Solanaceae",
    nDemand: "High (-130 kg N/ha)",
    pDemand: "Moderate (-50 kg P/ha)",
    kDemand: "High (-160 kg K/ha)",
    rootDepth: "Medium (50–70 cm)",
    nematodeHost: true,
    verticilliumHost: true,
    carbonCredit: 10,
    organicMatterContribution: "+1.5 Tonnes/ha",
  },
  clover: {
    name: "Red Clover / Vetch Cover Crop",
    icon: "☘️",
    family: "Fabaceae",
    nDemand: "Super Nitrogen Fixer (+75 kg N/ha)",
    pDemand: "Minimal",
    kDemand: "Minimal",
    rootDepth: "Deep (90 cm)",
    nematodeHost: false,
    verticilliumHost: false,
    carbonCredit: 52,
    organicMatterContribution: "+4.8 Tonnes/ha",
  },
};

const SEASONS = [
  { id: "s1", name: "Season 1 (Spring Main Crop)", defaultCrop: "potato" },
  { id: "s2", name: "Season 2 (Monsoon/Summer Rotation)", defaultCrop: "legume" },
  { id: "s3", name: "Season 3 (Autumn Cereal)", defaultCrop: "corn" },
  { id: "s4", name: "Season 4 (Winter Bio-Fumigant Cover)", defaultCrop: "mustard" },
];

export default function CropRotationPlanner() {
  const [rotation, setRotation] = useState({
    s1: "potato",
    s2: "legume",
    s3: "corn",
    s4: "mustard",
  });

  const handleCropChange = (seasonId, cropKey) => {
    setRotation((prev) => ({
      ...prev,
      [seasonId]: cropKey,
    }));
  };

  // Calculate Agronomic Metrics
  const cropList = Object.values(rotation).map((k) => CROPS_DATABASE[k]);

  // Check solanaceae repetition
  const solanaceaeCount = cropList.filter((c) => c.family === "Solanaceae").length;
  const legumeCount = cropList.filter((c) => c.family === "Fabaceae").length;
  const brassicaCount = cropList.filter((c) => c.family === "Brassicaceae").length;

  // Nitrogen Balance
  let netNitrogen = 0;
  if (rotation.s1 === "potato" || rotation.s1 === "tomato") netNitrogen -= 135;
  if (rotation.s2 === "legume") netNitrogen += 45;
  if (rotation.s2 === "clover") netNitrogen += 75;
  if (rotation.s3 === "corn") netNitrogen -= 160;
  if (rotation.s4 === "mustard") netNitrogen += 15;
  if (rotation.s4 === "clover") netNitrogen += 75;

  // Soil-borne Pathogen Break Index
  const pathogenBreakScore = solanaceaeCount === 1 && brassicaCount >= 1 ? 95 : solanaceaeCount === 1 ? 82 : solanaceaeCount === 2 ? 45 : 20;

  // Carbon Credits Earned
  const totalCarbonCredits = cropList.reduce((acc, c) => acc + c.carbonCredit, 0);
  const carbonRevenueEstimate = (totalCarbonCredits * 18.5).toFixed(0); // $18.5/tonne CO2e

  return (
    <div className="crop-rotation-card">
      <div className="rotation-header">
        <div className="rotation-title-group">
          <div className="rotation-icon-frame">
            <IconLayers size={22} />
          </div>
          <div>
            <div className="rotation-badge-row">
              <span className="rotation-badge">SOIL REGENERATION ENGINE</span>
              <span className="rotation-sub-badge">4-Season Multi-Crop Cycle</span>
            </div>
            <h3 className="rotation-main-title">Crop Rotation & Soil Carbon Sequestration Planner</h3>
            <p className="rotation-sub-title">
              Sequence your 4-season crop rotation to starve soil pathogens (*Verticillium, Cyst Nematodes*), replenish natural Nitrogen, and earn carbon credit revenue.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Season Interactive Selector Cards */}
      <div className="seasons-carousel-grid">
        {SEASONS.map((season, idx) => {
          const selectedCropKey = rotation[season.id];
          const selectedCrop = CROPS_DATABASE[selectedCropKey];

          return (
            <div key={season.id} className="season-slot-card">
              <div className="season-slot-header">
                <span className="slot-step">CYCLE {idx + 1}/4</span>
                <span className="slot-name">{season.name}</span>
              </div>

              <div className="crop-selector-dropdown-box">
                <select
                  value={selectedCropKey}
                  onChange={(e) => handleCropChange(season.id, e.target.value)}
                  className="crop-select-native"
                >
                  {Object.entries(CROPS_DATABASE).map(([key, data]) => (
                    <option key={key} value={key}>
                      {data.icon} {data.name.split(" ")[0]} ({data.family})
                    </option>
                  ))}
                </select>
              </div>

              <div className="slot-crop-preview">
                <span className="crop-huge-icon">{selectedCrop.icon}</span>
                <span className="crop-preview-name">{selectedCrop.name.split("(")[0]}</span>
                <span className="crop-family-tag">Family: {selectedCrop.family}</span>
              </div>

              <div className="slot-agronomic-specs">
                <div className="spec-row">
                  <span className="s-label">N-Impact:</span>
                  <span className={`s-val ${selectedCrop.nDemand.includes("+") ? "green" : "orange"}`}>
                    {selectedCrop.nDemand}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="s-label">Root Depth:</span>
                  <span className="s-val">{selectedCrop.rootDepth}</span>
                </div>
                <div className="spec-row">
                  <span className="s-label">Bio-Fumigation:</span>
                  <span className={`s-val ${selectedCrop.family === "Brassicaceae" ? "green" : "neutral"}`}>
                    {selectedCrop.family === "Brassicaceae" ? "Active Bio-Fumigant" : "Standard"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rotation Evaluation & Soil Health KPI Dashboard */}
      <div className="rotation-analytics-dashboard">
        <div className="analytic-card">
          <span className="an-label">Pathogen Break Period</span>
          <div className="an-metric-row">
            <span className={`an-val ${pathogenBreakScore >= 80 ? "green" : pathogenBreakScore >= 50 ? "yellow" : "red"}`}>
              {pathogenBreakScore}% Break Score
            </span>
          </div>
          <p className="an-desc">
            {pathogenBreakScore >= 80
              ? "✅ Excellent 3-year gap between Solanaceae crops. Starves soil-borne Verticillium & Nematodes."
              : "⚠️ High risk of soil-borne pathogen accumulation. Avoid planting potatoes/tomatoes back-to-back."}
          </p>
        </div>

        <div className="analytic-card">
          <span className="an-label">Biological Nitrogen Fixation</span>
          <div className="an-metric-row">
            <span className={`an-val ${netNitrogen >= -100 ? "green" : "orange"}`}>
              {netNitrogen > 0 ? `+${netNitrogen}` : netNitrogen} kg N/ha Net
            </span>
          </div>
          <p className="an-desc">
            {legumeCount >= 1
              ? `🫛 Legume nodulation contributes bio-available Nitrogen, reducing synthetic urea fertilizer costs by $120/ha.`
              : `⚠️ Heavy nitrogen depletion. Introduce legume or clover cover to replenish soil.`}
          </p>
        </div>

        <div className="analytic-card highlight">
          <span className="an-label">Carbon Credit ROI Potential</span>
          <div className="an-metric-row">
            <span className="an-val green">${carbonRevenueEstimate} / ha / year</span>
          </div>
          <p className="an-desc">
            🌱 Certified soil organic carbon sequestration yield based on cover crops & reduced tillage biomass.
          </p>
        </div>
      </div>
    </div>
  );
}
