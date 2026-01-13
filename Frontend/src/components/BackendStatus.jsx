import React from "react";
import "./BackendStatus.css";

const BackendStatus = ({ online, message }) => {
  if (online) return null;

  return (
    <div className="backend-status-container">
      <div className="backend-error-message">
        <span>❌ {message}</span>
      </div>
    </div>
  );
};

export default BackendStatus;
