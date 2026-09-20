import React from "react";
import "./PredictButton.css";

const PredictButton = ({ show, loading, onPredict }) => {
  if (!show) return null;

  return (
    <div className="predict-button-container">
      <button className="predict-button" onClick={onPredict} disabled={loading}>
        {loading ? "Analyzing... ⏳" : "Analyze Leaf"}
      </button>
    </div>
  );
};

export default PredictButton;

