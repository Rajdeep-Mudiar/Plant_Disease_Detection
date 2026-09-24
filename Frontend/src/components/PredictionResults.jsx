import React, { useState } from "react";
import "./PredictionResults.css";
import LesionInspector from "./LesionInspector";
import SpeechVoiceButton from "./SpeechVoiceButton";
import { IconDocument, IconCheck, IconShield, IconRefresh } from "./Icons";

const PredictionResults = ({
  prediction,
  guidance,
  imagePreview,
  onClear,
  onOpenReport,
  getStatusColor,
}) => {
  const [activeTab, setActiveTab] = useState("actions"); // "actions", "chemical", "organic"

  if (!prediction) return null;

  const speechSummary = `Diagnosis: ${prediction.disease}, confidence ${
    prediction.confidence
  } percent. Severity: ${prediction.severity?.level || "evaluated"}. ${
    guidance?.description || ""
  } Recommended action: ${
    Array.isArray(guidance?.tips) ? guidance.tips.join(". ") : ""
  }`;

  const isHealthy = prediction.disease === "Healthy";
  const isLateBlight = prediction.disease === "Late Blight";

  return (
    <div className="meta-results-container">
      <div className="meta-diagnosis-card">
        {/* Header */}
        <div className="diagnosis-card-header">
          <div className="diagnosis-heading-col">
            <div className="diagnosis-badge-row">
              <span className={`diagnosis-status-pill ${isHealthy ? "healthy" : isLateBlight ? "critical" : "warning"}`}>
                <span className="status-dot-indicator"></span>
                <span>{isHealthy ? "Healthy Foliage" : "Pathogen Detected"}</span>
              </span>
              <span className="specimen-id-tag">Potato Leaf</span>
            </div>
            <h2 className="diagnosis-title-text">{prediction.disease}</h2>
          </div>

          <div className="confidence-metric-pill">
            <span className="confidence-num">{prediction.confidence}%</span>
            <span className="confidence-sub">Confidence</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="diagnosis-actions-toolbar">
          <SpeechVoiceButton textToRead={speechSummary} />

          <button
            type="button"
            className="generate-report-btn"
            onClick={onOpenReport}
          >
            <IconDocument size={15} />
            <span>Generate Field Certificate</span>
          </button>
        </div>

        {/* Confidence Progress */}
        <div className="accuracy-meter-block">
          <div className="meter-label-row">
            <span className="meter-title">Neural Classification Confidence</span>
            <span className="meter-percent">{prediction.confidence}%</span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{
                width: `${prediction.confidence}%`,
                backgroundColor: getStatusColor(prediction.disease),
              }}
            ></div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="probability-breakdown-section">
          <h4 className="breakdown-heading">Class Probability Distribution</h4>
          <div className="breakdown-list">
            {Object.entries(prediction.all_predictions || {}).map(
              ([className, score]) => (
                <div key={className} className="breakdown-row">
                  <div className="breakdown-labels">
                    <span className="class-label">{className}</span>
                    <span className="class-score">{(score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mini-meter-track">
                    <div
                      className="mini-meter-fill"
                      style={{
                        width: `${score * 100}%`,
                        backgroundColor:
                          className === prediction.disease
                            ? getStatusColor(prediction.disease)
                            : "#cbd5e1",
                      }}
                    ></div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Explainable AI Lesion Inspector */}
        <LesionInspector
          imageSrc={imagePreview}
          prediction={prediction}
          severity={prediction.severity}
        />

        {/* Treatment Protocol Tabs */}
        <div className="treatment-protocol-card">
          <div className="treatment-nav-tabs">
            <button
              type="button"
              className={`protocol-tab ${activeTab === "actions" ? "active" : ""}`}
              onClick={() => setActiveTab("actions")}
            >
              Recommended Actions
            </button>
            <button
              type="button"
              className={`protocol-tab ${activeTab === "chemical" ? "active" : ""}`}
              onClick={() => setActiveTab("chemical")}
            >
              Chemical Treatments
            </button>
            <button
              type="button"
              className={`protocol-tab ${activeTab === "organic" ? "active" : ""}`}
              onClick={() => setActiveTab("organic")}
            >
              Organic Remedies
            </button>
          </div>

          <div className="treatment-content-body">
            {activeTab === "actions" && (
              <ul className="protocol-checklist">
                {Array.isArray(guidance?.tips) ? (
                  guidance.tips.map((tip, idx) => (
                    <li key={idx} className="protocol-item">
                      <IconCheck size={16} className="check-icon-svg" />
                      <span>{tip}</span>
                    </li>
                  ))
                ) : (
                  <li className="protocol-item">
                    <span>No specific actions needed.</span>
                  </li>
                )}
              </ul>
            )}

            {activeTab === "chemical" && (
              <ul className="protocol-checklist">
                {Array.isArray(guidance?.chemical_treatments) ? (
                  guidance.chemical_treatments.map((chem, idx) => (
                    <li key={idx} className="protocol-item">
                      <IconShield size={16} className="shield-icon-svg" />
                      <span>{chem}</span>
                    </li>
                  ))
                ) : (
                  <li className="protocol-item">
                    <span>No synthetic chemical fungicides required.</span>
                  </li>
                )}
              </ul>
            )}

            {activeTab === "organic" && (
              <ul className="protocol-checklist">
                {Array.isArray(guidance?.organic_remedies) ? (
                  guidance.organic_remedies.map((org, idx) => (
                    <li key={idx} className="protocol-item">
                      <IconCheck size={16} className="check-icon-svg green" />
                      <span>{org}</span>
                    </li>
                  ))
                ) : (
                  <li className="protocol-item">
                    <span>Maintain standard biological and compost foliar routine.</span>
                  </li>
                )}
              </ul>
            )}

            {guidance?.recommended_dosage && (
              <div className="dosage-guideline-box">
                <strong>Standard Dosage:</strong> {guidance.recommended_dosage}
              </div>
            )}
          </div>
        </div>
      </div>

      <button type="button" className="scan-new-leaf-btn" onClick={onClear}>
        <IconRefresh size={16} />
        <span>Scan Another Specimen</span>
      </button>
    </div>
  );
};

export default PredictionResults;
