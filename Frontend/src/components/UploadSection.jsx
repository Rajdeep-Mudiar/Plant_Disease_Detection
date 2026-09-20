import React, { useState } from "react";
import "./UploadSection.css";

const UploadSection = ({ preview, fileInputRef, onSelect, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
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
        <label
          htmlFor="imageInput"
          className={`upload-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon-wrapper">
            <svg
              className="upload-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div className="upload-text">
            <p className="upload-title">Upload a clear potato leaf image</p>
            <p className="upload-hint">JPG, JPEG or PNG</p>
          </div>
        </label>
      ) : (
        <div className="preview-section">
          <div className="preview-image-container">
            <img src={preview} alt="Potato Leaf Preview" className="preview-image" />
          </div>
          <button type="button" className="clear-button" onClick={onClear}>
            Clear Image
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadSection;

