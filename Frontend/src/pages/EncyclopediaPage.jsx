import React from "react";
import "./EncyclopediaPage.css";
import CropEncyclopedia from "../components/CropEncyclopedia";
import { IconBook } from "../components/Icons";

const EncyclopediaPage = ({ onNavigateToScanner }) => {
  return (
    <div className="meta-encyclopedia-container">
      <div className="encyclopedia-banner-card">
        <div className="encyclopedia-title-row">
          <div className="encyclopedia-icon-box">
            <IconBook size={22} />
          </div>
          <div>
            <h1 className="encyclopedia-main-title">Multi-Crop Plant Pathology Library</h1>
            <p className="encyclopedia-sub-title">
              Diagnostic symptom checklists, pathogen biology, environmental triggers, and Integrated Pest Management (IPM) protocols.
            </p>
          </div>
        </div>
      </div>

      <div className="encyclopedia-content-area">
        <CropEncyclopedia onNavigateToScanner={onNavigateToScanner} />
      </div>
    </div>
  );
};

export default EncyclopediaPage;
