import React, { useState, useRef, useEffect } from "react";
import "./PredictorCard.css";
import BackendStatus from "./BackendStatus";
import ErrorAlert from "./ErrorAlert";
import Header from "./Header";
import LoadingState from "./LoadingState";
import PredictButton from "./PredictButton";
import PredictionResults from "./PredictionResults";
import UploadSection from "./UploadSection";
import CameraCaptureModal from "./CameraCaptureModal";
import DiagnosticReportModal from "./DiagnosticReportModal";
import WeatherRiskCard from "./WeatherRiskCard";
import DosageCalculator from "./DosageCalculator";
import CropEncyclopedia from "./CropEncyclopedia";
import ScanHistory from "./ScanHistory";
import AgronomistChat from "./AgronomistChat";

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

  // Modals state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [lastScanRecord, setLastScanRecord] = useState(null);

  const fileInputRef = useRef(null);

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

  const handleCameraCapture = (file, dataUrl) => {
    setImage(file);
    setPreview(dataUrl);
    setPrediction(null);
    setGuidance(null);
    setError(null);
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please select or capture a leaf photo first");
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
        setLastScanRecord({
          prediction: data.prediction,
          guidance: data.guidance,
          preview: preview,
        });
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

  const handleSelectHistoryItem = (item) => {
    setPrediction({
      disease: item.disease,
      confidence: item.confidence,
      severity: item.severity,
      all_predictions: {
        [item.disease]: item.confidence / 100,
      },
    });
    setGuidance(item.guidance);
    if (item.preview) {
      setPreview(item.preview);
    }
    // Scroll to detect view
    document.getElementById("detect")?.scrollIntoView({ behavior: "smooth" });
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
        {/* Main AI Diagnostic Card */}
        <div className="predictor-card">
          <Header />

          <div id="detect" className="section-block">
            <UploadSection
              preview={preview}
              fileInputRef={fileInputRef}
              onSelect={handleImageSelect}
              onClear={handleClear}
              onOpenCamera={() => setIsCameraOpen(true)}
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
              imagePreview={preview}
              onClear={handleClear}
              onOpenReport={() => setIsReportOpen(true)}
              getStatusColor={getStatusColor}
              getStatusEmoji={getStatusEmoji}
            />
            <LoadingState loading={loading} />
          </div>
        </div>

        {/* Feature 3: Real-Time Weather & Blight Outbreak Radar */}
        <WeatherRiskCard />

        {/* Feature 5 Part 1: Farm Dosage & Sprayer Tank Calculator */}
        <DosageCalculator />

        {/* Feature 5 Part 2: Multi-Crop Disease Encyclopedia */}
        <CropEncyclopedia />

        {/* Feature 4: Field Scan History & Journal */}
        <ScanHistory
          onSelectHistoryItem={handleSelectHistoryItem}
          currentScan={lastScanRecord}
        />

        {/* About Section Card */}
        <div id="about" className="info-card">
          <h3 className="info-card-title">About AgroAI Platform</h3>
          <p className="info-card-text">
            Plant Disease Detector provides real-time, AI-assisted foliar pathology analysis for potato and vegetable crops.
            Integrated with neural explainability heatmaps, microclimate infection radars, automated knapsack dosage calculators, and instant voice-guided agronomic advisories.
          </p>
        </div>
      </div>

      {/* Feature 1: Live Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Feature 4: Printable / PDF Diagnostic Report Certificate */}
      <DiagnosticReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        prediction={prediction}
        guidance={guidance}
        imagePreview={preview}
      />

      {/* Feature 2: Interactive AI Agronomist Chatbot */}
      <AgronomistChat
        currentDiagnosis={prediction}
        apiBaseUrl={API_BASE_URL}
      />
    </div>
  );
};

export default PredictorCard;
