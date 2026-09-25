import React, { useState } from "react";
import "./DiseaseProgressionTimeLapse.css";
import { IconClock, IconActivity, IconShield, IconTrendingUp } from "./Icons";

const DISEASES = [
  {
    id: "early_blight",
    name: "Early Blight (Alternaria solani)",
    crop: "Potato & Tomato",
    icon: "🥔",
    incubationPeriod: "3–5 Days",
    idealConditions: "Warm (24–29°C) + High Humidity / Rain",
    stages: [
      {
        day: 1,
        title: "Day 1–2: Spore Germination & Stomatal Penetration",
        desc: "Microscopic conidia spores land on foliage in free moisture, germinating germ tubes that penetrate through leaf stomata or micro-wounds.",
        leafHealth: 98,
        lesionSize: 1,
        lesionColor: "rgba(180, 83, 9, 0.4)",
        haloRadius: 0,
        symptoms: ["Invisible to naked eye", "Microscopic germ tube penetration", "Early cellular electrolyte leakage"],
        treatmentRescueRate: 99,
        recommendedSpray: "Protective Contact Fungicide (Chlorothalonil 75 WP or Mancozeb)",
      },
      {
        day: 4,
        title: "Day 3–5: Concentric Ring 'Target-Board' Lesion Formation",
        desc: "Dark brown to black angular spots emerge on lower mature leaves, forming distinct concentric rings (target-board appearance) surrounded by a chlorotic yellow halo.",
        leafHealth: 82,
        lesionSize: 8,
        lesionColor: "#78350f",
        haloRadius: 18,
        symptoms: ["Concentric ring circular spots (3–5mm)", "Chlorotic yellow leaf halo", "Photosynthesis inhibited by 28%"],
        treatmentRescueRate: 92,
        recommendedSpray: "Systemic Translaminar (Azoxystrobin 23 SC or Difenoconazole)",
      },
      {
        day: 8,
        title: "Day 6–9: Coalescence & Extensive Chlorosis",
        desc: "Multiple lesions expand and merge across leaf veins. Toxins (alternariol) diffuse through vascular bundles, causing whole leaflets to turn yellow and curl inward.",
        leafHealth: 54,
        lesionSize: 22,
        lesionColor: "#451a03",
        haloRadius: 36,
        symptoms: ["Lesions merge across major veins", "Leaf margins curl and crisp", "Yield loss potential reaching 35%"],
        treatmentRescueRate: 65,
        recommendedSpray: "Dual Action Curative (Pyraclostrobin + Boscalid 38 WG)",
      },
      {
        day: 14,
        title: "Day 10–14: Complete Necrotic Leaf Collapse & Stem Cankers",
        desc: "Total defoliation of lower canopy. Pathogen sporulates massively in humid night air, producing millions of airborne conidia that spread to adjacent healthy fields.",
        leafHealth: 15,
        lesionSize: 45,
        lesionColor: "#1c1917",
        haloRadius: 60,
        symptoms: ["Severe leaf necrosis & premature leaf drop", "Sunscald on exposed tubers/fruit", "Airborne spore dispersal index at peak"],
        treatmentRescueRate: 20,
        recommendedSpray: "Eradicant rescue + immediate harvest desiccation",
      },
    ],
  },
  {
    id: "late_blight",
    name: "Late Blight (Phytophthora infestans)",
    crop: "Potato & Tomato",
    icon: "🍅",
    incubationPeriod: "2–4 Days (Extremely Aggressive)",
    idealConditions: "Cool (15–20°C) + Continuous Free Moisture (>90% RH)",
    stages: [
      {
        day: 1,
        title: "Day 1–2: Zoospore Motility & Water-Soaked Spots",
        desc: "Flagellated motile zoospores swim in dew films, encyst, and produce appressoria that dissolve the leaf cuticle within 6 hours.",
        leafHealth: 99,
        lesionSize: 2,
        lesionColor: "rgba(101, 163, 13, 0.5)",
        haloRadius: 0,
        symptoms: ["Water-soaked translucent pinhead spots", "Rapid zoospore multiplication", "Zero visible leaf deformation yet"],
        treatmentRescueRate: 100,
        recommendedSpray: "Preventative Anti-Oomycete (Cyazofamid or Fluopicolide)",
      },
      {
        day: 4,
        title: "Day 3–5: Expanding Water-Soaked Blotch with White Downy Mildew",
        desc: "Pale green to olive-brown irregular lesions expand rapidly. Under high humidity, delicate white downy fungal mildew appears on the leaf underside.",
        leafHealth: 74,
        lesionSize: 14,
        lesionColor: "#365314",
        haloRadius: 24,
        symptoms: ["Rapidly expanding water-soaked blotches", "White sporulation on leaf underside", "Foul characteristic decomposing odor"],
        treatmentRescueRate: 85,
        recommendedSpray: "Systemic Oomycete Curative (Metalaxyl-M + Mancozeb 68 WG)",
      },
      {
        day: 8,
        title: "Day 6–9: Rapid Blight Collapse & Stem Blackening",
        desc: "Entire leaves and petioles collapse into greasy, wet black rot within 48 hours. Spores wash down into soil via rainwater, infecting young potato tubers.",
        leafHealth: 38,
        lesionSize: 34,
        lesionColor: "#14532d",
        haloRadius: 48,
        symptoms: ["Total petiole & stem girdle collapse", "Brown tuber dry rot underneath soil", "Epidemic field transmission rate"],
        treatmentRescueRate: 42,
        recommendedSpray: "Multi-site Systemic Curative (Mandipropamid + Cymoxanil)",
      },
      {
        day: 14,
        title: "Day 10–14: Complete Field Decimation & Tuber Rot",
        desc: "Entire plant canopy destroyed, resembling frosted or scorched fields. Severe rotting tuber smell and total commercial harvest loss.",
        leafHealth: 5,
        lesionSize: 55,
        lesionColor: "#052e16",
        haloRadius: 70,
        symptoms: ["100% canopy destruction", "Secondary soft rot bacterial invasion", "Catastrophic crop loss (up to 100%)"],
        treatmentRescueRate: 8,
        recommendedSpray: "Emergency harvest rescue & deep burial of diseased haulm",
      },
    ],
  },
];

export default function DiseaseProgressionTimeLapse() {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState("early_blight");
  const [currentDay, setCurrentDay] = useState(4);
  const [interventionDay, setInterventionDay] = useState(null); // null, 1, 4, 8

  const disease = DISEASES.find((d) => d.id === selectedDiseaseId) || DISEASES[0];

  // Interpolate stage data based on currentDay (1 to 14)
  const getInterpolatedStage = () => {
    if (currentDay <= 2) return disease.stages[0];
    if (currentDay <= 6) return disease.stages[1];
    if (currentDay <= 10) return disease.stages[2];
    return disease.stages[3];
  };

  const stage = getInterpolatedStage();

  // Calculate rescue rate with or without intervention
  const getActiveRescueRate = () => {
    if (interventionDay === null) {
      return stage.treatmentRescueRate;
    }
    if (interventionDay === 1) return 98;
    if (interventionDay === 4) return 88;
    if (interventionDay === 8) return 55;
    return 15;
  };

  // Dynamic SVG leaf representation parameters
  const lesionRadius = 12 + (currentDay / 14) * 58;
  const haloRadius = lesionRadius + 14 + (currentDay / 14) * 20;

  return (
    <div className="disease-timelapse-card">
      {/* Header */}
      <div className="timelapse-header">
        <div className="timelapse-title-group">
          <div className="timelapse-icon-badge">
            <IconClock size={22} />
          </div>
          <div>
            <div className="timelapse-badge-row">
              <span className="timelapse-badge">PATHOLOGY SIMULATOR</span>
              <span className="timelapse-sub-badge">Day 1 to 14 Time-Lapse</span>
            </div>
            <h3 className="timelapse-main-title">Interactive Disease Progression Time-Lapse</h3>
            <p className="timelapse-desc">
              Scrub the timeline to see how fungal spores germinate, form target lesions, and cause tissue collapse. Test how early treatment rescues yields.
            </p>
          </div>
        </div>

        {/* Disease Switcher */}
        <div className="disease-selector-pills">
          {DISEASES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`disease-pill-btn ${selectedDiseaseId === d.id ? "active" : ""}`}
              onClick={() => {
                setSelectedDiseaseId(d.id);
                setInterventionDay(null);
              }}
            >
              <span>{d.icon}</span>
              <span>{d.name.split(" ")[0]} {d.name.split(" ")[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Scrubber Slider */}
      <div className="timelapse-scrubber-box">
        <div className="scrubber-header-row">
          <div className="scrubber-day-label">
            <span className="day-number">DAY {currentDay}</span>
            <span className="day-phase">{stage.title.split(":")[0]}</span>
          </div>
          <div className="scrubber-controls-help">
            <span>Drag slider to scrub through 14-day infection cycle</span>
          </div>
        </div>

        <div className="slider-wrapper">
          <input
            type="range"
            min="1"
            max="14"
            step="1"
            value={currentDay}
            onChange={(e) => setCurrentDay(Number(e.target.value))}
            className="timeline-range-input"
          />
          <div className="timeline-ticks-row">
            {[1, 2, 4, 6, 8, 10, 12, 14].map((d) => (
              <span
                key={d}
                className={`tick-mark ${currentDay === d ? "active" : ""}`}
                onClick={() => setCurrentDay(d)}
              >
                D{d}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Visual Canvas & Diagnostic Metrics */}
      <div className="timelapse-body-grid">
        {/* Left: Leaf Anatomical SVG Simulation */}
        <div className="leaf-canvas-container">
          <div className="leaf-canvas-header">
            <span className="canvas-label">🔬 VIRTUAL LEAF SCAN • DAY {currentDay}</span>
            <span className={`leaf-health-pill ${stage.leafHealth > 75 ? "optimal" : stage.leafHealth > 40 ? "warning" : "critical"}`}>
              {stage.leafHealth}% Canopy Health
            </span>
          </div>

          <div className="leaf-svg-wrapper">
            <svg viewBox="0 0 320 320" className="leaf-morph-svg">
              <defs>
                {/* Healthy Leaf Texture */}
                <linearGradient id="healthyLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="60%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>

                {/* Chlorotic Yellow Halo */}
                <radialGradient id="chlorosisHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#eab308" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#facc15" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </radialGradient>

                {/* Necrotic Core Lesion */}
                <radialGradient id="necroticCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={selectedDiseaseId === "early_blight" ? "#291305" : "#022c22"} />
                  <stop offset="40%" stopColor={selectedDiseaseId === "early_blight" ? "#78350f" : "#14532d"} />
                  <stop offset="80%" stopColor={selectedDiseaseId === "early_blight" ? "#b45309" : "#166534"} />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Leaf Blade Shape */}
              <path
                d="M 160 25 C 260 80, 290 190, 160 295 C 30 190, 60 80, 160 25 Z"
                fill="url(#healthyLeafGrad)"
                stroke="#166534"
                strokeWidth="3"
              />

              {/* Main Vein Structure */}
              <path d="M 160 28 L 160 295" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
              <path d="M 160 80 Q 210 100, 240 125" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <path d="M 160 80 Q 110 100, 80 125" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <path d="M 160 140 Q 220 170, 255 195" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <path d="M 160 140 Q 100 170, 65 195" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <path d="M 160 200 Q 210 230, 230 250" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
              <path d="M 160 200 Q 110 230, 90 250" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />

              {/* Chlorotic Halo Expansion */}
              {currentDay > 2 && (
                <circle cx="160" cy="155" r={haloRadius} fill="url(#chlorosisHalo)" className="halo-pulse" />
              )}

              {/* Concentric Target Board Rings for Early Blight */}
              {selectedDiseaseId === "early_blight" && currentDay >= 3 && (
                <g opacity="0.65">
                  <circle cx="160" cy="155" r={lesionRadius * 0.8} fill="none" stroke="#451a03" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="160" cy="155" r={lesionRadius * 0.55} fill="none" stroke="#291305" strokeWidth="1.8" />
                  <circle cx="160" cy="155" r={lesionRadius * 0.3} fill="none" stroke="#1c1917" strokeWidth="2" />
                </g>
              )}

              {/* Active Necrotic Core */}
              <circle cx="160" cy="155" r={lesionRadius} fill="url(#necroticCore)" />

              {/* Microscopic Spore Germination Cluster (Day 1-3) */}
              {currentDay <= 3 && (
                <g transform="translate(160, 155)">
                  <circle cx="0" cy="0" r="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
                  <line x1="0" y1="0" x2="8" y2="-10" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="1 1" />
                  <circle cx="8" cy="-10" r="2" fill="#ef4444" />
                  <circle cx="0" cy="0" r="14" fill="none" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="2 2" />
                </g>
              )}

              {/* Fungal Mildew Downy Spores for Late Blight (Day 4+) */}
              {selectedDiseaseId === "late_blight" && currentDay >= 4 && (
                <g fill="rgba(255, 255, 255, 0.85)">
                  {[
                    [-15, -10], [12, -18], [-8, 20], [18, 14], [-22, 5], [20, -6], [0, -25], [-12, -22]
                  ].map(([dx, dy], i) => (
                    <circle key={i} cx={160 + dx} cy={155 + dy} r="2.2" />
                  ))}
                </g>
              )}
            </svg>
          </div>

          <div className="canvas-footer-stats">
            <div className="c-stat">
              <span className="c-stat-label">Lesion Diameter:</span>
              <span className="c-stat-val">{(lesionRadius * 0.28).toFixed(1)} mm</span>
            </div>
            <div className="c-stat">
              <span className="c-stat-label">Photosynthesis Loss:</span>
              <span className="c-stat-val">{100 - stage.leafHealth}%</span>
            </div>
            <div className="c-stat">
              <span className="c-stat-label">Spore Risk Index:</span>
              <span className="c-stat-val">{currentDay >= 8 ? "🔴 Severe (Airborne)" : currentDay >= 4 ? "🟡 Moderate" : "🟢 Low / Local"}</span>
            </div>
          </div>
        </div>

        {/* Right: Pathological Stage Details & "What If I Spray Now?" Simulator */}
        <div className="timelapse-details-column">
          <div className="stage-description-card">
            <div className="stage-card-header">
              <span className="stage-tag">STAGE DIAGNOSIS</span>
              <h4 className="stage-title">{stage.title}</h4>
            </div>
            <p className="stage-narrative">{stage.desc}</p>

            <div className="symptoms-checklist">
              <span className="checklist-title">Observed In-Field Symptoms:</span>
              <ul>
                {stage.symptoms.map((sym, i) => (
                  <li key={i}>
                    <span className="bullet-dot"></span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* "What If I Spray Now?" Intervention Curve Box */}
          <div className="intervention-simulator-card">
            <div className="intervention-header">
              <div className="intervention-title-row">
                <IconShield size={18} />
                <span className="intervention-title">"What If I Spray Now?" Treatment ROI</span>
              </div>
              <span className="intervention-badge">LIVE CALCULATION</span>
            </div>

            <p className="intervention-prompt">
              Choose an intervention day to see how delaying chemical spray impacts crop yield rescue:
            </p>

            <div className="intervention-button-grid">
              <button
                type="button"
                className={`intervene-btn ${interventionDay === 1 ? "active" : ""}`}
                onClick={() => setInterventionDay(1)}
              >
                <span>⚡ Spray Day 1 (Preventative)</span>
                <strong>98% Rescue</strong>
              </button>
              <button
                type="button"
                className={`intervene-btn ${interventionDay === 4 ? "active" : ""}`}
                onClick={() => setInterventionDay(4)}
              >
                <span>🎯 Spray Day 4 (Early Spot)</span>
                <strong>88% Rescue</strong>
              </button>
              <button
                type="button"
                className={`intervene-btn ${interventionDay === 8 ? "active" : ""}`}
                onClick={() => setInterventionDay(8)}
              >
                <span>⚠️ Spray Day 8 (Late Blight)</span>
                <strong>55% Rescue</strong>
              </button>
            </div>

            {/* Rescue Outcome HUD */}
            <div className="rescue-outcome-hud">
              <div className="outcome-metric">
                <span className="metric-label">Yield Salvage Potential:</span>
                <span className={`metric-val ${getActiveRescueRate() > 80 ? "green" : getActiveRescueRate() > 50 ? "yellow" : "red"}`}>
                  {getActiveRescueRate()}% Harvest Saved
                </span>
              </div>
              <div className="recommended-rx-box">
                <span className="rx-label">Recommended Chemical Prescription:</span>
                <span className="rx-text">{stage.recommendedSpray}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
