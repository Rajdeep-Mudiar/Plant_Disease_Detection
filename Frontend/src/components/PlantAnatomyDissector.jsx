import React, { useState } from "react";
import "./PlantAnatomyDissector.css";
import { IconPlant, IconActivity, IconShield } from "./Icons";

const ANATOMY_LAYERS = [
  {
    id: "cuticle_epidermis",
    name: "Upper Cuticle & Epidermis",
    part: "Leaf Surface Layer",
    icon: "🍃",
    normalFunction: "Waxy hydrophobic barrier that regulates transpiration and blocks path of fungal hyphae.",
    pathologyImpact: "Fungal appressoria secrete cutinase enzyme to bore direct mechanical holes through wax layer.",
    vulnerability: "Damaged by high UV, hail wounds, or excessive chemical adjuvants.",
    treatmentTarget: "Contact Protectants (Chlorothalonil, Copper Hydroxide)",
    svgCoord: { cx: 160, cy: 75, r: 24 },
  },
  {
    id: "palisade_mesophyll",
    name: "Palisade & Spongy Mesophyll",
    part: "Photosynthetic Engine",
    icon: "☀️",
    normalFunction: "Chloroplast-dense columnar cells responsible for 80% of light absorption and carbon fixation.",
    pathologyImpact: "Alternaria and Phytophthora release host-specific phytotoxins, causing chloroplast collapse and yellow halo chlorosis.",
    vulnerability: "Loss of chlorophyll leads to rapid canopy defoliation.",
    treatmentTarget: "Translaminar Systemics (Difenoconazole, Azoxystrobin)",
    svgCoord: { cx: 160, cy: 130, r: 30 },
  },
  {
    id: "vascular_bundle",
    name: "Vascular Bundle (Xylem & Phloem)",
    part: "Nutrient & Water Transport",
    icon: "🫀",
    normalFunction: "Xylem transports water and minerals upward from roots; Phloem distributes photosynthetic sugars downward to tubers.",
    pathologyImpact: "Vascular wilt fungi (Verticillium, Fusarium) clog xylem tracheids with mycelial plugs, causing sudden one-sided branch wilting.",
    vulnerability: "Once vascular bundle is blocked, distal foliage collapses within 72 hours.",
    treatmentTarget: "Acropetal Acidity Systemics (Fosetyl-Al, Carbendazim drench)",
    svgCoord: { cx: 160, cy: 195, r: 26 },
  },
  {
    id: "stem_collar",
    name: "Stem Collar & Crown Zone",
    part: "Ground Transition Zone",
    icon: "🪵",
    normalFunction: "Structural anchor transmitting all vascular flow between root system and aerial branches.",
    pathologyImpact: "Rhizoctonia stem canker and Sclerotinia white mold cause brown sunken girdling ulcers, choking whole plant.",
    vulnerability: "High moisture at soil line promotes soil-borne fungal gnawing.",
    treatmentTarget: "Crown Directed Spray (Fludioxonil + Azoxystrobin)",
    svgCoord: { cx: 160, cy: 245, r: 20 },
  },
  {
    id: "tuber_root",
    name: "Tuber & Root Storage Cortex",
    part: "Economic Harvest Storage",
    icon: "🥔",
    normalFunction: "Storage parenchymal tissue holding starch reserves for commercial harvest and seed propagation.",
    pathologyImpact: "Late blight spores washed by rainwater into soil penetrate lenticels, causing granular reddish-brown dry rot and secondary bacterial soft rot.",
    vulnerability: "Rotting tubers emit foul stench and produce post-harvest storage decay.",
    treatmentTarget: "Pre-Harvest Dribble / Tuber Desiccation (Diquat + Fluazinam)",
    svgCoord: { cx: 160, cy: 295, r: 34 },
  },
];

export default function PlantAnatomyDissector() {
  const [selectedLayerId, setSelectedLayerId] = useState("cuticle_epidermis");
  const [viewMode, setViewMode] = useState("cross_section"); // "cross_section", "pathogen_attack"

  const activeLayer = ANATOMY_LAYERS.find((l) => l.id === selectedLayerId) || ANATOMY_LAYERS[0];

  return (
    <div className="plant-anatomy-card">
      <div className="anatomy-header">
        <div className="anatomy-title-group">
          <div className="anatomy-icon-frame">
            <IconPlant size={22} />
          </div>
          <div>
            <div className="anatomy-badge-row">
              <span className="anatomy-badge">PHYSIOLOGICAL DISSECTOR</span>
              <span className="anatomy-sub-badge">Tissue Cross-Section</span>
            </div>
            <h3 className="anatomy-main-title">3D Interactive Plant Anatomical & Pathology Dissector</h3>
            <p className="anatomy-sub-title">
              Click on anatomical tissue layers to inspect how fungal pathogens penetrate the upper cuticle, clog vascular xylem vessels, and rot underground tuber cortexes.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="anatomy-mode-pills">
          <button
            type="button"
            className={`mode-pill ${viewMode === "cross_section" ? "active" : ""}`}
            onClick={() => setViewMode("cross_section")}
          >
            🔬 Microscopic Tissue Layer
          </button>
          <button
            type="button"
            className={`mode-pill ${viewMode === "pathogen_attack" ? "active" : ""}`}
            onClick={() => setViewMode("pathogen_attack")}
          >
            🦠 Pathogen Invasion Mode
          </button>
        </div>
      </div>

      <div className="anatomy-body-grid">
        {/* Left: Interactive SVG Anatomical Diagram */}
        <div className="anatomy-svg-column">
          <div className="svg-frame-header">
            <span className="frame-title">POTATO / TOMATO PLANT ANATOMY</span>
            <span className="frame-hint">Click any layer to dissect</span>
          </div>

          <div className="plant-svg-box">
            <svg viewBox="0 0 320 360" className="anatomy-svg">
              <defs>
                <linearGradient id="leafGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
                <linearGradient id="stemGrad3D" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#166534" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>
                <linearGradient id="tuberGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#854d0e" />
                </linearGradient>
                <filter id="glowAnatomy" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#38bdf8" floodOpacity="0.9" />
                </filter>
              </defs>

              {/* Foliage Canopy */}
              <ellipse cx="160" cy="80" rx="90" ry="45" fill="url(#leafGrad3D)" opacity="0.85" />
              <path d="M 80 85 Q 160 30, 240 85" fill="none" stroke="#166534" strokeWidth="2" />
              <path d="M 100 120 Q 160 70, 220 120" fill="none" stroke="#166534" strokeWidth="2" />

              {/* Main Stem */}
              <rect x="153" y="80" width="14" height="175" rx="4" fill="url(#stemGrad3D)" />

              {/* Soil Line */}
              <line x1="20" y1="250" x2="300" y2="250" stroke="#78350f" strokeWidth="3" strokeDasharray="8 4" />
              <rect x="20" y="252" width="280" height="95" fill="rgba(120, 53, 15, 0.12)" />

              {/* Root / Tuber System */}
              <ellipse cx="160" cy="295" rx="42" ry="28" fill="url(#tuberGrad3D)" stroke="#78350f" strokeWidth="2" />
              <ellipse cx="100" cy="305" rx="26" ry="18" fill="url(#tuberGrad3D)" stroke="#78350f" strokeWidth="1.5" />
              <ellipse cx="220" cy="305" rx="26" ry="18" fill="url(#tuberGrad3D)" stroke="#78350f" strokeWidth="1.5" />

              {/* Root Fibers */}
              <path d="M 160 323 Q 160 350, 150 355" fill="none" stroke="#ca8a04" strokeWidth="1.5" />
              <path d="M 140 320 Q 120 345, 100 350" fill="none" stroke="#ca8a04" strokeWidth="1.5" />
              <path d="M 180 320 Q 200 345, 220 350" fill="none" stroke="#ca8a04" strokeWidth="1.5" />

              {/* Interactive Target Callout Circles */}
              {ANATOMY_LAYERS.map((layer) => {
                const isSelected = selectedLayerId === layer.id;
                return (
                  <g
                    key={layer.id}
                    className="anatomy-hotspot-group"
                    onClick={() => setSelectedLayerId(layer.id)}
                    style={{ cursor: "pointer" }}
                    filter={isSelected ? "url(#glowAnatomy)" : undefined}
                  >
                    <circle
                      cx={layer.svgCoord.cx}
                      cy={layer.svgCoord.cy}
                      r={layer.svgCoord.r}
                      fill={isSelected ? "rgba(56, 189, 248, 0.35)" : "rgba(255, 255, 255, 0.25)"}
                      stroke={isSelected ? "#38bdf8" : "#ffffff"}
                      strokeWidth={isSelected ? "2.5" : "1.2"}
                      strokeDasharray={isSelected ? undefined : "3 3"}
                    />
                    <circle
                      cx={layer.svgCoord.cx}
                      cy={layer.svgCoord.cy}
                      r="6"
                      fill={isSelected ? "#38bdf8" : "#ffffff"}
                    />
                    {viewMode === "pathogen_attack" && (
                      <g transform={`translate(${layer.svgCoord.cx + 12}, ${layer.svgCoord.cy - 12})`}>
                        <circle cx="0" cy="0" r="5" fill="#ef4444" />
                        <circle cx="0" cy="0" r="10" fill="none" stroke="#ef4444" strokeWidth="1" className="spore-pulse-ring" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Detailed Physiological & Pathology Drawer */}
        <div className="anatomy-details-column">
          <div className="dissected-layer-card">
            <div className="layer-card-top">
              <span className="layer-big-icon">{activeLayer.icon}</span>
              <div>
                <span className="layer-part-tag">{activeLayer.part}</span>
                <h4 className="layer-title">{activeLayer.name}</h4>
              </div>
            </div>

            <div className="dissection-field">
              <span className="field-label">🌿 Normal Healthy Physiology:</span>
              <p className="field-text">{activeLayer.normalFunction}</p>
            </div>

            <div className="dissection-field alert">
              <span className="field-label red">🦠 Pathology Attack Mechanism:</span>
              <p className="field-text">{activeLayer.pathologyImpact}</p>
            </div>

            <div className="dissection-field">
              <span className="field-label">⚠️ Tissue Vulnerability:</span>
              <p className="field-text">{activeLayer.vulnerability}</p>
            </div>

            <div className="dissection-field rx">
              <span className="field-label blue">🎯 Targeted Chemical & Biocontrol Strategy:</span>
              <p className="field-text bold">{activeLayer.treatmentTarget}</p>
            </div>
          </div>

          {/* Quick Layer Switcher Badges */}
          <div className="quick-layer-switcher">
            {ANATOMY_LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={`quick-layer-btn ${selectedLayerId === l.id ? "active" : ""}`}
                onClick={() => setSelectedLayerId(l.id)}
              >
                <span>{l.icon}</span>
                <span>{l.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
