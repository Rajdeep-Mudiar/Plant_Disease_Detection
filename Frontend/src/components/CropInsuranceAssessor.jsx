import React, { useState } from "react";
import "./CropInsuranceAssessor.css";
import {
  IconDollar,
  IconShield,
  IconTrendingDown,
  IconTrendingUp,
  IconDocument,
  IconCheck,
} from "./Icons";
import { useTranslation } from "../context/LanguageContext";

const CROP_MARKET_STANDARDS = {
  potato: { name: "Potato", yieldPerAcre: 14.5, pricePerTon: 280, unit: "Tons" },
  tomato: { name: "Tomato", yieldPerAcre: 22.0, pricePerTon: 420, unit: "Tons" },
  corn: { name: "Corn (Maize)", yieldPerAcre: 4.8, pricePerTon: 220, unit: "Tons" },
  apple: { name: "Apple", yieldPerAcre: 12.0, pricePerTon: 850, unit: "Tons" },
};

const CropInsuranceAssessor = ({ prediction, cropType = "potato" }) => {
  const { t } = useTranslation();
  const [acreage, setAcreage] = useState(10);
  const [costPerAcreSpray, setCostPerAcreSpray] = useState(35); // $ / acre
  const [currency, setCurrency] = useState("$");
  const [insuranceDeductible, setInsuranceDeductible] = useState(500);

  const cropInfo = CROP_MARKET_STANDARDS[cropType] || CROP_MARKET_STANDARDS.potato;

  // Severity percentage from prediction or fallback
  const severityPct =
    prediction?.severity?.percentage ||
    (prediction?.disease === "Late Blight"
      ? 55
      : prediction?.disease === "Early Blight"
      ? 22
      : 0);

  const isHealthy = prediction?.disease === "Healthy" || severityPct === 0;

  // Financial calculations
  const totalPotentialYieldTons = (acreage * cropInfo.yieldPerAcre).toFixed(1);
  const totalGrossCropValue = Math.round(totalPotentialYieldTons * cropInfo.pricePerTon);

  // Projected yield loss percentage (non-linear pathogen damage curve)
  const estimatedYieldLossPct = Math.min(
    90,
    Math.round(severityPct * (prediction?.disease === "Late Blight" ? 1.4 : 1.1))
  );

  const potentialYieldLossTons = ((totalPotentialYieldTons * estimatedYieldLossPct) / 100).toFixed(1);
  const grossMonetaryLoss = Math.round(totalGrossCropValue * (estimatedYieldLossPct / 100));

  const totalTreatmentCost = Math.round(acreage * costPerAcreSpray);
  const netSavedValue = Math.max(0, grossMonetaryLoss - totalTreatmentCost);
  const treatmentRoi = totalTreatmentCost > 0 ? Math.round((netSavedValue / totalTreatmentCost) * 100) : 0;

  const estimatedInsuranceClaimPayout = Math.max(
    0,
    grossMonetaryLoss - insuranceDeductible
  );

  return (
    <div className="insurance-assessor-card">
      <div className="assessor-header">
        <div className="assessor-title-col">
          <div className="assessor-badge">
            <IconDollar size={15} />
            <span>Yield Economics & Agricultural Insurance Risk Assessor</span>
          </div>
          <h3 className="assessor-heading">Foliar Pathogen Economic Damage Modeling</h3>
          <p className="assessor-desc">
            Calculates financial crop loss, fungicide treatment ROI, and insurance damage claims based on real-time foliar necrosis percentage.
          </p>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="assessor-inputs-grid">
        <div className="assessor-field">
          <label>Field Acreage (Acres)</label>
          <input
            type="number"
            min="1"
            max="10000"
            value={acreage}
            onChange={(e) => setAcreage(Math.max(1, Number(e.target.value)))}
          />
        </div>

        <div className="assessor-field">
          <label>Crop Variety Baseline</label>
          <div className="readonly-val">{cropInfo.name} ({cropInfo.yieldPerAcre} Tons/Acre)</div>
        </div>

        <div className="assessor-field">
          <label>Market Price per Ton ({currency})</label>
          <div className="readonly-val">{currency}{cropInfo.pricePerTon} / Ton</div>
        </div>

        <div className="assessor-field">
          <label>Fungicide Spray Cost / Acre ({currency})</label>
          <input
            type="number"
            min="5"
            max="500"
            value={costPerAcreSpray}
            onChange={(e) => setCostPerAcreSpray(Math.max(1, Number(e.target.value)))}
          />
        </div>
      </div>

      {/* Financial Impact Cards Grid */}
      <div className="financial-metrics-grid">
        <div className="fin-card total-value">
          <span className="fin-label">Total Field Crop Value</span>
          <span className="fin-value">{currency}{totalGrossCropValue.toLocaleString()}</span>
          <span className="fin-sub">{totalPotentialYieldTons} Tons Projected Harvest</span>
        </div>

        <div className={`fin-card loss-risk ${isHealthy ? "safe" : "danger"}`}>
          <span className="fin-label">Projected Pathogen Loss</span>
          <span className="fin-value">
            {isHealthy ? "$0" : `${currency}${grossMonetaryLoss.toLocaleString()}`}
          </span>
          <span className="fin-sub">
            {isHealthy ? "0% Foliar Necrosis" : `-${potentialYieldLossTons} Tons (${estimatedYieldLossPct}% yield reduction)`}
          </span>
        </div>

        <div className="fin-card treatment-roi">
          <span className="fin-label">Net Value Protected by Spray</span>
          <span className="fin-value highlight">
            {isHealthy ? "$0" : `${currency}${netSavedValue.toLocaleString()}`}
          </span>
          <span className="fin-sub">
            {isHealthy ? "Optimal Health" : `${treatmentRoi}% ROI (Spray Cost: ${currency}${totalTreatmentCost})`}
          </span>
        </div>

        <div className="fin-card insurance-payout">
          <span className="fin-label">Estimated Insurance Claim</span>
          <span className="fin-value claim">
            {isHealthy ? "$0" : `${currency}${estimatedInsuranceClaimPayout.toLocaleString()}`}
          </span>
          <span className="fin-sub">Less ${insuranceDeductible} deductible</span>
        </div>
      </div>
    </div>
  );
};

export default CropInsuranceAssessor;
