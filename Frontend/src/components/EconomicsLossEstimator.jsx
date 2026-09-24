import React, { useState } from "react";
import "./EconomicsLossEstimator.css";
import { IconDollar, IconTrendingDown, IconTrendingUp, IconShield, IconActivity } from "./Icons";

const EconomicsLossEstimator = ({ diseaseSeverity = 45, defaultCrop = "Potato" }) => {
  const [currency, setCurrency] = useState("USD"); // "USD" or "INR"
  const [plotArea, setPlotArea] = useState(10); // acres
  const [expectedYieldPerAcre, setExpectedYieldPerAcre] = useState(18); // tons / acre
  const [marketPricePerUnit, setMarketPricePerUnit] = useState(240); // per ton
  const [severityPercent, setSeverityPercent] = useState(diseaseSeverity || 45);
  const [treatmentCostPerAcre, setTreatmentCostPerAcre] = useState(45); // fungicide + labor cost

  const currSymbol = currency === "USD" ? "$" : "₹";

  // Calculations
  // Total potential yield without disease
  const totalPotentialYield = plotArea * expectedYieldPerAcre;
  const grossPotentialRevenue = totalPotentialYield * marketPricePerUnit;

  // Unmitigated loss model (e.g., late blight can destroy 1.2x severity up to 90% if untreated)
  const lossMultiplier = Math.min(1, (severityPercent * 1.3) / 100);
  const unmitigatedYieldLossTons = totalPotentialYield * lossMultiplier;
  const unmitigatedFinancialLoss = unmitigatedYieldLossTons * marketPricePerUnit;

  // With intervention (efficacy ~85% recovery / loss prevention)
  const interventionEfficacy = 0.82;
  const valueSavedWithIntervention = unmitigatedFinancialLoss * interventionEfficacy;
  const totalTreatmentCost = plotArea * treatmentCostPerAcre;
  const netSavedRevenue = valueSavedWithIntervention - totalTreatmentCost;
  const roiMultiplier = totalTreatmentCost > 0 ? (netSavedRevenue / totalTreatmentCost) * 100 : 0;

  return (
    <div className="econ-estimator-card">
      <div className="econ-header-bar">
        <div className="econ-title-group">
          <div className="econ-icon-frame">
            <IconDollar size={18} />
          </div>
          <div>
            <h3 className="econ-main-title">Farm Economics & Yield Loss Financial Estimator</h3>
            <p className="econ-sub-title">Quantify crop revenue at risk, chemical ROI, and loss mitigation value</p>
          </div>
        </div>

        <div className="econ-currency-toggle">
          <button
            type="button"
            className={`currency-btn ${currency === "USD" ? "active" : ""}`}
            onClick={() => {
              setCurrency("USD");
              setMarketPricePerUnit(240);
              setTreatmentCostPerAcre(45);
            }}
          >
            USD ($)
          </button>
          <button
            type="button"
            className={`currency-btn ${currency === "INR" ? "active" : ""}`}
            onClick={() => {
              setCurrency("INR");
              setMarketPricePerUnit(1800);
              setTreatmentCostPerAcre(1200);
            }}
          >
            INR (₹)
          </button>
        </div>
      </div>

      <div className="econ-layout-grid">
        {/* Left Form Parameter Controls */}
        <div className="econ-inputs-col">
          <div className="econ-input-group">
            <label>Field Plot Area (Acres)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={plotArea}
              onChange={(e) => setPlotArea(Number(e.target.value))}
              className="econ-field-input"
            />
          </div>

          <div className="econ-input-group">
            <label>Expected Target Yield (Tons / Acre)</label>
            <input
              type="number"
              min="1"
              value={expectedYieldPerAcre}
              onChange={(e) => setExpectedYieldPerAcre(Number(e.target.value))}
              className="econ-field-input"
            />
          </div>

          <div className="econ-input-group">
            <label>Market Price per Ton ({currSymbol})</label>
            <input
              type="number"
              min="1"
              value={marketPricePerUnit}
              onChange={(e) => setMarketPricePerUnit(Number(e.target.value))}
              className="econ-field-input"
            />
          </div>

          <div className="econ-input-group">
            <label>Intervention Cost per Acre ({currSymbol})</label>
            <input
              type="number"
              min="0"
              value={treatmentCostPerAcre}
              onChange={(e) => setTreatmentCostPerAcre(Number(e.target.value))}
              className="econ-field-input"
            />
          </div>

          <div className="econ-input-group">
            <div className="slider-label-row">
              <label>Field Pathogen Severity</label>
              <span className="slider-val-badge">{severityPercent}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={severityPercent}
              onChange={(e) => setSeverityPercent(Number(e.target.value))}
              className="econ-slider"
            />
          </div>
        </div>

        {/* Right Financial Telemetry Cards */}
        <div className="econ-results-col">
          <div className="econ-summary-cards-grid">
            <div className="econ-stat-card danger">
              <div className="stat-card-icon">
                <IconTrendingDown size={18} />
              </div>
              <span className="stat-label">Unmitigated Loss at Risk</span>
              <h4 className="stat-value">
                {currSymbol}
                {Math.round(unmitigatedFinancialLoss).toLocaleString()}
              </h4>
              <small className="stat-sub">
                ~{Math.round(unmitigatedYieldLossTons)} Tons production loss
              </small>
            </div>

            <div className="econ-stat-card success">
              <div className="stat-card-icon">
                <IconShield size={18} />
              </div>
              <span className="stat-label">Net Value Protected by AI Plan</span>
              <h4 className="stat-value">
                {currSymbol}
                {Math.round(netSavedRevenue).toLocaleString()}
              </h4>
              <small className="stat-sub">
                82% efficacy mitigation factor
              </small>
            </div>
          </div>

          {/* ROI Metric Banner */}
          <div className="econ-roi-banner">
            <div className="roi-metric-left">
              <div className="roi-badge">
                <IconTrendingUp size={16} />
                <span>ROI Factor</span>
              </div>
              <h3 className="roi-multiplier">
                {roiMultiplier > 0 ? `+${Math.round(roiMultiplier)}%` : "0%"}
              </h3>
              <p className="roi-desc">
                For every {currSymbol}1 spent on recommended fungicide spray, your farm protects {currSymbol}
                {(valueSavedWithIntervention / (totalTreatmentCost || 1)).toFixed(1)} in crop yield.
              </p>
            </div>

            <div className="roi-breakdown-table">
              <div className="roi-row">
                <span>Gross Revenue Potential:</span>
                <strong>{currSymbol}{Math.round(grossPotentialRevenue).toLocaleString()}</strong>
              </div>
              <div className="roi-row">
                <span>Total Treatment Cost:</span>
                <span className="cost-tag">-{currSymbol}{Math.round(totalTreatmentCost).toLocaleString()}</span>
              </div>
              <div className="roi-row highlight">
                <span>Protected Farm Earnings:</span>
                <strong>{currSymbol}{Math.round(grossPotentialRevenue - unmitigatedFinancialLoss + netSavedRevenue).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicsLossEstimator;
