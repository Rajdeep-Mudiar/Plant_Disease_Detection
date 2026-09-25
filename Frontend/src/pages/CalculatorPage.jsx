import React, { useState } from "react";
import "./CalculatorPage.css";
import DosageCalculator from "../components/DosageCalculator";
import TankMixCompatibilityChecker from "../components/TankMixCompatibilityChecker";
import EconomicsLossEstimator from "../components/EconomicsLossEstimator";
import SafetyCountdownTimer from "../components/SafetyCountdownTimer";
import SoilNutrientAdvisor from "../components/SoilNutrientAdvisor";
import CropSprayCalendar from "../components/CropSprayCalendar";
import TreatmentRoiSimulator from "../components/TreatmentRoiSimulator";
import { IconCalculator, IconShield, IconCheck } from "../components/Icons";

const PPE_ITEMS = [
  {
    id: "goggles",
    title: "Eye & Face Protection",
    desc: "Wear splash-proof chemical goggles and a certified particulate respirator during chemical mixing and tank loading.",
    badge: "Essential",
  },
  {
    id: "gloves",
    title: "Nitrile Chemical Gloves",
    desc: "Always utilize unlined nitrile or neoprene chemical gloves. Never use cloth or leather work gloves with pesticides.",
    badge: "Essential",
  },
  {
    id: "hours",
    title: "Application Hours Window",
    desc: "Apply in early morning (6 AM – 9 AM) or late afternoon (4 PM – 6 PM) to prevent rapid leaf dry-off and phytotoxicity.",
    badge: "Timing",
  },
  {
    id: "water",
    title: "Water Quality & pH Buffer",
    desc: "Use clean water with neutral pH (6.0 – 7.0). Alkaline water (>pH 8.0) can cause rapid alkaline hydrolysis of fungicides.",
    badge: "Dilution",
  },
];

const CalculatorPage = () => {
  const [checkedPpe, setCheckedPpe] = useState(["goggles", "gloves"]);

  const togglePpe = (id) => {
    setCheckedPpe((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const readinessPercent = Math.round((checkedPpe.length / PPE_ITEMS.length) * 100);

  return (
    <div className="meta-calc-page-container">
      <div className="calc-banner-card">
        <div className="calc-title-row">
          <div className="calc-icon-box">
            <IconCalculator size={22} />
          </div>
          <div>
            <h1 className="calc-main-title">Knapsack Sprayer & Dosage Calculator</h1>
            <p className="calc-sub-title">
              Calculate exact chemical powder weights, water dilution volumes, and tank loads based on field acreage.
            </p>
          </div>
        </div>
      </div>

      <div className="calc-content-area">
        <DosageCalculator />

        {/* Feature: Chemical Tank-Mix Compatibility Matrix & Jar Tester */}
        <TankMixCompatibilityChecker />

        {/* Feature: Soil Chemistry & N-P-K Fertilizer Deficit Rebalancing */}
        <SoilNutrientAdvisor />

        {/* Feature: Interactive Crop Spraying Calendar & Task Scheduler */}
        <CropSprayCalendar />

        {/* Feature: Treatment ROI & Economic Profit vs Loss Simulator */}
        <TreatmentRoiSimulator />

        {/* Feature 6: Farm Economics & Yield Loss Estimator */}
        <EconomicsLossEstimator />

        {/* Feature 4: Pre-Harvest Interval (PHI) & Chemical Safety Tracker */}
        <SafetyCountdownTimer />

        {/* Interactive Safety & PPE Protocol Card */}
        <div className="meta-safety-card">
          <div className="safety-header-row">
            <div className="safety-header-left">
              <IconShield size={20} className="shield-icon" />
              <div>
                <h3 className="safety-title-text">Interactive Agricultural Spray Safety & PPE Protocol</h3>
                <p className="safety-subtext">Click each safety item to verify protective gear before spray application.</p>
              </div>
            </div>

            {/* Live PPE Readiness Score Indicator */}
            <div className="ppe-readiness-badge-box">
              <span className="readiness-label">Safety Readiness</span>
              <div className="readiness-meter-wrap">
                <div className="readiness-progress-track">
                  <div
                    className={`readiness-progress-fill ${
                      readinessPercent === 100 ? "ready" : "pending"
                    }`}
                    style={{ width: `${readinessPercent}%` }}
                  ></div>
                </div>
                <span className="readiness-score-num">
                  {checkedPpe.length}/{PPE_ITEMS.length} ({readinessPercent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="safety-guidelines-grid">
            {PPE_ITEMS.map((item) => {
              const isChecked = checkedPpe.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`safety-guideline-item ${isChecked ? "checked" : ""}`}
                  onClick={() => togglePpe(item.id)}
                >
                  <div className="item-check-row">
                    <span className={`ppe-checkbox ${isChecked ? "active" : ""}`}>
                      {isChecked && <IconCheck size={12} />}
                    </span>
                    <span className="item-badge">{item.badge}</span>
                  </div>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;

