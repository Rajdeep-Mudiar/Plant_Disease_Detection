import React, { useRef } from "react";
import "./DiagnosticReportModal.css";
import { IconDocument, IconClose, IconPlant, IconCheck } from "./Icons";

const DiagnosticReportModal = ({
  isOpen,
  onClose,
  prediction,
  guidance,
  imagePreview,
}) => {
  const reportRef = useRef(null);

  if (!isOpen || !prediction) return null;

  const handlePrint = () => {
    window.print();
  };

  const reportId = `REP-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="meta-modal-overlay" onClick={onClose}>
      <div
        className="meta-report-window"
        onClick={(e) => e.stopPropagation()}
        ref={reportRef}
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="report-action-header no-print">
          <button className="report-print-btn" onClick={handlePrint}>
            <IconDocument size={16} />
            <span>Print / Save as PDF</span>
          </button>
          <button className="report-dismiss-btn" onClick={onClose}>
            <IconClose size={16} />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="official-cert-body">
          {/* Header */}
          <div className="cert-top-bar">
            <div className="cert-brand-wrap">
              <div className="cert-icon-square">
                <IconPlant size={20} />
              </div>
              <div>
                <h2 className="cert-heading">Plant Pathology Diagnostic Certificate</h2>
                <p className="cert-sub">Computer Vision Foliar Analysis Report</p>
              </div>
            </div>
            <div className="cert-meta-tag">
              <span className="cert-status-badge">OFFICIAL RECORD</span>
              <p className="cert-id-text">Ref: <strong>{reportId}</strong></p>
              <p className="cert-time-text">{dateStr}</p>
            </div>
          </div>

          <div className="cert-line-divider"></div>

          {/* Diagnostic Info */}
          <div className="cert-columns-layout">
            <div className="cert-media-col">
              {imagePreview && (
                <div className="cert-specimen-frame">
                  <img src={imagePreview} alt="Specimen" className="cert-specimen-photo" />
                  <span className="cert-specimen-label">Sample Specimen</span>
                </div>
              )}
              <div className="cert-meta-details">
                <p><strong>Host Crop:</strong> Potato (<em>Solanum tuberosum</em>)</p>
                <p><strong>Sample:</strong> Foliar Leaf Tissue</p>
                <p><strong>Engine:</strong> Convolutional Neural Network</p>
              </div>
            </div>

            <div className="cert-findings-col">
              <div className="findings-highlight-card">
                <span className="findings-label">Pathological Diagnosis</span>
                <h3 className="findings-disease-name">{prediction.disease}</h3>
                <div className="findings-stats-row">
                  <span>Confidence: <strong>{prediction.confidence}%</strong></span>
                  <span>Severity: <strong>{prediction.severity?.level || "Evaluated"}</strong></span>
                  <span>Infected Area: <strong>{prediction.severity?.percentage ?? 0}%</strong></span>
                </div>
              </div>

              <div className="cert-summary-box">
                <h4>Diagnostic Summary</h4>
                <p>{guidance?.description || "Specimen displays foliar characteristics aligned with this condition."}</p>
              </div>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="cert-prescription-block">
            <h4>Prescribed Action & Care Plan</h4>
            <div className="prescription-cards-row">
              <div className="prescription-card">
                <h5>Chemical Control</h5>
                <ul>
                  {guidance?.chemical_treatments?.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  )) || <li>Follow standard protective spray schedule.</li>}
                </ul>
              </div>

              <div className="prescription-card">
                <h5>Organic & Cultural Alternatives</h5>
                <ul>
                  {guidance?.organic_remedies?.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  )) || <li>Ensure proper crop rotation and drip irrigation.</li>}
                </ul>
              </div>
            </div>

            {guidance?.recommended_dosage && (
              <div className="cert-dosage-alert">
                <strong>Dosage Guideline:</strong> {guidance.recommended_dosage}
              </div>
            )}
          </div>

          {/* Signoff */}
          <div className="cert-signoff-row">
            <div className="cert-disclaimer">
              <p>Notice: AI diagnosis is intended for field assistance. For commercial outbreak confirmation, consult agricultural extension specialists.</p>
            </div>
            <div className="cert-signature-area">
              <div className="cert-verified-stamp">
                <IconCheck size={14} />
                <span>AGRO-AI VERIFIED</span>
              </div>
              <div className="cert-sign-line">Dr. Flora, AI Agronomist</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticReportModal;
