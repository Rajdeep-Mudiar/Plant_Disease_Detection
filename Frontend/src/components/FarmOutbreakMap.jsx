import React, { useState, useEffect, useRef } from "react";
import "./FarmOutbreakMap.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  IconMapPin,
  IconLayers,
  IconRefresh,
  IconCheck,
  IconShield,
  IconMaximize,
  IconMinimize,
} from "./Icons";

// Synchronized with the 6 Farm Digital Twin Sectors
export const DEFAULT_FARM_SECTORS = [
  {
    id: "sec-1a",
    title: "Sector 1A - North Drip Pivot",
    crop: "Potato (Kennebec)",
    area: "12.5 Acres",
    healthIndex: 96,
    status: "optimal", // optimal, warning, critical, treating
    soilMoisture: 38.2,
    leafWetness: 24,
    canopyTemp: 21.4,
    vpd: 1.25,
    sporeLoad: 12,
    irrigation: "Active (0.4 L/hr)",
    droneStatus: "Standby",
    lastTreatment: "3 Days ago (Bio-Fungicide)",
    lat: 36.7865,
    lng: -119.4285,
    disease: "Healthy (Optimal)",
    severity: "None (0%)",
    date: "Today, Sep 24",
    sporesRisk: "Low Inoculum (12/m³)",
    containment: "Maintain standard sub-surface drip irrigation and routine multispectral drone scouting.",
  },
  {
    id: "sec-1b",
    title: "Sector 1B - Greenhouse Alpha",
    crop: "Tomato (Roma)",
    area: "4.0 Acres",
    healthIndex: 91,
    status: "optimal",
    soilMoisture: 42.0,
    leafWetness: 32,
    canopyTemp: 23.1,
    vpd: 1.10,
    sporeLoad: 28,
    irrigation: "Scheduled (18:00)",
    droneStatus: "Standby",
    lastTreatment: "5 Days ago (Neem Extract)",
    lat: 36.7880,
    lng: -119.4140,
    disease: "Healthy (Climate Controlled)",
    severity: "None (0%)",
    date: "Today, Sep 24",
    sporesRisk: "Automated VPD Containment",
    containment: "Automated HVAC ridge vents active. Vapor pressure deficit buffered against spore germination.",
  },
  {
    id: "sec-2a",
    title: "Sector 2A - Central Valley Ridge",
    crop: "Potato (Russet Burbank)",
    area: "18.0 Acres",
    healthIndex: 68,
    status: "critical",
    soilMoisture: 52.8,
    leafWetness: 88,
    canopyTemp: 18.2,
    vpd: 0.35,
    sporeLoad: 410,
    irrigation: "Suspended (Excess Moisture)",
    droneStatus: "Precision Spray Queued",
    lastTreatment: "Pending Application (Mancozeb)",
    lat: 36.7815,
    lng: -119.3980,
    disease: "Late Blight (Phytophthora)",
    severity: "Critical (55%)",
    date: "Today, Sep 24",
    sporesRisk: "High Spore Dispersion (410/m³)",
    containment: "Maintain 500m barrier spray buffer. Avoid mechanical cultivation in wet morning conditions.",
  },
  {
    id: "sec-2b",
    title: "Sector 2B - East Hillside Terrace",
    crop: "Grapevine (Cabernet)",
    area: "8.5 Acres",
    healthIndex: 82,
    status: "warning",
    soilMoisture: 31.0,
    leafWetness: 64,
    canopyTemp: 22.8,
    vpd: 0.75,
    sporeLoad: 145,
    irrigation: "Standby",
    droneStatus: "Scouting In Progress",
    lastTreatment: "7 Days ago (Sulfur Dust)",
    lat: 36.7710,
    lng: -119.4310,
    disease: "Early Blight (Alternaria)",
    severity: "Moderate (22%)",
    date: "Yesterday, Sep 23",
    sporesRisk: "Moderate Inoculum (145/m³)",
    containment: "Foliar scouting active. Maintain sulfur dust protective layer across vine leaves.",
  },
  {
    id: "sec-3a",
    title: "Sector 3A - South River Basin",
    crop: "Corn (Sweet Corn)",
    area: "22.0 Acres",
    healthIndex: 94,
    status: "optimal",
    soilMoisture: 36.5,
    leafWetness: 18,
    canopyTemp: 24.5,
    vpd: 1.45,
    sporeLoad: 15,
    irrigation: "Active (Drip Sub-surface)",
    droneStatus: "Standby",
    lastTreatment: "10 Days ago",
    lat: 36.7680,
    lng: -119.4120,
    disease: "Healthy (Hydrated)",
    severity: "None (0%)",
    date: "Today, Sep 24",
    sporesRisk: "Safe (15/m³)",
    containment: "Sub-surface drip irrigation active. River buffer filtration operational.",
  },
  {
    id: "sec-3b",
    title: "Sector 3B - West Orchard Block",
    crop: "Apple (Honeycrisp)",
    area: "10.0 Acres",
    healthIndex: 87,
    status: "optimal",
    soilMoisture: 34.2,
    leafWetness: 29,
    canopyTemp: 20.9,
    vpd: 1.15,
    sporeLoad: 35,
    irrigation: "Micro-Jet Standby",
    droneStatus: "Standby",
    lastTreatment: "14 Days ago",
    lat: 36.7695,
    lng: -119.3950,
    disease: "Healthy (Monitored)",
    severity: "None (0%)",
    date: "Today, Sep 24",
    sporesRisk: "Low Spore Load (35/m³)",
    containment: "Micro-weather telemetry station broadcasting optimal canopy humidity readings.",
  },
];

const FarmOutbreakMap = ({ onSelectPlot, initialSectors }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Load from props or localStorage if available, or fallback to default 6 sectors
  const [plots, setPlots] = useState(() => {
    if (initialSectors && initialSectors.length > 0) return initialSectors;
    try {
      const saved = localStorage.getItem("agro_farm_sectors");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with default lat/lng
          return parsed.map((s, i) => ({
            ...DEFAULT_FARM_SECTORS[i % DEFAULT_FARM_SECTORS.length],
            ...s,
            title: s.name || s.title || DEFAULT_FARM_SECTORS[i % DEFAULT_FARM_SECTORS.length].title,
          }));
        }
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_FARM_SECTORS;
  });

  const [selectedPlot, setSelectedPlot] = useState(() => plots[2] || plots[0]); // Default to Sector 2A
  const [layerMode, setLayerMode] = useState("streets"); // "streets" or "satellite"
  const [showRadius, setShowRadius] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Listen for real-time sector synchronization events from Digital Twin
  useEffect(() => {
    const handleSectorsChanged = (e) => {
      const updatedSectors = e.detail;
      if (Array.isArray(updatedSectors)) {
        setPlots((prev) =>
          updatedSectors.map((s, i) => {
            const def = DEFAULT_FARM_SECTORS.find((d) => d.id === s.id) || DEFAULT_FARM_SECTORS[i % DEFAULT_FARM_SECTORS.length];
            return {
              ...def,
              ...s,
              title: s.name || s.title || def.title,
              disease: s.status === "critical" ? "Late Blight (Phytophthora)" : s.status === "warning" ? "Early Blight (Alternaria)" : s.status === "treating" ? "Drone Spray Active" : "Healthy (Optimal)",
              severity: s.status === "critical" ? `Critical (${100 - s.healthIndex}%)` : s.status === "warning" ? `Moderate (${100 - s.healthIndex}%)` : s.status === "treating" ? `Treating (${s.healthIndex}% Health)` : "None (0%)",
              sporesRisk: s.status === "critical" ? `High Spore Dispersion (${s.sporeLoad}/m³)` : s.status === "warning" ? `Moderate Inoculum (${s.sporeLoad}/m³)` : `Safe (${s.sporeLoad}/m³)`,
            };
          })
        );
      }
    };

    window.addEventListener("agro_farm_sectors_changed", handleSectorsChanged);
    return () => window.removeEventListener("agro_farm_sectors_changed", handleSectorsChanged);
  }, []);

  // Update selectedPlot if plots change
  useEffect(() => {
    if (selectedPlot) {
      const updated = plots.find((p) => p.id === selectedPlot.id);
      if (updated) {
        setSelectedPlot(updated);
      }
    }
  }, [plots]);

  // Invalidate map size whenever fullscreen state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isFullScreen]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  // Leaflet Map Initialization & Marker Updates
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [36.7780, -119.4120], // Center on farm valley
        zoom: 13,
        zoomControl: true,
        attributionControl: false, // Disables the default Leaflet attribution bar
      });

      const tileUrl =
        layerMode === "satellite"
          ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      L.tileLayer(tileUrl, {
        maxZoom: 18,
        attribution: "", // Completely removed OpenStreetMap contributors attribution
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers and circles
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    plots.forEach((p) => {
      const color =
        p.status === "critical"
          ? "#ef4444"
          : p.status === "warning"
          ? "#f59e0b"
          : p.status === "treating"
          ? "#0284c7"
          : "#22c55e";

      // Dispersal contagion circle
      if (showRadius && (p.status === "critical" || p.status === "warning" || p.sporeLoad > 50)) {
        L.circle([p.lat, p.lng], {
          radius: p.status === "critical" ? 750 : 450,
          color: color,
          fillColor: color,
          fillOpacity: 0.14,
          weight: 1.5,
          dashArray: "4, 4",
        }).addTo(map);
      }

      // Marker
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 9,
        fillColor: color,
        color: "#ffffff",
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.95,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; padding: 6px; font-size: 12px; min-width: 170px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 3px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
            <strong style="color: ${color}; font-size: 13px;">${p.title}</strong>
          </div>
          <div><strong>Crop:</strong> ${p.crop}</div>
          <div><strong>Health:</strong> ${p.healthIndex}%</div>
          <div><strong>Spore Load:</strong> ${p.sporeLoad || 15} / m³</div>
          <div style="margin-top: 3px; font-size: 11px; color: #64748b;">${p.date || "Today"}</div>
        </div>
      `);

      marker.on("click", () => {
        setSelectedPlot(p);
        if (onSelectPlot) onSelectPlot(p);
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
            id: `gps-${Date.now()}`,
            title: "Your GPS Inspection Point",
            crop: "Field Plot",
            lat: lat,
            lng: lng,
            healthIndex: 85,
            disease: "Field Observation Point",
            severity: "Pending Scan",
            date: "Today",
            sporesRisk: "Local Observation",
            status: "warning",
            containment: "Observation marked. Scan leaf via Camera Capture to diagnose pathogens.",
          };
          setPlots((prev) => [newPlot, ...prev]);
          setSelectedPlot(newPlot);
        },
        (err) => {
          alert("Location access unavailable. Centering on farm sectors.");
          mapInstanceRef.current.setView([36.7780, -119.4120], 13);
        }
      );
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const criticalPlotsCount = plots.filter((p) => p.status === "critical").length;
  const warningPlotsCount = plots.filter((p) => p.status === "warning").length;
  const healthyPlotsCount = plots.filter((p) => p.status === "optimal" || p.status === "healthy" || p.status === "treating").length;

  return (
    <div className={`gis-outbreak-card ${isFullScreen ? "fullscreen-mode" : ""}`}>
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
          {/* Full Screen / Half Screen Toggle */}
          <button
            type="button"
            className={`gis-toggle-btn fullscreen-toggle ${isFullScreen ? "active" : ""}`}
            onClick={toggleFullScreen}
            title={isFullScreen ? "Exit Full Screen (Half Screen view)" : "Expand to Full Screen"}
          >
            {isFullScreen ? <IconMinimize size={14} /> : <IconMaximize size={14} />}
            <span>{isFullScreen ? "Half Screen" : "Full Screen"}</span>
          </button>

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
                  <span className="info-k">Overall Health:</span>
                  <span className="info-v" style={{ color: selectedPlot.healthIndex >= 90 ? "#16a34a" : selectedPlot.healthIndex >= 75 ? "#d97706" : "#dc2626" }}>
                    {selectedPlot.healthIndex}% ({selectedPlot.severity})
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-k">Risk Zone:</span>
                  <span className="info-v">{selectedPlot.sporesRisk}</span>
                </div>
                <div className="info-row">
                  <span className="info-k">GPS Coordinates:</span>
                  <span className="info-v">
                    {selectedPlot.lat ? selectedPlot.lat.toFixed(4) : "36.7815"}, {selectedPlot.lng ? selectedPlot.lng.toFixed(4) : "-119.3980"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-k">Last Inspected:</span>
                  <span className="info-v">{selectedPlot.date || "Today, Sep 24"}</span>
                </div>
              </div>

              <div className="outbreak-containment-note">
                <strong>Containment Protocol:</strong> {selectedPlot.containment || "Maintain 500m barrier spray buffer. Avoid mechanical cultivation in wet morning conditions."}
              </div>
            </div>
          ) : (
            <div className="empty-plot-select">Select a field marker on the map to inspect telemetry</div>
          )}

          {/* Quick Stats (Updated directly from the 6 synchronized farm sectors) */}
          <div className="gis-outbreak-stats-grid">
            <div className="mini-stat-card critical">
              <span className="num">{criticalPlotsCount}</span>
              <span className="lbl">Critical Blight</span>
            </div>
            <div className="mini-stat-card warning">
              <span className="num">{warningPlotsCount}</span>
              <span className="lbl">Moderate Blight</span>
            </div>
            <div className="mini-stat-card healthy">
              <span className="num">{healthyPlotsCount}</span>
              <span className="lbl">Healthy Plots</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmOutbreakMap;
