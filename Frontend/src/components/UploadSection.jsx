import React, { useState } from "react";
import "./UploadSection.css";
import { IconUpload, IconCamera } from "./Icons";
import { generateSampleLeafDataUrl, sampleSpecimensList } from "../utils/sampleImages";

const UploadSection = ({ preview, fileInputRef, onSelect, onClear, onOpenCamera }) => {
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

  const handleLoadSample = (sampleType) => {
    const dataUrl = generateSampleLeafDataUrl(sampleType);
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `specimen_${sampleType}.jpg`, {
          type: "image/jpeg",
        });
        onSelect({ target: { files: [file] } });
      });
  };

  return (
    <div className="upload-container-block">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onSelect}
        id="imageInput"
        style={{ display: "none" }}
      />

      {!preview ? (
        <div className="upload-interactive-wrapper">
          <label
            htmlFor="imageInput"
            className={`dropzone-surface ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="dropzone-icon-circle">
              <IconUpload size={22} />
            </div>
            <div className="dropzone-text-group">
              <p className="dropzone-primary-text">Select potato leaf photo to upload</p>
              <p className="dropzone-secondary-text">or drag and drop file here (JPG, JPEG, PNG)</p>
            </div>
            <button
              type="button"
              className="dropzone-browse-button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select From Computer
            </button>
          </label>

          <div className="or-separator-line">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="camera-action-trigger"
            onClick={onOpenCamera}
          >
            <IconCamera size={18} />
            <span>Open Camera Scanner</span>
          </button>

          {/* Interactive 1-Click Sample Specimen Selector */}
          <div className="sample-specimen-tray">
            <span className="sample-tray-label">Try interactive demo leaf specimens:</span>
            <div className="sample-specimen-buttons-row">
              {sampleSpecimensList.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  className={`sample-pill-btn ${sample.badgeClass}`}
                  onClick={() => handleLoadSample(sample.type)}
                >
                  <span className="sample-dot"></span>
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="preview-display-card">
          <div className="preview-viewport-frame">
            <img src={preview} alt="Leaf Specimen" className="preview-rendered-img" />
          </div>
          <button type="button" className="remove-specimen-btn" onClick={onClear}>
            Remove Photo
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
