import React from "react";
import "./ErrorAlert.css";

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-alert-container">
      <div className="error-alert-message">
        <span>❌ {message}</span>
      </div>
    </div>
  );
};

export default ErrorAlert;
