import React, { useState, useRef, useEffect } from "react";
import "./PredictorCard.css";
import BackendStatus from "./BackendStatus";
import ErrorAlert from "./ErrorAlert";
import Header from "./Header";
import LoadingState from "./LoadingState";
import PredictButton from "./PredictButton";
import PredictionResults from "./PredictionResults";
import UploadSection from "./UploadSection";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
        setBackendMessage(`Backend Online • TensorFlow ${data.tensorflow_version}`);
      } catch (e) {
        setBackendOnline(false);
        setBackendMessage("Backend unreachable. Ensure API is running on port 5001.");
      }
    };
    pingBackend();
  }, []);

  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
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
        return "#2E7D32"; // Green
      case "Early Blight":
        return "#F59E0B"; // Warm Amber
      case "Late Blight":
        return "#DC2626"; // Red
      default:
        return "#2563EB"; // Blue
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
      <div className="predictor-wrapper">
        <div className="predictor-card">
          <Header />
          
          <div id="detect" className="section-block">
            <UploadSection
              preview={preview}
              fileInputRef={fileInputRef}
              onSelect={handleImageSelect}
              onClear={handleClear}
            />
            <BackendStatus online={backendOnline} message={backendMessage} />
            <PredictButton
              show={Boolean(image) && backendOnline}
              loading={loading}
              onPredict={handlePredict}
            />
            <ErrorAlert message={error} />
            <PredictionResults
              prediction={prediction}
              guidance={guidance}
              onClear={handleClear}
              getStatusColor={getStatusColor}
              getStatusEmoji={getStatusEmoji}
            />
            <LoadingState loading={loading} />
          </div>
        </div>

        {/* Diseases Reference Card */}
        <div id="diseases" className="info-card">
          <h3 className="info-card-title">Supported Leaf Diagnoses</h3>
          <div className="diseases-grid">
            <div className="disease-info-item">
              <span className="disease-badge healthy">🟢 Healthy</span>
              <p>Leaves display uniform green coloration with no visible lesion spots or decay.</p>
            </div>
            <div className="disease-info-item">
              <span className="disease-badge early">🟠 Early Blight</span>
              <p>Characterized by concentric dark brown spots forming target-like rings on older foliage.</p>
            </div>
            <div className="disease-info-item">
              <span className="disease-badge late">🔴 Late Blight</span>
              <p>Urgent fungal condition causing water-soaked dark lesions and rapid leaf wilt.</p>
            </div>
          </div>
        </div>

        {/* About Section Card */}
        <div id="about" className="info-card">
          <h3 className="info-card-title">About This Tool</h3>
          <p className="info-card-text">
            Plant Disease Detector provides instant, AI-assisted analysis for potato crop leaf health.
            Upload a clear photo of a potato leaf to evaluate condition accuracy and access targeted care recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictorCard;

