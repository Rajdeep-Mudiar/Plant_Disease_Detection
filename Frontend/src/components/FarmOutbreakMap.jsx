import React, { useState, useEffect, useRef } from "react";
import "./FarmOutbreakMap.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IconMapPin, IconLayers, IconRefresh, IconCheck, IconShield } from "./Icons";

const INITIAL_PLOTS = [
  {
    id: 1,
    title: "Sector 4A - North Valley Plot",
    lat: 36.7783,
    lng: -119.4179,
    disease: "Late Blight",
    severity: "Critical (55%)",
    date: "Sep 24, 2026",
    sporesRisk: "High Spore Dispersion",
    crop: "Potato (Russet Burbank)",
    status: "critical",
  },
  {
    id: 2,
    title: "Sector 2B - East Ridge Orchard",
    lat: 36.7925,
    lng: -119.4012,
    disease: "Early Blight",
    severity: "Moderate (22%)",
    date: "Sep 23, 2026",
    sporesRisk: "Contained",
    crop: "Potato (Yukon Gold)",
    status: "warning",
  },
  {
    id: 3,
    title: "Sector 1C - South Drip Pivot",
    lat: 36.7645,
    lng: -119.4325,
    disease: "Healthy",
    severity: "None (0%)",
    date: "Sep 24, 2026",
    sporesRisk: "Safe",
    crop: "Potato (Kennebec)",
    status: "healthy",
  },
  {
    id: 4,
    title: "Sector 3F - West River Boundary",
    lat: 36.7852,
    lng: -119.4485,
    disease: "Late Blight",
    severity: "Critical (62%)",
    date: "Sep 24, 2026",
    sporesRisk: "High Spore Dispersion",
    crop: "Potato (Russet)",
    status: "critical",
  },
];

const FarmOutbreakMap = ({ onSelectPlot }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [plots, setPlots] = useState(INITIAL_PLOTS);
  const [selectedPlot, setSelectedPlot] = useState(INITIAL_PLOTS[0]);
  const [layerMode, setLayerMode] = useState("streets"); // "streets" or "satellite"
  const [showRadius, setShowRadius] = useState(true);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [36.7783, -119.4179],
        zoom: 13,
        zoomControl: true,
      });

      const tileUrl =
        layerMode === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      L.tileLayer(tileUrl, {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    plots.forEach((p) => {
      const color = p.status === "critical" ? "#ef4444" : p.status === "warning" ? "#f59e0b" : "#22c55e";

      // Dispersal contagion circle
      if (showRadius && p.status !== "healthy") {
        L.circle([p.lat, p.lng], {
          radius: p.status === "critical" ? 700 : 400,
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1,
          dashArray: "4, 4",
        }).addTo(map);
      }

      // Marker
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 8,
        fillColor: color,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 4px; font-size: 12px;">
          <strong style="color: ${color};">${p.disease}</strong><br/>
          <span>${p.title}</span><br/>
          <small>Severity: ${p.severity}</small><br/>
          <small style="color: #64748b;">${p.date}</small>
        </div>
      `);

      marker.on("click", () => {
        setSelectedPlot(p);
      });
    });
  }, [plots, layerMode, showRadius]);

  const handleLocateCurrentPlot = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          mapInstanceRef.current.setView([lat, lng], 14);

          const newPlot = {
            id: Date.now(),
            title: "Your GPS Coordinates",
            lat: lat,
            lng: lng,
            disease: "Active Inspection Point",
            severity: "Pending Scan",
            date: "Today",
            sporesRisk: "Local Observation",
            crop: "Field Plot",
            status: "warning",
          };
          setPlots((prev) => [newPlot, ...prev]);
          setSelectedPlot(newPlot);
        },
        (err) => {
          alert("Location access denied or unavailable. Centering farm default plot.");
          mapInstanceRef.current.setView([36.7783, -119.4179], 13);
        }
      );
    }
  };

  return (
    <div className="gis-outbreak-card">
      <div className="gis-header-bar">
        <div className="gis-title-group">
          <div className="gis-icon-frame">
            <IconMapPin size={18} />
          </div>
          <div>
            <h3 className="gis-main-title">Farm Plot GIS Outbreak Heatmap</h3>
            <p className="gis-sub-title">Geospatial disease tracking, cluster containment zones, and spore dispersion radius</p>
          </div>
        </div>

        <div className="gis-controls-cluster">
          <button
            type="button"
            className={`gis-toggle-btn ${showRadius ? "active" : ""}`}
            onClick={() => setShowRadius(!showRadius)}
            title="Toggle Spore Dispersal Risk Radius"
          >
            <IconShield size={14} />
            <span>Spore Radius</span>
          </button>

          <button
            type="button"
            className="gis-gps-btn"
            onClick={handleLocateCurrentPlot}
            title="Locate Field via GPS"
          >
            <IconMapPin size={14} />
            <span>Locate Field</span>
          </button>
        </div>
      </div>

      {/* Map + Sidebar Grid */}
      <div className="gis-map-layout-grid">
        <div className="map-viewport-frame">
          <div ref={mapContainerRef} className="leaflet-actual-map" />
        </div>

        {/* Selected Plot Summary Inspector */}
        <div className="plot-inspector-sidebar">
          <h4 className="inspector-heading">Plot Pathology Dossier</h4>
          {selectedPlot ? (
            <div className={`inspected-plot-card ${selectedPlot.status}`}>
              <div className="inspector-status-badge">
                <span className="dot-pulse"></span>
                <span>{selectedPlot.disease}</span>
              </div>

              <h5 className="plot-sector-name">{selectedPlot.title}</h5>
              <div className="plot-info-table">
                <div className="info-row">
                  <span className="info-k">Crop Variety:</span>
                  <span className="info-v">{selectedPlot.crop}</span>
                </div>
                <div className="info-row">
                  <span className="info-k">Severity Level:</span>
                  <span className="info-v">{selectedPlot.severity}</span>
                </div>
                <div className="info-row">
                  <span className="info-k">Risk Zone:</span>
                  <span className="info-v">{selectedPlot.sporesRisk}</span>
                </div>
                <div className="info-row">
                  <span className="info-k">Coordinates:</span>
                  <span className="info-v">
                    {selectedPlot.lat.toFixed(4)}, {selectedPlot.lng.toFixed(4)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-k">Last Inspected:</span>
                  <span className="info-v">{selectedPlot.date}</span>
                </div>
              </div>

              <div className="outbreak-containment-note">
                <strong>Containment Protocol:</strong> Maintain 500m barrier spray buffer. Avoid mechanical cultivation in wet morning conditions.
              </div>
            </div>
          ) : (
            <div className="empty-plot-select">Select a field marker on the map to inspect telemetry</div>
          )}

          {/* Quick Stats */}
          <div className="gis-outbreak-stats-grid">
            <div className="mini-stat-card critical">
              <span className="num">2</span>
              <span className="lbl">Critical Blight</span>
            </div>
            <div className="mini-stat-card warning">
              <span className="num">1</span>
              <span className="lbl">Moderate Blight</span>
            </div>
            <div className="mini-stat-card healthy">
              <span className="num">1</span>
              <span className="lbl">Healthy Plot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmOutbreakMap;
