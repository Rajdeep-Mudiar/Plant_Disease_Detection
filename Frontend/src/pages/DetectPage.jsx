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
import LiveVideoArScanner from "../components/LiveVideoArScanner";
import CropInsuranceAssessor from "../components/CropInsuranceAssessor";
import AgriDealerLocator from "../components/AgriDealerLocator";
import AiModelConsensus from "../components/AiModelConsensus";
import { IconScanner, IconCamera, IconSparkles } from "../components/Icons";

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
  const [isArScannerOpen, setIsArScannerOpen] = useState(false);
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

        {/* Live AR Scanner Button */}
        <button
          type="button"
          className="launch-ar-mode-btn"
          onClick={() => setIsArScannerOpen(true)}
        >
          <IconSparkles size={16} />
          <span>Launch Live 30 FPS AR Video Scanner</span>
        </button>
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

        {/* Feature: Multi-Model Ensemble Second Opinion Consensus */}
        <AiModelConsensus prediction={prediction} />

        {/* Economic Yield Loss & Insurance Risk Assessor */}
        <CropInsuranceAssessor
          prediction={prediction}
          cropType={selectedCrop}
        />

        {/* Feature: Verified Local Agrochemical & Organic Dealer Locator */}
        <AgriDealerLocator defaultCrop={selectedCrop} />

        <LoadingState loading={loading} />
      </div>

      {/* Live Video AR Scanner Modal */}
      {isArScannerOpen && (
        <LiveVideoArScanner
          onClose={() => setIsArScannerOpen(false)}
          onCaptureSpecimen={(file, dataUrl) => {
            setIsArScannerOpen(false);
            if (onCameraCapture) {
              onCameraCapture(file, dataUrl);
            }
          }}
        />
      )}

      {/* Snapshot Camera Modal */}
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
