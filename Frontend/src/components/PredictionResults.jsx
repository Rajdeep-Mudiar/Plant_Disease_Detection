import React from "react";
import "./PredictionResults.css";

const PredictionResults = ({
  prediction,
  guidance,
  onClear,
  getStatusColor,
  getStatusEmoji,
}) => {
  if (!prediction) return null;

  return (
    <div className="results-section">
      <div
        className="prediction-result"
        style={{ borderTopColor: getStatusColor(prediction.disease) }}
      >
        <div className="result-main-header">
          <div className="disease-title-box">
            <span className="status-emoji">
              {getStatusEmoji(prediction.disease)}
            </span>
            <div>
              <p className="result-label">Diagnosis</p>
              <h2 className="disease-name">{prediction.disease}</h2>
            </div>
          </div>
          <div className="confidence-badge">
            <span className="confidence-value">{prediction.confidence}%</span>
            <span className="confidence-label">Confidence</span>
          </div>
        </div>

        {guidance && guidance.status && (
          <div className="status-banner">
            <span className="banner-text">{guidance.status}</span>
          </div>
        )}

        <div className="confidence-bar-container">
          <div className="confidence-bar-header">
            <span className="bar-title">Match Accuracy</span>
            <span className="bar-percentage">{prediction.confidence}%</span>
          </div>
          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{
                width: `${prediction.confidence}%`,
                backgroundColor: getStatusColor(prediction.disease),
              }}
            ></div>
          </div>
        </div>

        <div className="all-predictions">
          <h3 className="section-subtitle">Prediction Breakdown</h3>
          <div className="predictions-list">
            {Object.entries(prediction.all_predictions).map(
              ([className, score]) => (
                <div key={className} className="prediction-item">
                  <div className="item-label-group">
                    <span className="class-name">{className}</span>
                    <span className="score">{(score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mini-bar">
                    <div
                      className="mini-fill"
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="recommendations-card">
          <h3 className="recommendations-title">
            <svg
              className="check-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Recommended Actions
          </h3>
          <ul className="checklist">
            {Array.isArray(guidance?.tips) ? (
              guidance.tips.map((tip, idx) => (
                <li key={idx} className="checklist-item">
                  <span className="check-bullet">✓</span>
                  <span className="tip-text">{tip}</span>
                </li>
              ))
            ) : (
              <li className="checklist-item">
                <span className="tip-text">No recommendations available</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <button type="button" className="try-another-button" onClick={onClear}>
        Try Another Image
      </button>
    </div>
  );
};

export default PredictionResults;

