import React from "react";
import "./LoadingState.css";

const LoadingState = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Analyzing image...</p>
    </div>
  );
};

export default LoadingState;
