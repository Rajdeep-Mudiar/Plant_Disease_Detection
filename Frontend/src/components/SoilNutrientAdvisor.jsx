import React, { useState } from "react";
import "./SoilNutrientAdvisor.css";
import {
  IconPlant,
  IconSparkles,
  IconCheck,
  IconRefresh,
  IconShield,
} from "./Icons";
import { useTranslation } from "../context/LanguageContext";

const CROP_NUTRIENT_REQUIREMENTS = {
  potato: {
    name: "Potato (Solanum tuberosum)",
    optimalPh: [5.5, 6.5],
    targetN: 180, // kg/ha
    targetP: 80,
    targetK: 220,
    stage: "Tuber Bulking Stage",
  },
  tomato: {
    name: "Tomato (Solanum lycopersicum)",
    optimalPh: [6.0, 6.8],
    targetN: 160,
    targetP: 90,
    targetK: 200,
    stage: "Flowering & Fruit Set",
  },
  corn: {
    name: "Corn / Maize (Zea mays)",
    optimalPh: [5.8, 7.0],
    targetN: 200,
    targetP: 70,
    targetK: 120,
    stage: "Vegetative V6 Stage",
  },
  apple: {
    name: "Apple Orchard (Malus domestica)",
    optimalPh: [6.0, 7.0],
    targetN: 110,
    targetP: 50,
    targetK: 180,
    stage: "Post-Harvest Leaf Drop",
  },
};

const SoilNutrientAdvisor = () => {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState("potato");
  const [soilPh, setSoilPh] = useState(6.2);
  const [currentN, setCurrentN] = useState(95); // ppm / kg/ha
  const [currentP, setCurrentP] = useState(42);
  const [currentK, setCurrentK] = useState(130);
  const [soilOrganicMatter, setSoilOrganicMatter] = useState(2.4); // %
  const [fieldArea, setFieldArea] = useState(5.0); // Acres

  const cropReq = CROP_NUTRIENT_REQUIREMENTS[selectedCrop] || CROP_NUTRIENT_REQUIREMENTS.potato;

  // Deficit / Balance calculations
  const deficitN = Math.max(0, cropReq.targetN - currentN);
  const deficitP = Math.max(0, cropReq.targetP - currentP);
  const deficitK = Math.max(0, cropReq.targetK - currentK);

  // Conversion to commercial fertilizer weights (per Acre)
  // Urea (46% N) -> deficitN / 0.46
  const ureaPerAcreKg = Math.round((deficitN / 0.46) * 0.4047);
  // DAP (18% N, 46% P2O5) -> deficitP / 0.46
  const dapPerAcreKg = Math.round((deficitP / 0.46) * 0.4047);
  // MOP / Potash (60% K2O) -> deficitK / 0.60
  const mopPerAcreKg = Math.round((deficitK / 0.60) * 0.4047);
  // Organic vermicompost recommendation
  const compostBagsNeeded = Math.round(fieldArea * 8);

  // pH Status
  const isPhAcidic = soilPh < cropReq.optimalPh[0];
  const isPhAlkaline = soilPh > cropReq.optimalPh[1];
  const isPhOptimal = !isPhAcidic && !isPhAlkaline;

  return (
    <div className="soil-advisor-card">
      <div className="soil-header-row">
        <div className="soil-title-col">
          <div className="soil-badge">
            <IconPlant size={15} />
            <span>Soil Chemistry & Fertilizer Deficit Intelligence</span>
          </div>
          <h3 className="soil-main-heading">
            Precision N-P-K & Soil Amendment Rebalancing Engine
          </h3>
          <p className="soil-sub-desc">
            Calculates macronutrient soil deficits and outputs tailored Urea, DAP, and MOP fertilizer application schedules tailored to your target crop.
          </p>
        </div>
      </div>

      {/* Input Parameters Grid */}
      <div className="soil-inputs-grid">
        <div className="soil-field">
          <label>Target Crop</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {Object.entries(CROP_NUTRIENT_REQUIREMENTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div className="soil-field">
          <label>Measured Soil pH ({soilPh})</label>
          <input
            type="number"
            min="4.0"
            max="9.0"
            step="0.1"
            value={soilPh}
            onChange={(e) => setSoilPh(Number(e.target.value))}
          />
        </div>

        <div className="soil-field">
          <label>Current Nitrogen (N in kg/ha)</label>
          <input
            type="number"
            min="0"
            max="300"
            value={currentN}
            onChange={(e) => setCurrentN(Number(e.target.value))}
          />
        </div>

        <div className="soil-field">
          <label>Current Phosphorus (P in kg/ha)</label>
          <input
            type="number"
            min="0"
            max="200"
            value={currentP}
            onChange={(e) => setCurrentP(Number(e.target.value))}
          />
        </div>

        <div className="soil-field">
          <label>Current Potassium (K in kg/ha)</label>
          <input
            type="number"
            min="0"
            max="400"
            value={currentK}
            onChange={(e) => setCurrentK(Number(e.target.value))}
          />
        </div>

        <div className="soil-field">
          <label>Field Acreage (Acres)</label>
          <input
            type="number"
            min="0.5"
            max="1000"
            step="0.5"
            value={fieldArea}
            onChange={(e) => setFieldArea(Number(e.target.value))}
          />
        </div>
      </div>

      {/* NPK Balance Meters */}
      <div className="npk-balance-section">
        <h4 className="npk-section-title">Soil Macronutrient Balance Status</h4>
        <div className="npk-meters-grid">
          {/* Nitrogen */}
          <div className="npk-meter-box">
            <div className="npk-label-row">
              <span className="npk-name">Nitrogen (N)</span>
              <span className="npk-status">{currentN} / {cropReq.targetN} kg/ha</span>
            </div>
            <div className="npk-bar-track">
              <div
                className="npk-bar-fill nitrogen"
                style={{ width: `${Math.min(100, (currentN / cropReq.targetN) * 100)}%` }}
              ></div>
            </div>
            <span className="npk-deficit-text">Deficit: -{deficitN} kg/ha</span>
          </div>

          {/* Phosphorus */}
          <div className="npk-meter-box">
            <div className="npk-label-row">
              <span className="npk-name">Phosphorus (P₂O₅)</span>
              <span className="npk-status">{currentP} / {cropReq.targetP} kg/ha</span>
            </div>
            <div className="npk-bar-track">
              <div
                className="npk-bar-fill phosphorus"
                style={{ width: `${Math.min(100, (currentP / cropReq.targetP) * 100)}%` }}
              ></div>
            </div>
            <span className="npk-deficit-text">Deficit: -{deficitP} kg/ha</span>
          </div>

          {/* Potassium */}
          <div className="npk-meter-box">
            <div className="npk-label-row">
              <span className="npk-name">Potassium (K₂O)</span>
              <span className="npk-status">{currentK} / {cropReq.targetK} kg/ha</span>
            </div>
            <div className="npk-bar-track">
              <div
                className="npk-bar-fill potassium"
                style={{ width: `${Math.min(100, (currentK / cropReq.targetK) * 100)}%` }}
              ></div>
            </div>
            <span className="npk-deficit-text">Deficit: -{deficitK} kg/ha</span>
          </div>
        </div>
      </div>

      {/* Recommended Commercial Fertilizer Application Prescription */}
      <div className="fertilizer-prescription-grid">
        <div className="prescription-card urea">
          <span className="fert-type">Nitrogen Carrier</span>
          <h4 className="fert-product">Urea (46-0-0)</h4>
          <span className="fert-rate">{ureaPerAcreKg} kg / Acre</span>
          <span className="fert-total">Total: {Math.round(ureaPerAcreKg * fieldArea)} kg for {fieldArea} Acres</span>
        </div>

        <div className="prescription-card dap">
          <span className="fert-type">Phosphorus Carrier</span>
          <h4 className="fert-product">DAP (18-46-0)</h4>
          <span className="fert-rate">{dapPerAcreKg} kg / Acre</span>
          <span className="fert-total">Total: {Math.round(dapPerAcreKg * fieldArea)} kg for {fieldArea} Acres</span>
        </div>

        <div className="prescription-card mop">
          <span className="fert-type">Potassium Carrier</span>
          <h4 className="fert-product">MOP (0-0-60)</h4>
          <span className="fert-rate">{mopPerAcreKg} kg / Acre</span>
          <span className="fert-total">Total: {Math.round(mopPerAcreKg * fieldArea)} kg for {fieldArea} Acres</span>
        </div>

        <div className="prescription-card compost">
          <span className="fert-type">Soil Conditioning</span>
          <h4 className="fert-product">Organic Vermicompost</h4>
          <span className="fert-rate">8 Bags / Acre</span>
          <span className="fert-total">Total: {compostBagsNeeded} Bags (50kg each)</span>
        </div>
      </div>

      {/* Soil pH Advisory Callout */}
      <div className={`soil-ph-advisory ${isPhOptimal ? "optimal" : isPhAcidic ? "acidic" : "alkaline"}`}>
        <span className="ph-badge">pH Status: {soilPh}</span>
        <p className="ph-msg">
          {isPhOptimal
            ? `Optimal soil pH window (${cropReq.optimalPh[0]} - ${cropReq.optimalPh[1]}) for ${cropReq.name}. Maximum nutrient bioavailability.`
            : isPhAcidic
            ? `Soil is overly acidic (pH < ${cropReq.optimalPh[0]}). Apply Agricultural Calcitic Lime (CaCO₃) @ 200 kg/acre to restore nutrient absorption.`
            : `Soil is overly alkaline (pH > ${cropReq.optimalPh[1]}). Apply Elemental Agricultural Sulphur @ 50 kg/acre to lower pH and release locked micronutrients.`}
        </p>
      </div>
    </div>
  );
};

export default SoilNutrientAdvisor;
