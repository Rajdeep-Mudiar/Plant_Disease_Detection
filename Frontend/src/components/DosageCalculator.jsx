import React, { useState, useEffect } from "react";
import "./DosageCalculator.css";
import {
  IconCalculator,
  IconShield,
  IconCheck,
  IconDocument,
  IconSparkles,
  IconRefresh,
} from "./Icons";

const FORMULATIONS = [
  {
    id: "mancozeb",
    name: "Mancozeb 75% WP",
    category: "Chemical Contact",
    ratePerLiter: 2.5,
    waterPerAcre: 200,
    unit: "grams",
    phiDays: 14,
    defaultPricePerKg: 18.0, // $18 per kg
    notes: "Apply prior to precipitation to establish a protective surface barrier.",
    color: "#eab308", // Golden yellow solution
  },
  {
    id: "ridomil",
    name: "Ridomil Gold (Metalaxyl-M + Mancozeb)",
    category: "Systemic Curative",
    ratePerLiter: 2.5,
    waterPerAcre: 200,
    unit: "grams",
    phiDays: 14,
    defaultPricePerKg: 36.0,
    notes: "Vascular absorption halts established mycelial expansion.",
    color: "#f97316", // Amber solution
  },
  {
    id: "chlorothalonil",
    name: "Chlorothalonil 75% WP",
    category: "Broad Spectrum",
    ratePerLiter: 2.0,
    waterPerAcre: 200,
    unit: "grams",
    phiDays: 7,
    defaultPricePerKg: 22.0,
    notes: "High rain-fastness with multi-site mode of action.",
    color: "#0284c7", // Sky blue solution
  },
  {
    id: "copper",
    name: "Liquid Copper Octanoate",
    category: "Organic Certified",
    ratePerLiter: 1.8,
    waterPerAcre: 180,
    unit: "ml",
    phiDays: 1,
    defaultPricePerKg: 25.0,
    notes: "Broad-spectrum contact protectant against fungal and bacterial spots.",
    color: "#059669", // Turquoise green solution
  },
  {
    id: "neem",
    name: "Cold-Pressed Neem Oil (0.5%)",
    category: "Bio-Botanical",
    ratePerLiter: 5.0,
    waterPerAcre: 150,
    unit: "ml",
    phiDays: 0,
    defaultPricePerKg: 15.0,
    notes: "Biological repellent and fungal spore germination inhibitor.",
    color: "#65a30d", // Olive green solution
  },
];

const NOZZLE_TYPES = [
  {
    id: "hollow_cone",
    name: "Hollow Cone (80°)",
    droplet: "Fine (150–200 µm)",
    use: "Foliar canopy penetration & leaf underside coverage",
    pressure: "3.5 Bar",
  },
  {
    id: "flat_fan",
    name: "Extended Flat Fan (110°)",
    droplet: "Medium (250–350 µm)",
    use: "Uniform broadcast foliar barrier spraying",
    pressure: "2.8 Bar",
  },
  {
    id: "air_induction",
    name: "Air-Induction Anti-Drift",
    droplet: "Coarse (400–500 µm)",
    use: "Windy conditions (>10 km/h) with zero spray drift",
    pressure: "4.0 Bar",
  },
];

const DosageCalculator = () => {
  const [area, setArea] = useState(1.5);
  const [unit, setUnit] = useState("acres");
  const [selectedFormulationId, setSelectedFormulationId] = useState("mancozeb");
  const [tankSize, setTankSize] = useState(16);
  const [selectedNozzleId, setSelectedNozzleId] = useState("hollow_cone");
  const [isAgitating, setIsAgitating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [copiedRecipe, setCopiedRecipe] = useState(false);

  const formulation =
    FORMULATIONS.find((f) => f.id === selectedFormulationId) || FORMULATIONS[0];
  const nozzle =
    NOZZLE_TYPES.find((n) => n.id === selectedNozzleId) || NOZZLE_TYPES[0];

  let acres = parseFloat(area) || 0;
  if (unit === "hectares") acres = acres * 2.471;
  else if (unit === "sqm") acres = acres / 4046.86;

  const totalWaterLiters = Math.round(acres * formulation.waterPerAcre);
  const totalChemicalUnits = Math.round(
    totalWaterLiters * formulation.ratePerLiter
  );
  const totalTanks = Math.ceil(totalWaterLiters / tankSize) || 0;
  const chemicalPerTank = Math.round(tankSize * formulation.ratePerLiter);
  const estimatedCost = Math.round(
    (totalChemicalUnits / 1000) * formulation.defaultPricePerKg
  );
  const estimatedSprayingMinutes = Math.round(totalTanks * 20); // ~20 mins per tank

  const toggleStep = (stepId) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleAgitateMix = () => {
    setIsAgitating(true);
    setTimeout(() => setIsAgitating(false), 2500);
  };

  const handleCopyRecipe = () => {
    const text = `--- AGROPATH FIELD SPRAY RECIPE ---
Target Area: ${area} ${unit}
Compound: ${formulation.name} (${formulation.category})
Total Chemical Mass: ${totalChemicalUnits >= 1000 ? (totalChemicalUnits / 1000).toFixed(2) + " kg" : totalChemicalUnits + " " + formulation.unit}
Total Water Required: ${totalWaterLiters} Liters
Knapsack Tanks: ${totalTanks} loads of ${tankSize}L
Concentration per Tank: ${chemicalPerTank} ${formulation.unit}
Selected Nozzle: ${nozzle.name} (${nozzle.pressure})
Estimated Spray Time: ${estimatedSprayingMinutes} mins
Pre-Harvest Interval (PHI): ${formulation.phiDays} Days
-----------------------------------`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedRecipe(true);
      setTimeout(() => setCopiedRecipe(false), 2500);
    });
  };

  const scheduleStages = [
    {
      id: "step_1",
      day: "Day 1 (Immediate)",
      title: "Knockdown & Initial Canopy Coverage",
      desc: `Prepare ${chemicalPerTank} ${formulation.unit} per ${tankSize}L knapsack. Target lower leaf undersides with ${nozzle.name}.`,
    },
    {
      id: "step_2",
      day: "Day 7 (Protective)",
      title: "Follow-up Systemic Reinforcement",
      desc: "Apply secondary pass if humidity persists >80% or after significant rainfall wash-off.",
    },
    {
      id: "step_3",
      day: "Day 14 (Rotation)",
      title: "Mode of Action Fungicide Rotation",
      desc: "Rotate to alternative FRAC group compound to prevent pathogen chemical resistance.",
    },
  ];

  return (
    <div className="meta-calc-card">
      <div className="calc-card-header">
        <div className="calc-title-row">
          <IconCalculator size={22} className="calc-svg-icon" />
          <div>
            <h3 className="calc-main-title">Farm Dosage & Sprayer Tank Simulator</h3>
            <p className="calc-sub-title">Interactive chemical dilution, knapsack tank mixer visualizer, and application schedule</p>
          </div>
        </div>

        <button
          type="button"
          className="copy-recipe-action-btn"
          onClick={handleCopyRecipe}
        >
          <IconDocument size={14} />
          <span>{copiedRecipe ? "Recipe Copied!" : "Export Spray Recipe"}</span>
        </button>
      </div>

      <div className="calc-columns-grid">
        {/* Left Column: Interactive Parameters */}
        <div className="calc-form-column">
          {/* Field Area Slider */}
          <div className="calc-field-group">
            <div className="field-label-row">
              <label className="field-label">Field Area Size</label>
              <span className="slider-current-val">{area} {unit}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="10"
              step="0.1"
              value={area}
              onChange={(e) => setArea(parseFloat(e.target.value))}
              className="meta-range-slider"
            />
            <div className="field-input-row">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="area-text-field"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="unit-select-field"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="sqm">Sq. Meters</option>
              </select>
            </div>
          </div>

          {/* Treatment Product Selector */}
          <div className="calc-field-group">
            <label className="field-label">Treatment Product</label>
            <div className="formulation-picker-grid">
              {FORMULATIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`formulation-chip-btn ${selectedFormulationId === f.id ? "active" : ""}`}
                  onClick={() => setSelectedFormulationId(f.id)}
                >
                  <span className="formulation-dot" style={{ backgroundColor: f.color }}></span>
                  <div className="formulation-info">
                    <span className="formulation-name">{f.name}</span>
                    <span className="formulation-cat">{f.category}</span>
                  </div>
                  <span className="formulation-rate-tag">
                    {f.ratePerLiter} {f.unit}/L
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Knapsack Sprayer Tank Size */}
          <div className="calc-field-group">
            <label className="field-label">Knapsack Sprayer Tank Size</label>
            <div className="tank-option-pills">
              {[12, 16, 20].map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`tank-pill-btn ${tankSize === size ? "active" : ""}`}
                  onClick={() => setTankSize(size)}
                >
                  {size} Liters
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Knapsack Tank Visualizer */}
          <div className="tank-visualizer-box">
            <div className="tank-visualizer-header">
              <h5 className="visualizer-title">Knapsack Tank Fill Simulation ({tankSize}L)</h5>
              <button
                type="button"
                className={`agitate-mix-btn ${isAgitating ? "agitating" : ""}`}
                onClick={handleAgitateMix}
                title="Simulate spray mixture agitation"
              >
                <IconRefresh size={12} className={isAgitating ? "spin-icon" : ""} />
                <span>{isAgitating ? "Agitating Mix..." : "Agitate & Mix"}</span>
              </button>
            </div>

            <div className="tank-graphic-container">
              <div className="knapsack-tank-body">
                {/* Pressure Gauge Header */}
                <div className="tank-top-manifold">
                  <div className="tank-cap"></div>
                  <div className="tank-gauge-pill">
                    <span className="gauge-dot"></span>
                    <span>{nozzle.pressure} Pressure</span>
                  </div>
                </div>

                {/* Animated Fluid Fill */}
                <div
                  className={`knapsack-fluid-fill ${isAgitating ? "agitating" : ""}`}
                  style={{
                    backgroundColor: formulation.color,
                    opacity: 0.88,
                  }}
                >
                  <div className="knapsack-fluid-wave"></div>
                  {isAgitating && (
                    <div className="mixing-bubbles-layer">
                      <span className="bubble b1"></span>
                      <span className="bubble b2"></span>
                      <span className="bubble b3"></span>
                      <span className="bubble b4"></span>
                    </div>
                  )}
                  <span className="tank-fill-label">
                    {tankSize}L Mix: {chemicalPerTank} {formulation.unit} concentrate
                  </span>
                </div>

                <div className="tank-graduations">
                  <span>{tankSize}L</span>
                  <span>{Math.round(tankSize * 0.75)}L</span>
                  <span>{Math.round(tankSize * 0.5)}L</span>
                  <span>{Math.round(tankSize * 0.25)}L</span>
                  <span>0L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Nozzle Selector */}
          <div className="calc-field-group">
            <label className="field-label">Spray Nozzle Pattern & Calibration</label>
            <div className="nozzle-selection-grid">
              {NOZZLE_TYPES.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`nozzle-choice-btn ${selectedNozzleId === n.id ? "active" : ""}`}
                  onClick={() => setSelectedNozzleId(n.id)}
                >
                  <div className="nozzle-btn-top">
                    <span className="nozzle-name">{n.name}</span>
                    <span className="nozzle-pressure-tag">{n.pressure}</span>
                  </div>
                  <span className="nozzle-droplet">Droplet: {n.droplet}</span>
                  <p className="nozzle-use-desc">{n.use}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Field Action Plan */}
        <div className="calc-results-column">
          <div className="result-highlight-card">
            <span className="res-card-label">Total Compound Required</span>
            <span className="res-card-value">
              {totalChemicalUnits >= 1000
                ? `${(totalChemicalUnits / 1000).toFixed(2)} kg / L`
                : `${totalChemicalUnits} ${formulation.unit}`}
            </span>
            <span className="res-card-sub">
              Application Rate: {formulation.ratePerLiter} {formulation.unit} / L of clean water
            </span>
          </div>

          <div className="result-sub-metrics-grid">
            <div className="sub-metric-card">
              <span className="sub-label">Total Water</span>
              <span className="sub-num">{totalWaterLiters} L</span>
              <span className="sub-caption">For {area} {unit}</span>
            </div>

            <div className="sub-metric-card">
              <span className="sub-label">Knapsack Tanks</span>
              <span className="sub-num">{totalTanks} Loads</span>
              <span className="sub-caption">{chemicalPerTank} {formulation.unit} / tank</span>
            </div>

            <div className="sub-metric-card">
              <span className="sub-label">Est. Spray Time</span>
              <span className="sub-num">
                {estimatedSprayingMinutes > 60
                  ? `${(estimatedSprayingMinutes / 60).toFixed(1)} hrs`
                  : `${estimatedSprayingMinutes} mins`}
              </span>
              <span className="sub-caption">~20m per tank</span>
            </div>

            <div className="sub-metric-card">
              <span className="sub-label">Est. Compound Cost</span>
              <span className="sub-num">${estimatedCost}</span>
              <span className="sub-caption">~${formulation.defaultPricePerKg}/kg</span>
            </div>
          </div>

          <div className="calc-advisory-note">
            <IconShield size={16} className="shield-note-icon" />
            <p><strong>Advisory:</strong> {formulation.notes} (Pre-Harvest Interval: {formulation.phiDays} days)</p>
          </div>

          {/* Interactive Treatment Plan Checklist */}
          <div className="treatment-schedule-section">
            <div className="schedule-header">
              <IconDocument size={16} />
              <h5 className="schedule-title">3-Stage Field Application Protocol</h5>
            </div>

            <div className="schedule-steps-list">
              {scheduleStages.map((stage) => {
                const isDone = completedSteps.includes(stage.id);
                return (
                  <div
                    key={stage.id}
                    className={`schedule-step-card ${isDone ? "completed" : ""}`}
                    onClick={() => toggleStep(stage.id)}
                  >
                    <div className={`step-check-circle ${isDone ? "done" : ""}`}>
                      {isDone && <IconCheck size={12} />}
                    </div>
                    <div className="step-content">
                      <div className="step-top-line">
                        <span className="step-day-pill">{stage.day}</span>
                        <span className="step-title-text">{stage.title}</span>
                      </div>
                      <p className="step-desc-text">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DosageCalculator;
