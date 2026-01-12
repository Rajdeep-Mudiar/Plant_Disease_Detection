import React from "react";

const PredictButton = ({ show, loading, onPredict }) => {
  if (!show) return null;

  return (
    <button className="predict-button" onClick={onPredict} disabled={loading}>
      {loading ? "Analyzing... ⏳" : "Predict Disease 🔍"}
    </button>
  );
};

export default PredictButton;
