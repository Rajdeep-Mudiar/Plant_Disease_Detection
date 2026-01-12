import React from "react";

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-message">
      <span>❌ {message}</span>
    </div>
  );
};

export default ErrorAlert;
