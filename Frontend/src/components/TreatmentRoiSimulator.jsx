import React, { useState } from "react";
import "./TreatmentRoiSimulator.css";
import {
  IconDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconShield,
  IconCheck,
  IconSparkles,
} from "./Icons";

const TreatmentRoiSimulator = ({ cropType = "Potato", defaultAcreage = 10 }) => {
  const [acreage, setAcreage] = useState(defaultAcreage);
  const [marketPricePerKg, setMarketPricePerKg] = useState(25); // ₹ or $ per kg
  const [expectedNormalYieldTonnes, setExpectedNormalYieldTonnes] = useState(12); // Tonnes / Acre
  const [infectionSeverity, setInfectionSeverity] = useState(65); // % Blight Severity

  // Baseline potential revenue (1 Tonne = 1000 Kg)
  const normalTotalYieldKg = acreage * expectedNormalYieldTonnes * 1000;
  const potentialGrossRevenue = normalTotalYieldKg * marketPricePerKg;

  // Strategy 1: No Action (Untreated Pathogen Destruction)
  const untreatedYieldLossPct = Math.min(95, infectionSeverity * 1.3);
  const untreatedActualYieldKg = normalTotalYieldKg * (1 - untreatedYieldLossPct / 100);
  const untreatedGrossRevenue = untreatedActualYieldKg * marketPricePerKg;
  const untreatedTreatmentCost = 0;
  const untreatedNetProfit = untreatedGrossRevenue - untreatedTreatmentCost;
  const untreatedFinancialLoss = potentialGrossRevenue - untreatedGrossRevenue;

  // Strategy 2: Standard Chemical Precision Control (Fungicide Program)
  const chemicalCostPerAcre = 2400; // ₹ / Acre for full 3-spray cycle
  const chemicalTreatmentCost = acreage * chemicalCostPerAcre;
  const chemicalYieldRetentionPct = 96; // 96% of normal crop saved
  const chemicalActualYieldKg = normalTotalYieldKg * (chemicalYieldRetentionPct / 100);
  const chemicalGrossRevenue = chemicalActualYieldKg * marketPricePerKg;
  const chemicalNetProfit = chemicalGrossRevenue - chemicalTreatmentCost;
  const chemicalNetGainOverUntreated = chemicalNetProfit - untreatedNetProfit;
  const chemicalRoiPct = Math.round((chemicalNetGainOverUntreated / chemicalTreatmentCost) * 100);

  // Strategy 3: Certified Bio-Organic Control (Organic Bio-Fungicide + 30% Market Premium)
  const organicCostPerAcre = 3200; // ₹ / Acre
  const organicTreatmentCost = acreage * organicCostPerAcre;
  const organicYieldRetentionPct = 89; // 89% of normal crop saved
  const organicMarketPrice = marketPricePerKg * 1.35; // +35% Organic Premium Price
  const organicActualYieldKg = normalTotalYieldKg * (organicYieldRetentionPct / 100);
  const organicGrossRevenue = organicActualYieldKg * organicMarketPrice;
  const organicNetProfit = organicGrossRevenue - organicTreatmentCost;
  const organicNetGainOverUntreated = organicNetProfit - untreatedNetProfit;
  const organicRoiPct = Math.round((organicNetGainOverUntreated / organicTreatmentCost) * 100);

  return (
    <div className="roi-simulator-card">
      <div className="roi-header-row">
        <div className="roi-title-col">
          <div className="roi-badge">
            <IconDollar size={14} />
            <span>Economic Agronomy Forecaster</span>
          </div>
          <h3 className="roi-heading">
            Treatment ROI &amp; Financial Loss vs. Profit Simulator
          </h3>
          <p className="roi-subtext">
            Simulate financial returns across <strong>No Action</strong>, <strong>Precision Chemical Control</strong>, and <strong>Certified Organic Bio-Control</strong>.
          </p>
        </div>
      </div>

      {/* Simulator Sliders Control Grid */}
      <div className="roi-controls-grid">
        <div className="roi-control-field">
          <div className="roi-field-header">
            <label>Field Acreage</label>
            <span className="roi-field-val">{acreage} Acres</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={acreage}
            onChange={(e) => setAcreage(Number(e.target.value))}
          />
        </div>

        <div className="roi-control-field">
          <div className="roi-field-header">
            <label>Market Price (per kg)</label>
            <span className="roi-field-val">₹{marketPricePerKg} / kg</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={marketPricePerKg}
            onChange={(e) => setMarketPricePerKg(Number(e.target.value))}
          />
        </div>

        <div className="roi-control-field">
          <div className="roi-field-header">
            <label>Diagnosed Pathogen Severity</label>
            <span className="roi-field-val alert">{infectionSeverity}% Canopy Loss</span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            step="5"
            value={infectionSeverity}
            onChange={(e) => setInfectionSeverity(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Comparative Strategy Cards */}
      <div className="roi-strategies-grid">
        {/* Strategy 1: Untreated */}
        <div className="strategy-card untreated">
          <div className="strat-top">
            <span className="strat-badge red">Scenario A</span>
            <h4>No Treatment (Passive Loss)</h4>
          </div>
          <div className="strat-metric-main">
            <span className="strat-main-label">Estimated Net Revenue</span>
            <span className="strat-main-val red">₹{Math.round(untreatedNetProfit).toLocaleString()}</span>
          </div>
          <div className="strat-breakdown">
            <div className="sb-row">
              <span>Crop Destruction:</span>
              <strong className="text-red">-{untreatedYieldLossPct.toFixed(0)}%</strong>
            </div>
            <div className="sb-row">
              <span>Lost Revenue:</span>
              <strong className="text-red">-₹{Math.round(untreatedFinancialLoss).toLocaleString()}</strong>
            </div>
            <div className="sb-row">
              <span>Treatment Cost:</span>
              <strong>₹0</strong>
            </div>
          </div>
          <div className="strat-footer alert">
            ⚠️ Severe financial insolvency risk without intervention.
          </div>
        </div>

        {/* Strategy 2: Chemical Fungicide */}
        <div className="strategy-card chemical recommended">
          <div className="strat-top">
            <span className="strat-badge blue">Scenario B (High ROI)</span>
            <h4>Precision Chemical Control</h4>
          </div>
          <div className="strat-metric-main">
            <span className="strat-main-label">Estimated Net Profit</span>
            <span className="strat-main-val blue">₹{Math.round(chemicalNetProfit).toLocaleString()}</span>
          </div>
          <div className="strat-breakdown">
            <div className="sb-row">
              <span>Protected Yield:</span>
              <strong className="text-green">{chemicalYieldRetentionPct}% Saved</strong>
            </div>
            <div className="sb-row">
              <span>Investment (Spray):</span>
              <strong>₹{chemicalTreatmentCost.toLocaleString()}</strong>
            </div>
            <div className="sb-row highlight">
              <span>Return on Investment (ROI):</span>
              <strong className="text-blue">+{chemicalRoiPct}%</strong>
            </div>
          </div>
          <div className="strat-footer safe">
            ✨ Net savings of <strong>₹{Math.round(chemicalNetGainOverUntreated).toLocaleString()}</strong> over no action.
          </div>
        </div>

        {/* Strategy 3: Bio-Organic Control */}
        <div className="strategy-card organic">
          <div className="strat-top">
            <span className="strat-badge green">Scenario C (Premium)</span>
            <h4>Organic Bio-Pesticide</h4>
          </div>
          <div className="strat-metric-main">
            <span className="strat-main-label">Estimated Net Profit</span>
            <span className="strat-main-val green">₹{Math.round(organicNetProfit).toLocaleString()}</span>
          </div>
          <div className="strat-breakdown">
            <div className="sb-row">
              <span>Organic Premium Price:</span>
              <strong className="text-green">₹{organicMarketPrice.toFixed(1)}/kg (+35%)</strong>
            </div>
            <div className="sb-row">
              <span>Bio-Input Cost:</span>
              <strong>₹{organicTreatmentCost.toLocaleString()}</strong>
            </div>
            <div className="sb-row highlight">
              <span>Return on Investment (ROI):</span>
              <strong className="text-green">+{organicRoiPct}%</strong>
            </div>
          </div>
          <div className="strat-footer organic-note">
            🌿 Maximum profit potential in certified organic export markets.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentRoiSimulator;
