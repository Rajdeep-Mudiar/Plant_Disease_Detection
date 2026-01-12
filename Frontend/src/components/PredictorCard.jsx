import React, { useState, useRef, useEffect } from "react";
import "./PredictorCard.css";

// Vite uses import.meta.env for env vars. Expect VITE_API_URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PredictorCard = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [guidance, setGuidance] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    const pingBackend = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBackendOnline(true);
        setBackendMessage(`Backend OK • TF ${data.tensorflow_version}`);
      } catch (e) {
        setBackendOnline(false);
        setBackendMessage("Backend unreachable. Start API at port 5000.");
      }
    };
    pingBackend();
  }, []);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);

      // Reset prediction
      setPrediction(null);
      setGuidance(null);
      setError(null);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPrediction(data.prediction);
        setGuidance(data.guidance || null);
      } else {
        setError(data.error || "Failed to get prediction");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setPrediction(null);
    setGuidance(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusColor = (disease) => {
    switch (disease) {
      case "Healthy":
        return "#4CAF50"; // Green
      case "Early Blight":
        return "#FF9800"; // Orange
      case "Late Blight":
        return "#F44336"; // Red
      default:
        return "#2196F3"; // Blue
    }
  };

  const getStatusEmoji = (disease) => {
    switch (disease) {
      case "Healthy":
        return "🟢";
      case "Early Blight":
        return "🟠";
      case "Late Blight":
        return "🔴";
      default:
        return "❓";
    }
  };

  return (
    <div className="predictor-container">
      <div className="predictor-card">
        <h1>🌱 Plant Disease Detector</h1>
        <p className="subtitle">
          Upload a potato leaf image to detect diseases
        </p>

        {/* Image Upload Section */}
        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
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
              <button className="clear-button" onClick={handleClear}>
                Clear Image
              </button>
            </div>
          )}
        </div>

        {/* Predict Button */}
        {!backendOnline && (
          <div className="error-message">
            <span>❌ {backendMessage}</span>
          </div>
        )}

        {image && backendOnline && (
          <button
            className="predict-button"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? "Analyzing... ⏳" : "Predict Disease 🔍"}
          </button>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
          </div>
        )}

        {/* Prediction Results */}
        {prediction && (
          <div className="results-section">
            <div
              className="prediction-result"
              style={{ borderLeftColor: getStatusColor(prediction.disease) }}
            >
              <div className="disease-header">
                <span className="status-emoji">
                  {getStatusEmoji(prediction.disease)}
                </span>
                <h2 className="disease-name">{prediction.disease}</h2>
              </div>

              {guidance && guidance.status && (
                <p className="subtitle" style={{ marginTop: "6px" }}>
                  {guidance.status}
                </p>
              )}

              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${prediction.confidence}%` }}
                >
                  <span className="confidence-text">
                    {prediction.confidence}%
                  </span>
                </div>
              </div>

              {/* All Predictions */}
              <div className="all-predictions">
                <h3>All Predictions:</h3>
                <div className="predictions-list">
                  {Object.entries(prediction.all_predictions).map(
                    ([className, score]) => (
                      <div key={className} className="prediction-item">
                        <span className="class-name">{className}</span>
                        <div className="mini-bar">
                          <div
                            className="mini-fill"
                            style={{ width: `${score * 100}%` }}
                          ></div>
                        </div>
                        <span className="score">
                          {(score * 100).toFixed(2)}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="tips-section">
                <h3>💡 Recommendations:</h3>
                <ul className="tips-list">
                  {Array.isArray(guidance?.tips) ? (
                    guidance.tips.map((tip, idx) => <li key={idx}>{tip}</li>)
                  ) : (
                    <li>No recommendations available</li>
                  )}
                </ul>
              </div>
            </div>

            <button className="new-prediction-button" onClick={handleClear}>
              Try Another Image
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Analyzing image...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictorCard;
