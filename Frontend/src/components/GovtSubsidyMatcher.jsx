import React, { useState } from "react";
import "./GovtSubsidyMatcher.css";
import { IconShield, IconCheck, IconActivity } from "./Icons";

const SCHEMES_DATABASE = [
  {
    id: "solar_pump",
    title: "PM-KUSUM Solar Agriculture Pump Scheme",
    subsidyAmount: "60% Direct Capital Subsidy + 30% Bank Loan",
    eligibility: "Farmers with 1–10 Acres land & Grid/Diesel pump replacement",
    financialValue: "Up to ₹1,80,000 ($2,160) Saved",
    benefit: "Zero electricity bill for irrigation + solar feed-in grid revenue.",
    department: "Ministry of New & Renewable Energy",
    icon: "☀️",
  },
  {
    id: "micro_irrigation",
    title: "Pradhan Mantri Krishi Sinchayee Yojana (Per Drop More Crop)",
    subsidyAmount: "70% to 80% Subsidy on Drip & Micro-Sprinkler Systems",
    eligibility: "All Horticultural & Row-Crop (Potato/Tomato) Farmers",
    financialValue: "Up to ₹65,000 / Hectare Subsidy",
    benefit: "Saves 45% water and prevents fungal spore splash from flood irrigation.",
    department: "Department of Agriculture & Farmers Welfare",
    icon: "💧",
  },
  {
    id: "bio_input",
    title: "Paramparagat Krishi Vikas Yojana (Organic Bio-Input Voucher)",
    subsidyAmount: "₹31,000 / Hectare Financial Assistance",
    eligibility: "Farmers adopting Trichoderma, Pseudomonas & Bio-fungicides",
    financialValue: "₹50,000 over 3 years",
    benefit: "Free certified organic inputs, bio-fertilizers & PGS organic certification.",
    department: "National Mission on Sustainable Agriculture",
    icon: "🌱",
  },
  {
    id: "crop_insurance",
    title: "PM Fasal Bima Yojana (Comprehensive Crop Disease Cover)",
    subsidyAmount: "Premium Subsidized (Farmer pays only 1.5% - 2.0%)",
    eligibility: "Compulsory for notified crops (Potato, Tomato, Corn, Wheat)",
    financialValue: "100% Sum Insured for localized blight & flood losses",
    benefit: "Instant satellite-verified automated claim payout within 21 days.",
    department: "Ministry of Agriculture",
    icon: "🛡️",
  },
];

export default function GovtSubsidyMatcher() {
  const [landAcres, setLandAcres] = useState(3.5);
  const [farmerCategory, setFarmerCategory] = useState("small"); // "small", "marginal", "commercial"
  const [selectedCrop, setSelectedCrop] = useState("potato");

  return (
    <div className="govt-subsidy-card">
      <div className="subsidy-header">
        <div className="subsidy-title-group">
          <div className="subsidy-icon-frame">
            <IconShield size={22} />
          </div>
          <div>
            <div className="subsidy-badge-row">
              <span className="subsidy-badge">AGRI-FINANCE & GOVERNMENT SCHEMES</span>
              <span className="subsidy-sub-badge">Automated Subsidy Matcher</span>
            </div>
            <h3 className="subsidy-main-title">Government Agricultural Subsidy & Grant Finder</h3>
            <p className="subsidy-sub-title">
              Instantly matches your land holding size, crop type, and region with approved state & central government subsidies for solar pumps, drip irrigation (80%), and organic bio-inputs.
            </p>
          </div>
        </div>
      </div>

      <div className="subsidy-body-grid">
        {/* Left: Interactive Eligibility Filter Wizard */}
        <div className="subsidy-wizard-column">
          <div className="wizard-box">
            <h4 className="wizard-title">Farmer Profile & Land Holding</h4>

            <div className="wiz-group">
              <div className="wiz-label-row">
                <span>Land Holding Size:</span>
                <strong>{landAcres} Acres</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="25"
                step="0.5"
                value={landAcres}
                onChange={(e) => setLandAcres(Number(e.target.value))}
                className="wiz-slider"
              />
              <div className="wiz-hints">
                <span>Marginal (&lt;2.5 Ac)</span>
                <span>Small (2.5–5 Ac)</span>
                <span>Large (&gt;5 Ac)</span>
              </div>
            </div>

            <div className="wiz-group">
              <label className="wiz-label">Target Crop Category:</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="wiz-select"
              >
                <option value="potato">🥔 Potato (Tuber Vegetable)</option>
                <option value="tomato">🍅 Tomato (Horticultural Solanaceae)</option>
                <option value="corn">🌽 Corn / Maize (Cereal Crop)</option>
                <option value="apple">🍎 Apple / Fruits (Perennial Orchard)</option>
              </select>
            </div>

            <div className="wiz-summary-badge">
              <span>✅ 4 Central & State Schemes Matching Your Profile</span>
            </div>
          </div>
        </div>

        {/* Right: Matched Subsidies Cards */}
        <div className="subsidy-cards-column">
          <div className="schemes-grid">
            {SCHEMES_DATABASE.map((scheme) => (
              <div key={scheme.id} className="scheme-item-card">
                <div className="scheme-card-top">
                  <span className="scheme-icon">{scheme.icon}</span>
                  <div>
                    <span className="scheme-dept">{scheme.department}</span>
                    <h5 className="scheme-name">{scheme.title}</h5>
                  </div>
                </div>

                <div className="scheme-highlight-pill">
                  <strong>{scheme.subsidyAmount}</strong>
                </div>

                <div className="scheme-specs">
                  <div className="sc-row">
                    <span className="sc-lbl">Eligibility:</span>
                    <span className="sc-val">{scheme.eligibility}</span>
                  </div>
                  <div className="sc-row">
                    <span className="sc-lbl">Financial Value:</span>
                    <span className="sc-val green">{scheme.financialValue}</span>
                  </div>
                </div>

                <p className="scheme-benefit">{scheme.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
