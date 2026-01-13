import React from "react";
import "./UploadSection.css";

const UploadSection = ({ preview, fileInputRef, onSelect, onClear }) => (
  <div className="upload-section">
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={onSelect}
      id="imageInput"
      style={{ display: "none" }}
    />

    {!preview ? (
      <label htmlFor="imageInput" className="upload-area">
        <div className="upload-icon">📸</div>
        <div className="upload-text">
          <p className="upload-title">Click to upload or drag and drop</p>
          <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
        </div>
      </label>
    ) : (
      <div className="preview-section">
        <img src={preview} alt="Preview" className="preview-image" />
        <button className="clear-button" onClick={onClear}>
          Clear Image
        </button>
      </div>
    )}
  </div>
);

export default UploadSection;
