import React, { useState, useRef, useEffect } from "react";
import "./CameraCaptureModal.css";
import { IconCamera, IconClose, IconRefresh, IconCheck } from "./Icons";

const CameraCaptureModal = ({ isOpen, onClose, onCapture }) => {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [error, setError] = useState(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && !capturedDataUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, capturedDataUrl]);

  const startCamera = async () => {
    stopCamera();
    setError(null);
    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera device. Please check browser permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const triggerCapture = () => {
    if (countdown !== null) return;
    setCountdown(3);
    let current = 3;
    const interval = setInterval(() => {
      current -= 1;
      if (current === 0) {
        clearInterval(interval);
        setCountdown(null);
        takeSnapshot();
      } else {
        setCountdown(current);
      }
    }, 500);
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    setCapturedDataUrl(dataUrl);
    stopCamera();
  };

  const handleConfirm = () => {
    if (capturedDataUrl) {
      fetch(capturedDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `leaf_specimen_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          onCapture(file, capturedDataUrl);
          handleClose();
        });
    }
  };

  const handleRetake = () => {
    setCapturedDataUrl(null);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    setCapturedDataUrl(null);
    setCountdown(null);
    setError(null);
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  if (!isOpen) return null;

  return (
    <div className="meta-camera-overlay" onClick={handleClose}>
      <div
        className="meta-camera-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="meta-camera-header">
          <div className="camera-header-left">
            <IconCamera size={18} />
            <h4>Leaf Camera Viewfinder</h4>
          </div>
          <button className="camera-exit-button" onClick={handleClose}>
            <IconClose size={18} />
          </button>
        </div>

        <div className="meta-camera-viewport">
          {error ? (
            <div className="camera-error-container">
              <p>{error}</p>
              <button className="camera-retry-action" onClick={startCamera}>
                Retry Device Access
              </button>
            </div>
          ) : capturedDataUrl ? (
            <div className="snapshot-preview-frame">
              <img
                src={capturedDataUrl}
                alt="Captured Specimen"
                className="snapshot-image-element"
              />
              <div className="snapshot-confirmed-tag">Specimen Captured</div>
            </div>
          ) : (
            <div className="camera-live-frame">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video-stream"
              />
              <div className="viewfinder-grid-overlay">
                <div className="grid-corner tl"></div>
                <div className="grid-corner tr"></div>
                <div className="grid-corner bl"></div>
                <div className="grid-corner br"></div>
                <span className="viewfinder-helper-text">Position leaf in frame</span>
              </div>
              {countdown !== null && (
                <div className="capture-countdown-badge">
                  <span>{countdown}</span>
                </div>
              )}
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div className="meta-camera-toolbar">
          {!capturedDataUrl ? (
            <>
              <button
                type="button"
                className="cam-tool-btn"
                onClick={toggleFacingMode}
                title="Switch Camera Lens"
              >
                <IconRefresh size={16} />
                <span>Switch Lens</span>
              </button>
              <button
                type="button"
                className="cam-shutter-circle"
                onClick={triggerCapture}
                disabled={Boolean(error)}
                title="Capture Photo"
              >
                <div className="shutter-inner"></div>
              </button>
              <button
                type="button"
                className="cam-tool-btn instant"
                onClick={takeSnapshot}
                disabled={Boolean(error)}
              >
                Instant Snap
              </button>
            </>
          ) : (
            <div className="camera-confirm-button-row">
              <button
                type="button"
                className="cam-retake-btn"
                onClick={handleRetake}
              >
                Retake
              </button>
              <button
                type="button"
                className="cam-confirm-btn"
                onClick={handleConfirm}
              >
                <IconCheck size={16} />
                <span>Analyze Specimen</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;
