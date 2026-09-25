import React, { useState } from "react";
import "./TankMixCompatibilityChecker.css";
import { IconCalculator, IconShield, IconActivity } from "./Icons";

const AVAILABLE_CHEMICALS = [
  { id: "mancozeb", name: "Mancozeb 75% WP", class: "Fungicide (Dithiocarbamate)", ph: 6.8, ec: "Medium" },
  { id: "copper", name: "Copper Hydroxide 77% WP", class: "Bactericide / Fungicide", ph: 8.5, ec: "High Alkaline" },
  { id: "chlorothalonil", name: "Chlorothalonil 720 SC", class: "Broad Spectrum Fungicide", ph: 6.5, ec: "Low" },
  { id: "organophosphate", name: "Dimethoate 30% EC", class: "Insecticide (Organophosphate)", ph: 4.5, ec: "Acidic" },
  { id: "zinc_sulfate", name: "Foliar Zinc Sulfate (Chelated)", class: "Foliar Micronutrient", ph: 5.2, ec: "High Salt" },
  { id: "hort_oil", name: "Horticultural Spray Oil 98%", class: "Adjuvant / Insecticide", ph: 7.0, ec: "Emulsion" },
  { id: "wettable_sulfur", name: "Wettable Sulfur 80% WDG", class: "Fungicide / Acaricide", ph: 7.2, ec: "Suspension" },
];

export default function TankMixCompatibilityChecker() {
  const [selectedChems, setSelectedChems] = useState(["mancozeb", "chlorothalonil"]);
  const [testingJar, setTestingJar] = useState(false);

  const toggleChem = (id) => {
    if (selectedChems.includes(id)) {
      if (selectedChems.length > 1) {
        setSelectedChems(selectedChems.filter((c) => c !== id));
      }
    } else {
      if (selectedChems.length < 4) {
        setSelectedChems([...selectedChems, id]);
      }
    }
  };

  // Compatibility Logic
  const hasCopper = selectedChems.includes("copper");
  const hasAcidic = selectedChems.includes("organophosphate") || selectedChems.includes("zinc_sulfate");
  const hasSulfur = selectedChems.includes("wettable_sulfur");
  const hasOil = selectedChems.includes("hort_oil");

  let status = "COMPATIBLE";
  let precipitate = false;
  let phytotoxicity = false;
  let warningMessage = "✅ Physically and chemically compatible. Safe to charge tank mix.";

  if (hasSulfur && hasOil) {
    status = "ANTAGONISTIC_SEVERE";
    phytotoxicity = true;
    warningMessage = "🚨 CRITICAL INCOMPATIBILITY: Sulfur + Horticultural Oil will cause catastrophic leaf burning (phytotoxicity). Do NOT mix!";
  } else if (hasCopper && hasAcidic) {
    status = "ANTAGONISTIC_CHEMICAL";
    precipitate = true;
    warningMessage = "⚠️ CHEMICAL ANTAGONISM: High-alkaline Copper Hydroxide reacts with Acidic Organophosphate/Zinc to release toxic free Cu2+ ions and cause nozzle sludge.";
  } else if (selectedChems.length >= 3) {
    status = "JAR_TEST_REQUIRED";
    warningMessage = "🟡 COMPLEX 3+ WAY MIX: Perform a 1-Pint Jar Test first to verify physical suspension stability before filling large knapsack tank.";
  }

  const handleSimulateJarTest = () => {
    setTestingJar(true);
    setTimeout(() => {
      setTestingJar(false);
    }, 1500);
  };

  return (
    <div className="tank-mix-card">
      <div className="tank-mix-header">
        <div className="tm-title-group">
          <div className="tm-icon-frame">
            <IconCalculator size={22} />
          </div>
          <div>
            <div className="tm-badge-row">
              <span className="tm-badge">CHEMISTRY COMPATIBILITY ENGINE</span>
              <span className="tm-sub-badge">Tank-Mix Antagonism Checker</span>
            </div>
            <h3 className="tm-main-title">Chemical Tank-Mix Compatibility Matrix & Jar Tester</h3>
            <p className="tm-sub-title">
              Select 2 to 4 active chemicals to check whether combining them causes flocculation, thick sludge coagulation, pH neutralization, or leaf scorch.
            </p>
          </div>
        </div>
      </div>

      <div className="tm-body-grid">
        {/* Left: Chemical Selector Grid */}
        <div className="chem-multi-select-column">
          <span className="select-hint">Select Formulations to Mix in Tank (Max 4):</span>
          <div className="chem-chips-grid">
            {AVAILABLE_CHEMICALS.map((chem) => {
              const isSelected = selectedChems.includes(chem.id);
              return (
                <button
                  key={chem.id}
                  type="button"
                  className={`chem-chip-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleChem(chem.id)}
                >
                  <div className="chip-left">
                    <span className="chip-checkbox">{isSelected ? "✓" : "+"}</span>
                    <div className="chip-names">
                      <span className="chip-name">{chem.name}</span>
                      <span className="chip-class">{chem.class}</span>
                    </div>
                  </div>
                  <span className="chip-ph">pH {chem.ph}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Virtual Jar Test Tube & Compatibility Status */}
        <div className="jar-test-column">
          <div className="jar-test-card">
            <div className="jar-card-header">
              <span className="jar-hdr-title">🧪 VIRTUAL 1-PINT JAR TEST TUBE</span>
              <button
                type="button"
                className="shake-jar-btn"
                onClick={handleSimulateJarTest}
                disabled={testingJar}
              >
                {testingJar ? "Agitating..." : "🔄 Shake Jar Test"}
              </button>
            </div>

            <div className="jar-tube-visual-wrapper">
              {/* Virtual Glass Tube */}
              <div className={`virtual-jar-tube ${testingJar ? "shaking" : ""}`}>
                <div className="tube-liquid-layer">
                  {precipitate && <div className="precipitate-sludge"></div>}
                  {phytotoxicity && <div className="oil-slick-layer"></div>}
                  {testingJar && <div className="bubbles-vortex"></div>}
                </div>
                <div className="jar-ticks">
                  <span>500ml</span>
                  <span>250ml</span>
                  <span>0ml</span>
                </div>
              </div>

              <div className="jar-feedback-details">
                <div className={`status-pill-big ${status.toLowerCase()}`}>
                  {status === "COMPATIBLE" ? "🟢 100% COMPATIBLE" : status.includes("ANTAGONISTIC") ? "🔴 ANTAGONISTIC" : "🟡 JAR TEST RECOMMENDED"}
                </div>
                <p className="jar-warning-text">{warningMessage}</p>

                <div className="mix-order-rule">
                  <span className="rule-title">Standard W-A-L-E-S Tank Charge Order:</span>
                  <span className="rule-body">
                    1. <strong>W</strong>ettable Powders (WP) → 2. <strong>A</strong>gitate → 3. <strong>L</strong>iquid Flowables (SC) → 4. <strong>E</strong>mulsifiable Concentrates (EC) → 5. <strong>S</strong>urfactants.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
