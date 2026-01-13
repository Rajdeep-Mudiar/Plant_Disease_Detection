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
        style={{ borderLeftColor: getStatusColor(prediction.disease) }}
      >
        <div className="disease-header">
          <span className="status-emoji">
            {getStatusEmoji(prediction.disease)}
          </span>
          <h2 className="disease-name">{prediction.disease}</h2>
        </div>

        {guidance && guidance.status && (
          <p className="subtitle" style={{ marginTop: "6px" }}>
            {guidance.status}
          </p>
        )}

        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{ width: `${prediction.confidence}%` }}
          >
            <span className="confidence-text">{prediction.confidence}%</span>
          </div>
        </div>

        <div className="all-predictions">
          <h3>All Predictions:</h3>
          <div className="predictions-list">
            {Object.entries(prediction.all_predictions).map(
              ([className, score]) => (
                <div key={className} className="prediction-item">
                  <span className="class-name">{className}</span>
                  <div className="mini-bar">
                    <div
                      className="mini-fill"
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                  <span className="score">{(score * 100).toFixed(2)}%</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="tips-section">
          <h3>💡 Recommendations:</h3>
          <ul className="tips-list">
            {Array.isArray(guidance?.tips) ? (
              guidance.tips.map((tip, idx) => <li key={idx}>{tip}</li>)
            ) : (
              <li>No recommendations available</li>
            )}
          </ul>
        </div>
      </div>

      <button className="new-prediction-button" onClick={onClear}>
        Try Another Image
      </button>
    </div>
  );
};

export default PredictionResults;
