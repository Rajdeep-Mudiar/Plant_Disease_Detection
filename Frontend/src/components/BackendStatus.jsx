import React from "react";

const BackendStatus = ({ online, message }) => {
  if (online) return null;

  return (
    <div className="error-message">
      <span>❌ {message}</span>
    </div>
  );
};

export default BackendStatus;
