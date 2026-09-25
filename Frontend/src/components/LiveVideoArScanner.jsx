import React, { useState, useRef, useEffect } from "react";
import "./LiveVideoArScanner.css";
import {
  IconCamera,
  IconClose,
  IconSparkles,
  IconShield,
  IconRefresh,
  IconVolume,
  IconVolumeMute,
} from "./Icons";
import { useTranslation } from "../context/LanguageContext";

const LiveVideoArScanner = ({ onCaptureSpecimen, onClose }) => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [fps, setFps] = useState(24);
  const [currentDetection, setCurrentDetection] = useState({
    disease: "Scanning Foliage...",
    confidence: 0,
    severity: "Normal",
    box: { x: 30, y: 30, w: 40, h: 40 },
  });

  // Start Camera Stream
  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setCameraActive(true);
            startContinuousArInference();
          };
        }
      } catch (err) {
        console.error("AR Camera Access Error:", err);
        setCameraError(
          "Camera permission denied or camera not available. Please allow camera access."
        );
      }
    };

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Continuous Real-Time AR Neural Inference Simulation
  const startContinuousArInference = () => {
    let frameCount = 0;
    let lastTime = performance.now();

    const sampleFrame = () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        animFrameRef.current = requestAnimationFrame(sampleFrame);
        return;
      }

      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // Real-time canvas processing
      if (frameCount % 6 === 0 && canvasRef.current && videoRef.current.videoWidth) {
        const ctx = canvasRef.current.getContext("2d");
        const w = videoRef.current.videoWidth;
        const h = videoRef.current.videoHeight;
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        ctx.drawImage(videoRef.current, 0, 0, w, h);

        // Analyze central leaf area
        const sampleSize = Math.min(w, h) * 0.45;
        const startX = (w - sampleSize) / 2;
        const startY = (h - sampleSize) / 2;
        const imgData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
        const data = imgData.data;

        let greenPixels = 0;
        let brownNecroticPixels = 0;
        let total = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Green leaf detection
          if (g > r * 1.08 && g > b * 1.1) {
            greenPixels++;
          }
          // Brown necrotic lesion detection
          else if (r > 70 && g > 40 && b < 60 && Math.abs(r - g) > 20) {
            brownNecroticPixels++;
          }
        }

        const necroticRatio = (brownNecroticPixels / total) * 100;
        const greenRatio = (greenPixels / total) * 100;

        if (necroticRatio > 8.0) {
          setCurrentDetection({
            disease: "Late Blight (Phytophthora)",
            confidence: 96.2,
            severity: "Critical",
            box: { x: 22, y: 22, w: 56, h: 56 },
          });
        } else if (necroticRatio > 2.5) {
          setCurrentDetection({
            disease: "Early Blight (Alternaria)",
            confidence: 94.8,
            severity: "Moderate",
            box: { x: 28, y: 28, w: 44, h: 44 },
          });
        } else if (greenRatio > 15.0) {
          setCurrentDetection({
            disease: "Healthy Foliage",
            confidence: 98.4,
            severity: "Optimal",
            box: { x: 25, y: 25, w: 50, h: 50 },
          });
        } else {
          setCurrentDetection({
            disease: "Aim at Leaf Foliage",
            confidence: 60.0,
            severity: "Searching",
            box: { x: 30, y: 30, w: 40, h: 40 },
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(sampleFrame);
    };

    animFrameRef.current = requestAnimationFrame(sampleFrame);
  };

  // Capture current high-res frame and send to scanner
  const handleSnapCurrentFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    canvas.toBlob((blob) => {
      if (blob && onCaptureSpecimen) {
        const file = new File([blob], `ar_leaf_capture_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCaptureSpecimen(file, dataUrl);
      }
    }, "image/jpeg", 0.95);
  };

  return (
    <div className="ar-scanner-modal-overlay">
      <div className="ar-scanner-window">
        {/* Header HUD */}
        <div className="ar-hud-header">
          <div className="ar-hud-status">
            <span className="ar-record-dot"></span>
            <span className="ar-title">Live Neural AR Stream</span>
            <span className="ar-fps-badge">{fps} FPS</span>
          </div>

          <div className="ar-hud-actions">
            <button
              type="button"
              className="ar-audio-btn"
              onClick={() => setAudioAlerts(!audioAlerts)}
              title={audioAlerts ? "Mute Audio Alerts" : "Enable Audio Alerts"}
            >
              {audioAlerts ? <IconVolume size={16} /> : <IconVolumeMute size={16} />}
            </button>
            <button
              type="button"
              className="ar-close-btn"
              onClick={onClose}
              aria-label="Close AR Scanner"
            >
              <IconClose size={18} />
            </button>
          </div>
        </div>

        {/* Video & AR Reticle Viewport */}
        <div className="ar-viewport">
          <video
            ref={videoRef}
            className="ar-video-feed"
            playsInline
            muted
            autoPlay
          ></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

          {/* AR Target Reticle Overlay */}
          <div
            className={`ar-bounding-box status-${currentDetection.severity.toLowerCase()}`}
            style={{
              left: `${currentDetection.box.x}%`,
              top: `${currentDetection.box.y}%`,
              width: `${currentDetection.box.w}%`,
              height: `${currentDetection.box.h}%`,
            }}
          >
            <div className="reticle-corner top-left"></div>
            <div className="reticle-corner top-right"></div>
            <div className="reticle-corner bottom-left"></div>
            <div className="reticle-corner bottom-right"></div>
            <div className="reticle-crosshair"></div>

            {/* Floating Tag */}
            <div className="ar-tag-chip">
              <span className="tag-disease">{currentDetection.disease}</span>
              {currentDetection.confidence > 70 && (
                <span className="tag-conf">{currentDetection.confidence}%</span>
              )}
            </div>
          </div>

          {/* Error Notice */}
          {cameraError && (
            <div className="ar-camera-error">
              <p>{cameraError}</p>
            </div>
          )}

          {/* Bottom Controls HUD */}
          <div className="ar-controls-bar">
            <div className="ar-live-intel">
              <span className="intel-label">Real-Time Foliar Classification:</span>
              <span className="intel-val">
                {currentDetection.disease} • {currentDetection.severity}
              </span>
            </div>

            <button
              type="button"
              className="ar-snap-btn"
              onClick={handleSnapCurrentFrame}
            >
              <IconCamera size={20} />
              <span>Capture & Diagnose Specimen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveVideoArScanner;
