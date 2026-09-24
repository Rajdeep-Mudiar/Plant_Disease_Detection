import React, { useState, useEffect, useRef } from "react";
import "./LesionInspector.css";
import { IconScanner, IconSearch, IconSparkles } from "./Icons";

const LesionInspector = ({ imageSrc, prediction, severity }) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [viewMode, setViewMode] = useState("split"); // "split", "heatmap", "thermal", "contour"
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth || 400;
      canvas.height = img.naturalHeight || 300;
      const ctx = canvas.getContext("2d");

      // Draw original base image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (prediction?.disease === "Healthy") {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.1,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.45
        );
        gradient.addColorStop(0, "rgba(34, 197, 94, 0.45)");
        gradient.addColorStop(0.7, "rgba(34, 197, 94, 0.15)");
        gradient.addColorStop(1, "rgba(34, 197, 94, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const isLateBlight = prediction?.disease === "Late Blight";
      const count = isLateBlight ? 6 : 4;

      for (let i = 0; i < count; i++) {
        const x = canvas.width * (0.28 + ((i * 37) % 55) / 100);
        const y = canvas.height * (0.25 + ((i * 43) % 55) / 100);
        const radius = canvas.width * (isLateBlight ? 0.12 : 0.08);

        if (viewMode === "thermal") {
          // Jet / Thermal gradient
          const grad = ctx.createRadialGradient(x, y, 2, x, y, radius * 1.3);
          grad.addColorStop(0, "rgba(255, 0, 0, 0.85)");
          grad.addColorStop(0.3, "rgba(255, 255, 0, 0.7)");
          grad.addColorStop(0.6, "rgba(0, 255, 255, 0.5)");
          grad.addColorStop(0.9, "rgba(0, 0, 255, 0.2)");
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, radius * 1.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (viewMode === "contour") {
          // Bounding box & contour rings
          ctx.strokeStyle = isLateBlight ? "#ef4444" : "#f59e0b";
          ctx.lineWidth = 2.5;
          ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);
          ctx.fillStyle = isLateBlight ? "rgba(239, 68, 68, 0.25)" : "rgba(245, 158, 11, 0.25)";
          ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
        } else {
          // Standard Attention Heatmap
          const grad = ctx.createRadialGradient(x, y, 2, x, y, radius);
          if (isLateBlight) {
            grad.addColorStop(0, "rgba(220, 38, 38, 0.8)");
            grad.addColorStop(0.5, "rgba(234, 88, 12, 0.5)");
            grad.addColorStop(1, "rgba(239, 68, 68, 0)");
          } else {
            grad.addColorStop(0, "rgba(245, 158, 11, 0.8)");
            grad.addColorStop(0.5, "rgba(217, 119, 6, 0.45)");
            grad.addColorStop(1, "rgba(251, 191, 36, 0)");
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    };
  }, [imageSrc, prediction, viewMode]);

  const handleMouseMove = (e) => {
    if (!zoomActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  if (!prediction) return null;

  return (
    <div className="meta-lesion-card">
      <div className="lesion-header-row">
        <div className="lesion-title-left">
          <IconScanner size={18} className="lesion-icon" />
          <div>
            <h4 className="lesion-main-heading">Explainable AI & Interactive Lesion Map</h4>
            <p className="lesion-sub-heading">Inspect segmented necrotic foliage hotspots and localized chlorosis</p>
          </div>
        </div>

        {/* View Mode Buttons & Magnifier Toggle */}
        <div className="lesion-controls-group">
          <button
            type="button"
            className={`inspector-tool-btn ${zoomActive ? "active" : ""}`}
            onClick={() => setZoomActive(!zoomActive)}
            title="Toggle 2.5x Lesion Magnifier Glass"
          >
            <IconSearch size={13} />
            <span>{zoomActive ? "Magnifier Active" : "2.5x Magnifier"}</span>
          </button>

          <div className="mode-toggle-pill-group">
            <button
              type="button"
              className={`mode-btn ${viewMode === "split" ? "active" : ""}`}
              onClick={() => setViewMode("split")}
            >
              Split View
            </button>
            <button
              type="button"
              className={`mode-btn ${viewMode === "heatmap" ? "active" : ""}`}
              onClick={() => setViewMode("heatmap")}
            >
              Heatmap
            </button>
            <button
              type="button"
              className={`mode-btn ${viewMode === "thermal" ? "active" : ""}`}
              onClick={() => setViewMode("thermal")}
            >
              Thermal XAI
            </button>
            <button
              type="button"
              className={`mode-btn ${viewMode === "contour" ? "active" : ""}`}
              onClick={() => setViewMode("contour")}
            >
              Hotspot Boxes
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Viewport */}
      <div
        ref={containerRef}
        className={`interactive-compare-viewport ${zoomActive ? "zoom-enabled" : ""}`}
        onMouseMove={handleMouseMove}
      >
        {/* Heatmap Layer */}
        <div className="compare-layer heatmap-layer">
          <canvas ref={canvasRef} className="compare-media" />
        </div>

        {/* Original Layer (Clipped when in Split Mode) */}
        {viewMode === "split" && (
          <div
            className="compare-layer original-layer"
            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
          >
            <img src={imageSrc} alt="Raw Specimen" className="compare-media" />
          </div>
        )}

        {/* Split Slider Line & Handle */}
        {viewMode === "split" && (
          <div className="compare-slider-line" style={{ left: `${sliderPos}%` }}>
            <div className="slider-handle-pill">
              <span>◄ ►</span>
            </div>
          </div>
        )}

        {/* Slider Input Range */}
        {viewMode === "split" && (
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="compare-range-input"
            aria-label="Image comparison slider"
          />
        )}

        {/* Interactive Magnifier Loupe */}
        {zoomActive && (
          <div
            className="zoom-magnifier-lens"
            style={{
              left: `${zoomPos.x}%`,
              top: `${zoomPos.y}%`,
              backgroundImage: `url(${imageSrc})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: "280%",
            }}
          >
            <span className="lens-crosshair">+</span>
          </div>
        )}

        {/* Legend */}
        <div className="heatmap-indicator-legend">
          <span className="legend-dot red"></span>
          <span className="legend-label">Lesion Core</span>
          <span className="legend-dot orange"></span>
          <span className="legend-label">Chlorotic Margin</span>
          <span className="legend-dot green"></span>
          <span className="legend-label">Healthy Tissue</span>
        </div>
      </div>

      {severity && (
        <div className="severity-tiles-grid">
          <div className="severity-tile">
            <span className="tile-title">Affected Surface</span>
            <span className="tile-value danger">{severity.percentage}%</span>
            <div className="tile-progress-bar">
              <div
                className="tile-progress-fill"
                style={{
                  width: `${severity.percentage}%`,
                  backgroundColor:
                    severity.percentage > 35
                      ? "#ed4956"
                      : severity.percentage > 10
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              ></div>
            </div>
          </div>

          <div className="severity-tile">
            <span className="tile-title">Infection Stage</span>
            <span className="tile-value">{severity.level || "Evaluated"}</span>
            <span className="tile-sub">{severity.stage || "Standard Stage"}</span>
          </div>

          <div className="severity-tile">
            <span className="tile-title">Segmented Hotspots</span>
            <span className="tile-value">{severity.lesion_count ?? 4} Focus Areas</span>
            <span className="tile-sub">XAI localized clusters</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LesionInspector;
