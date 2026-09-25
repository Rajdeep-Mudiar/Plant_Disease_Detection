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

          {/* Interactive Realistic Knapsack Tank Visualizer */}
          <div className="tank-visualizer-box">
            <div className="tank-visualizer-header">
              <div className="visualizer-header-title-wrap">
                <span className="visualizer-live-badge">LIVE SIMULATION</span>
                <h5 className="visualizer-title">Knapsack Sprayer Tank ({tankSize}L)</h5>
              </div>
              <button
                type="button"
                className={`agitate-mix-btn ${isAgitating ? "agitating" : ""}`}
                onClick={handleAgitateMix}
                title="Simulate mechanical agitation & tank pressure priming"
              >
                <IconRefresh size={13} className={isAgitating ? "spin-icon" : ""} />
                <span>{isAgitating ? "Agitating & Priming..." : "Agitate & Mix"}</span>
              </button>
            </div>

            <div className="realistic-sprayer-viewport">
              <svg
                viewBox="0 0 380 270"
                className={`realistic-knapsack-svg ${isAgitating ? "tank-sloshing" : ""}`}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* HDPE Translucent Shell Shading */}
                  <linearGradient id="tankShellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.8" />
                    <stop offset="8%" stopColor="#f8fafc" stopOpacity="0.95" />
                    <stop offset="25%" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="75%" stopColor="#f1f5f9" stopOpacity="0.75" />
                    <stop offset="92%" stopColor="#e2e8f0" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Dark Mode HDPE Shell Shading */}
                  <linearGradient id="tankShellGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
                    <stop offset="12%" stopColor="#334155" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#1e293b" stopOpacity="0.65" />
                    <stop offset="88%" stopColor="#334155" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Dynamic Fluid Gradient */}
                  <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={formulation.color} stopOpacity="0.85" />
                    <stop offset="35%" stopColor={formulation.color} stopOpacity="0.92" />
                    <stop offset="100%" stopColor={formulation.color} stopOpacity="1" />
                  </linearGradient>

                  {/* Deep Fluid Shadow */}
                  <linearGradient id="liquidDepthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
                    <stop offset="15%" stopColor="#000000" stopOpacity="0.0" />
                    <stop offset="85%" stopColor="#000000" stopOpacity="0.0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                  </linearGradient>

                  {/* Glass / Plastic Specular Sheen */}
                  <linearGradient id="sheenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="20%" stopColor="#ffffff" stopOpacity="0.15" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
                    <stop offset="80%" stopColor="#ffffff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
                  </linearGradient>

                  {/* Cap & Hardware Metallic Gradient */}
                  <linearGradient id="hardwareGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="30%" stopColor="#64748b" />
                    <stop offset="70%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>

                  {/* Brass Connector Gradient */}
                  <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#92400e" />
                  </linearGradient>

                  {/* Gauge Bezel Gradient */}
                  <linearGradient id="gaugeBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>

                  {/* Tank Inner Fluid Clip Path */}
                  <clipPath id="tankLiquidCavity">
                    <path d="M 112 78 C 112 70 120 64 130 64 L 230 64 C 240 64 248 70 248 78 L 250 216 C 250 226 242 234 232 234 L 128 234 C 118 234 110 226 110 216 Z" />
                  </clipPath>

                  {/* Filter for Drop Shadows */}
                  <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.18" />
                  </filter>
                </defs>

                {/* --- BACKPACK TANK BASE STAND & SHADOW --- */}
                <ellipse cx="180" cy="252" rx="85" ry="8" fill="rgba(15, 23, 42, 0.12)" className="tank-ground-shadow" />

                {/* --- SIDE PUMP LEVER ASSEMBLY (Pistons + Handle) --- */}
                <g className={`pump-lever-group ${isAgitating ? "pump-pumping" : ""}`}>
                  {/* Lever Pivot Knuckle */}
                  <circle cx="82" cy="192" r="8" fill="url(#hardwareGrad)" stroke="#1e293b" strokeWidth="1.5" />
                  <circle cx="82" cy="192" r="3.5" fill="#94a3b8" />

                  {/* Metal Lever Bar */}
                  <path
                    d="M 82 192 L 64 125 L 48 115"
                    fill="none"
                    stroke="url(#hardwareGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 82 192 L 64 125 L 48 115"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="2 10"
                  />

                  {/* Textured Grip Handle */}
                  <rect
                    x="30"
                    y="104"
                    width="26"
                    height="18"
                    rx="6"
                    fill="#1e293b"
                    stroke="#0f172a"
                    strokeWidth="1.5"
                  />
                  <line x1="36" y1="107" x2="36" y2="119" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="42" y1="107" x2="42" y2="119" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="48" y1="107" x2="48" y2="119" stroke="#64748b" strokeWidth="1.5" />
                </g>

                {/* --- MAIN TANK CONTAINER BODY --- */}
                {/* Rear Dark Inner Shadow */}
                <path
                  d="M 110 74 C 110 58 122 52 136 52 L 224 52 C 238 52 250 58 250 74 L 254 220 C 254 236 242 244 228 244 L 132 244 C 118 244 106 236 106 220 Z"
                  fill="#0f172a"
                  fillOpacity="0.08"
                />

                {/* Main Molded Backpack HDPE Tank Outer Shell */}
                <path
                  d="M 108 72 C 108 55 120 48 138 48 L 222 48 C 240 48 252 55 252 72 L 256 220 C 256 238 242 246 226 246 L 134 246 C 118 246 104 238 104 220 Z"
                  className="tank-hdpe-shell"
                  fill="url(#tankShellGrad)"
                  stroke="#64748b"
                  strokeWidth="2"
                  filter="url(#softShadow)"
                />

                {/* Molded Stiffening Ribs on Tank Surface */}
                <path
                  d="M 112 110 Q 180 116 248 110"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.25)"
                  strokeWidth="2"
                />
                <path
                  d="M 112 165 Q 180 171 248 165"
                  fill="none"
                  stroke="rgba(100, 116, 139, 0.25)"
                  strokeWidth="2"
                />

                {/* --- INNER CHEMICAL FLUID (CLIPPED) --- */}
                <g clipPath="url(#tankLiquidCavity)">
                  {/* Fluid Base Fill */}
                  <rect
                    x="100"
                    y="76"
                    width="160"
                    height="165"
                    fill="url(#liquidGrad)"
                  />

                  {/* Dynamic Dark Depth Shading */}
                  <rect
                    x="100"
                    y="76"
                    width="160"
                    height="165"
                    fill="url(#liquidDepthGrad)"
                  />

                  {/* Animated Wave Surface Layer 1 */}
                  <g className="wave-anim-group wave-layer-1">
                    <path
                      d="M 80 82 Q 115 76, 150 82 T 220 82 T 290 82 L 290 98 L 80 98 Z"
                      fill="rgba(255, 255, 255, 0.3)"
                    />
                  </g>

                  {/* Animated Wave Surface Layer 2 */}
                  <g className="wave-anim-group wave-layer-2">
                    <path
                      d="M 70 80 Q 105 85, 140 80 T 210 80 T 280 80 L 280 95 L 70 95 Z"
                      fill={formulation.color}
                      opacity="0.95"
                    />
                  </g>

                  {/* Surface Foam / Agitation Froth Layer */}
                  <ellipse
                    cx="180"
                    cy="80"
                    rx="62"
                    ry="4.5"
                    fill="rgba(255, 255, 255, 0.45)"
                    className={isAgitating ? "foam-active" : "foam-resting"}
                  />

                  {/* Agitation Bubbles & Micro-Turbulence */}
                  {isAgitating && (
                    <g className="active-agitation-particles">
                      <circle cx="140" cy="180" r="4.5" className="svg-bubble b-1" />
                      <circle cx="165" cy="200" r="6" className="svg-bubble b-2" />
                      <circle cx="195" cy="175" r="3.5" className="svg-bubble b-3" />
                      <circle cx="215" cy="195" r="5" className="svg-bubble b-4" />
                      <circle cx="150" cy="130" r="4" className="svg-bubble b-5" />
                      <circle cx="180" cy="140" r="5.5" className="svg-bubble b-6" />
                      <circle cx="210" cy="120" r="3" className="svg-bubble b-7" />

                      {/* Swirling Vortex Lines */}
                      <path
                        d="M 155 170 C 170 190 200 170 185 140 C 175 120 150 140 165 160"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.5)"
                        strokeWidth="1.8"
                        strokeDasharray="6 4"
                        className="swirl-path"
                      />
                    </g>
                  )}

                  {/* Internal Submerged Suction Filter Tube */}
                  <line x1="228" y1="70" x2="228" y2="225" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="4" />
                  <line x1="228" y1="70" x2="228" y2="225" stroke="rgba(15, 23, 42, 0.25)" strokeWidth="1" />
                  <rect x="222" y="215" width="12" height="12" rx="2" fill="#475569" opacity="0.8" />
                </g>

                {/* --- TRANSLUCENT FRONT SHEEN & HIGHLIGHT --- */}
                <path
                  d="M 114 74 L 114 218 C 114 228 120 234 130 234 L 145 234 L 145 74 Z"
                  fill="url(#sheenGrad)"
                  opacity="0.6"
                  pointerEvents="none"
                />

                {/* --- EMBOSSED METRIC GRADUATION SCALE ON TANK WALL --- */}
                <g className="tank-metric-scale" pointerEvents="none">
                  {/* Vertical Ruler Baseline */}
                  <line x1="236" y1="84" x2="236" y2="224" stroke="rgba(15, 23, 42, 0.45)" strokeWidth="1.5" />

                  {/* 100% Mark (Tank Max) */}
                  <line x1="226" y1="88" x2="236" y2="88" stroke="#0f172a" strokeWidth="2" />
                  <text x="222" y="91" textAnchor="end" className="graduation-label-main">{tankSize}L</text>

                  {/* 75% Mark */}
                  <line x1="228" y1="122" x2="236" y2="122" stroke="#0f172a" strokeWidth="1.8" />
                  <text x="224" y="125" textAnchor="end" className="graduation-label">{Math.round(tankSize * 0.75)}L</text>

                  {/* Sub ticks */}
                  <line x1="232" y1="105" x2="236" y2="105" stroke="rgba(15, 23, 42, 0.4)" strokeWidth="1" />
                  <line x1="232" y1="139" x2="236" y2="139" stroke="rgba(15, 23, 42, 0.4)" strokeWidth="1" />

                  {/* 50% Mark */}
                  <line x1="228" y1="156" x2="236" y2="156" stroke="#0f172a" strokeWidth="1.8" />
                  <text x="224" y="159" textAnchor="end" className="graduation-label">{Math.round(tankSize * 0.5)}L</text>

                  {/* Sub ticks */}
                  <line x1="232" y1="173" x2="236" y2="173" stroke="rgba(15, 23, 42, 0.4)" strokeWidth="1" />

                  {/* 25% Mark */}
                  <line x1="228" y1="190" x2="236" y2="190" stroke="#0f172a" strokeWidth="1.8" />
                  <text x="224" y="193" textAnchor="end" className="graduation-label">{Math.round(tankSize * 0.25)}L</text>

                  {/* Sub ticks */}
                  <line x1="232" y1="207" x2="236" y2="207" stroke="rgba(15, 23, 42, 0.4)" strokeWidth="1" />

                  {/* 0L Base Mark */}
                  <line x1="226" y1="224" x2="236" y2="224" stroke="#0f172a" strokeWidth="2" />
                  <text x="222" y="227" textAnchor="end" className="graduation-label-main">0L</text>
                </g>

                {/* --- TOP HARDWARE: FILLER NECK, THREADED CAP & CARRY HANDLE --- */}
                {/* Backpack Top Carry Handle Arch */}
                <path
                  d="M 148 48 C 148 24, 212 24, 212 48"
                  fill="none"
                  stroke="url(#hardwareGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 152 48 C 152 30, 208 30, 208 48"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Filler Neck Rim */}
                <rect x="160" y="38" width="40" height="12" rx="2" fill="url(#hardwareGrad)" stroke="#1e293b" strokeWidth="1.5" />

                {/* Threaded Screw Cap */}
                <rect x="156" y="28" width="48" height="12" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                {/* Cap Grip Ribs */}
                <line x1="164" y1="30" x2="164" y2="38" stroke="#94a3b8" strokeWidth="2" />
                <line x1="172" y1="30" x2="172" y2="38" stroke="#94a3b8" strokeWidth="2" />
                <line x1="180" y1="30" x2="180" y2="38" stroke="#ef4444" strokeWidth="3" title="Pressure vent valve" />
                <line x1="188" y1="30" x2="188" y2="38" stroke="#94a3b8" strokeWidth="2" />
                <line x1="196" y1="30" x2="196" y2="38" stroke="#94a3b8" strokeWidth="2" />

                {/* Backpack Harness Anchors (Left/Right) */}
                <rect x="94" y="90" width="8" height="16" rx="2" fill="#334155" />
                <rect x="258" y="90" width="8" height="16" rx="2" fill="#334155" />

                {/* --- BOTTOM OUTLET, HOSE & SPRAY LANCE --- */}
                {/* Brass Outlet Fitting */}
                <rect x="246" y="218" width="14" height="10" rx="2" fill="url(#brassGrad)" stroke="#78350f" strokeWidth="1" />
                <circle cx="258" cy="223" r="3" fill="#451a03" />

                {/* Reinforced Black High-Pressure Hose */}
                <path
                  d="M 258 224 C 275 228, 305 240, 318 200 C 324 180, 332 150, 336 120"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 258 224 C 275 228, 305 240, 318 200 C 324 180, 332 150, 336 120"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4 8"
                  strokeLinecap="round"
                />

                {/* Spray Lance Trigger & Brass Wand */}
                <g transform="translate(336, 120) rotate(-15)">
                  {/* Trigger Handle */}
                  <rect x="-4" y="-2" width="8" height="24" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                  <path d="M 4 4 Q 10 10 4 16" fill="none" stroke="#e2e8f0" strokeWidth="2" />

                  {/* Brass Lance Tube */}
                  <line x1="0" y1="-2" x2="0" y2="-45" stroke="url(#brassGrad)" strokeWidth="3" />

                  {/* Nozzle Tip */}
                  <polygon points="-4,-45 4,-45 2,-52 -2,-52" fill="url(#brassGrad)" stroke="#78350f" strokeWidth="0.8" />

                  {/* Fine Spray Cone Mist (Active when agitating) */}
                  {isAgitating && (
                    <g className="spray-mist-cone">
                      <polygon
                        points="0,-52 -28,-90 28,-90"
                        fill="rgba(56, 189, 248, 0.22)"
                      />
                      <circle cx="-12" cy="-75" r="1.5" fill="#38bdf8" opacity="0.8" />
                      <circle cx="0" cy="-82" r="1.8" fill="#38bdf8" opacity="0.9" />
                      <circle cx="14" cy="-72" r="1.2" fill="#38bdf8" opacity="0.7" />
                      <circle cx="-20" cy="-88" r="1" fill="#38bdf8" opacity="0.6" />
                      <circle cx="22" cy="-86" r="1" fill="#38bdf8" opacity="0.6" />
                    </g>
                  )}
                </g>

                {/* --- PRECISION ANALOG MANOMETER PRESSURE GAUGE --- */}
                {(() => {
                  const currentBar = parseFloat(nozzle.pressure) || 3.0;
                  // Map 0 to 6 bar to -125deg -> +125deg
                  const needleAngle = -125 + (currentBar / 6.0) * 250;

                  return (
                    <g className="analog-manometer" transform="translate(295, 48)">
                      {/* Brass Mounting Stem */}
                      <rect x="-3" y="18" width="6" height="14" fill="url(#brassGrad)" stroke="#78350f" strokeWidth="0.8" />

                      {/* Outer Steel Bezel with Shadow */}
                      <circle cx="0" cy="0" r="26" fill="url(#gaugeBezelGrad)" stroke="#334155" strokeWidth="1.5" />
                      {/* Inner Dial Face */}
                      <circle cx="0" cy="0" r="22" fill="#ffffff" className="gauge-dial-face" stroke="#cbd5e1" strokeWidth="1" />

                      {/* Pressure Range Color Arcs */}
                      {/* Yellow Low Range (0 - 2 bar) */}
                      <path
                        d="M -16 11 A 20 20 0 0 1 -17 -10"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="2.5"
                      />
                      {/* Green Optimal Operating Range (2 - 4 bar) */}
                      <path
                        d="M -17 -10 A 20 20 0 0 1 14 -14"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3.5"
                      />
                      {/* Red High/Overpressure Range (4 - 6 bar) */}
                      <path
                        d="M 14 -14 A 20 20 0 0 1 16 11"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                      />

                      {/* Dial Metric Labels */}
                      <text x="0" y="-8" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#0f172a" className="gauge-brand-text">BAR</text>
                      <text x="-12" y="14" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#64748b">0</text>
                      <text x="-14" y="-3" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#64748b">2</text>
                      <text x="0" y="-13" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#22c55e">3.5</text>
                      <text x="14" y="-3" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#64748b">4</text>
                      <text x="12" y="14" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#ef4444">6</text>

                      {/* Precision Calibrated Needle */}
                      <g
                        transform={`rotate(${needleAngle})`}
                        className={`gauge-needle-arm ${isAgitating ? "needle-pulse" : ""}`}
                        style={{ transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                      >
                        <polygon points="-1.5,4 1.5,4 0.5,-18 -0.5,-18" fill="#ef4444" />
                        <line x1="0" y1="4" x2="0" y2="-18" stroke="#b91c1c" strokeWidth="0.5" />
                      </g>
                      {/* Center Needle Pin Cap */}
                      <circle cx="0" cy="0" r="3" fill="#0f172a" />
                      <circle cx="0" cy="0" r="1.2" fill="#ef4444" />

                      {/* Glass Lens Reflection */}
                      <path
                        d="M -18 -10 A 21 21 0 0 1 15 -14 A 20 20 0 0 0 -18 -10 Z"
                        fill="#ffffff"
                        opacity="0.45"
                      />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Sprayer Mixture & Operational Telemetry HUD */}
            <div className="tank-mixture-hud">
              <div className="hud-primary-cell">
                <span className="hud-label">ACTIVE CHEMICAL DILUTION</span>
                <div className="hud-value-row">
                  <span className="hud-color-pill" style={{ backgroundColor: formulation.color }}></span>
                  <span className="hud-compound-name">{formulation.name}</span>
                </div>
                <span className="hud-sub-desc">
                  Rate: <strong>{formulation.ratePerLiter} {formulation.unit}/L</strong> of clean water
                </span>
              </div>

              <div className="hud-stat-cell">
                <span className="hud-stat-title">Tank Mix Charge</span>
                <span className="hud-stat-big">
                  {chemicalPerTank} <small>{formulation.unit}</small>
                </span>
                <span className="hud-stat-caption">in {tankSize}L clean water</span>
              </div>

              <div className="hud-stat-cell">
                <span className="hud-stat-title">Operating Pressure</span>
                <span className="hud-stat-big hud-pressure-val">
                  <span className="hud-status-dot"></span>
                  {nozzle.pressure}
                </span>
                <span className="hud-stat-caption">{nozzle.name.split(" ")[0]} Calibrated</span>
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
