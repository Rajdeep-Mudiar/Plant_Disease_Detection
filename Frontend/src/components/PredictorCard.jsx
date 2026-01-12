import React, { useState, useRef, useEffect } from "react";
import "./PredictorCard.css";
import BackendStatus from "./BackendStatus";
import ErrorAlert from "./ErrorAlert";
import Header from "./Header";
import LoadingState from "./LoadingState";
import PredictButton from "./PredictButton";
import PredictionResults from "./PredictionResults";
import UploadSection from "./UploadSection";

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
        <Header />
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
  );
};

export default PredictorCard;
