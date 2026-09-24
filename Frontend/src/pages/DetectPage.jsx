import React, { useRef, useState } from "react";
import "./DetectPage.css";
import UploadSection from "../components/UploadSection";
import BackendStatus from "../components/BackendStatus";
import PredictButton from "../components/PredictButton";
import ErrorAlert from "../components/ErrorAlert";
import PredictionResults from "../components/PredictionResults";
import LoadingState from "../components/LoadingState";
import CameraCaptureModal from "../components/CameraCaptureModal";
import DiagnosticReportModal from "../components/DiagnosticReportModal";
import CropSelector from "../components/CropSelector";
import { IconScanner } from "../components/Icons";

const DetectPage = ({
  image,
  preview,
  loading,
  prediction,
  guidance,
  error,
  backendOnline,
  backendMessage,
  onImageSelect,
  onClear,
  onPredict,
  onCameraCapture,
}) => {
  const [selectedCrop, setSelectedCrop] = useState("potato");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const fileInputRef = useRef(null);

  const getStatusColor = (disease) => {
    switch (disease) {
      case "Healthy":
        return "#16a34a"; // Green
      case "Early Blight":
        return "#d97706"; // Amber
      case "Late Blight":
        return "#dc2626"; // Red
      default:
        return "#2563eb"; // Blue
    }
  };

  return (
    <div className="meta-detect-container">
      <div className="detect-banner-card">
        <div className="detect-title-row">
          <div className="detect-icon-box">
            <IconScanner size={22} />
          </div>
          <div>
            <h1 className="detect-main-title">AI Leaf Disease Scanner</h1>
            <p className="detect-sub-title">
              Upload or capture a leaf photo to diagnose pathogen infections and access targeted treatment prescriptions.
            </p>
          </div>
        </div>
      </div>

      <div className="detect-workspace-card">
        <CropSelector selectedCrop={selectedCrop} onSelectCrop={setSelectedCrop} />

        <UploadSection
          preview={preview}
          fileInputRef={fileInputRef}
          onSelect={onImageSelect}
          onClear={onClear}
          onOpenCamera={() => setIsCameraOpen(true)}
        />

        <BackendStatus online={backendOnline} message={backendMessage} />

        <PredictButton
          show={Boolean(image) && backendOnline}
          loading={loading}
          onPredict={onPredict}
        />

        <ErrorAlert message={error} />

        <PredictionResults
          prediction={prediction}
          guidance={guidance}
          imagePreview={preview}
          onClear={onClear}
          onOpenReport={() => setIsReportOpen(true)}
          getStatusColor={getStatusColor}
        />

        <LoadingState loading={loading} />
      </div>

      {/* Live Camera Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={onCameraCapture}
      />

      {/* Diagnostic PDF Certificate Modal */}
      <DiagnosticReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        prediction={prediction}
        guidance={guidance}
        imagePreview={preview}
      />
    </div>
  );
};

export default DetectPage;
