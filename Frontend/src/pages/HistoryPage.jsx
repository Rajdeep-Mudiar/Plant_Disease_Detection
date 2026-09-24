import React from "react";
import "./HistoryPage.css";
import ScanHistory from "../components/ScanHistory";
import { IconHistory } from "../components/Icons";

const HistoryPage = ({ onSelectHistoryItem, currentScan, onNavigate }) => {
  const handleReloadAndNavigate = (item) => {
    onSelectHistoryItem(item);
    onNavigate("detect");
  };

  return (
    <div className="meta-history-container">
      <div className="history-banner-card">
        <div className="history-title-row">
          <div className="history-icon-box">
            <IconHistory size={22} />
          </div>
          <div>
            <h1 className="history-main-title">Field Scan Journal & History</h1>
            <p className="history-sub-title">
              Complete archive of past specimen scans, confidence scores, lesion severity percentages, and treatment prescriptions.
            </p>
          </div>
        </div>
      </div>

      <div className="history-content-area">
        <ScanHistory
          onSelectHistoryItem={handleReloadAndNavigate}
          currentScan={currentScan}
        />
      </div>
    </div>
  );
};

export default HistoryPage;
