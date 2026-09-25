import React, { useState, useEffect } from "react";
import "./DigitalTwinPage.css";
import VisualFarmCanvas from "../components/VisualFarmCanvas";
import {
  IconActivity,
  IconLayers,
  IconShield,
  IconRefresh,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconRadar,
  IconCheck,
} from "../components/Icons";

const INITIAL_SECTORS = [
  {
    id: "sec-1a",
    name: "Sector 1A - North Drip Pivot",
    crop: "Potato (Kennebec)",
    area: "12.5 Acres",
    healthIndex: 96,
    status: "optimal", // optimal, warning, critical, treating
    soilMoisture: 38.2, // %
    leafWetness: 24, // %
    canopyTemp: 21.4, // °C
    vpd: 1.25, // kPa (Vapor Pressure Deficit)
    sporeLoad: 12, // spores/m³
    irrigation: "Active (0.4 L/hr)",
    droneStatus: "Standby",
    lastTreatment: "3 Days ago (Bio-Fungicide)",
  },
  {
    id: "sec-1b",
    name: "Sector 1B - Greenhouse Alpha",
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
  },
  {
    id: "sec-2a",
    name: "Sector 2A - Central Valley Ridge",
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
  },
  {
    id: "sec-2b",
    name: "Sector 2B - East Hillside Terrace",
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
  },
  {
    id: "sec-3a",
    name: "Sector 3A - South River Basin",
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
  },
  {
    id: "sec-3b",
    name: "Sector 3B - West Orchard Block",
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
    lastTreatment: "4 Days ago (Copper Spray)",
  },
];

const DigitalTwinPage = ({ onNavigateToScanner }) => {
  const [sectors, setSectors] = useState(INITIAL_SECTORS);
  const [selectedSectorId, setSelectedSectorId] = useState("sec-2a");
  const [simRunning, setSimRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [simTimeStep, setSimTimeStep] = useState(0);
  const [activeScenario, setActiveScenario] = useState("live");
  const [actionLog, setActionLog] = useState([
    { id: 1, time: "10:14:02", message: "IoT Telemetry stream synchronized across 6 sectors (75.0 Total Acres)." },
    { id: 2, time: "10:15:30", message: "Pathogen alert triggered in Sector 2A: Elevated spore concentration (410 spores/m³)." },
  ]);

  const selectedSector = sectors.find((s) => s.id === selectedSectorId) || sectors[0];

  // Simulation tick loop
  useEffect(() => {
    if (!simRunning) return;

    const interval = setInterval(() => {
      setSimTimeStep((prev) => prev + 1);

      setSectors((prevSectors) =>
        prevSectors.map((sector) => {
          // Slight realistic telemetry jitter
          const moistureDelta = (Math.random() - 0.5) * 0.4;
          const tempDelta = (Math.random() - 0.5) * 0.2;
          const newMoisture = Math.max(10, Math.min(80, +(sector.soilMoisture + moistureDelta).toFixed(1)));
          const newTemp = Math.max(10, Math.min(45, +(sector.canopyTemp + tempDelta).toFixed(1)));

          let newSporeLoad = sector.sporeLoad;
          let newHealth = sector.healthIndex;
          let newStatus = sector.status;

          // If treating, steadily improve
          if (sector.status === "treating") {
            newSporeLoad = Math.max(10, Math.round(sector.sporeLoad * 0.85));
            newHealth = Math.min(99, sector.healthIndex + 2);
            if (newSporeLoad < 30) {
              newStatus = "optimal";
            }
          }

          return {
            ...sector,
            soilMoisture: newMoisture,
            canopyTemp: newTemp,
            sporeLoad: newSporeLoad,
            healthIndex: newHealth,
            status: newStatus,
          };
        })
      );
    }, 2500 / simSpeed);

    return () => clearInterval(interval);
  }, [simRunning, simSpeed]);

  // Sync sectors to localStorage and broadcast real-time event for FarmOutbreakMap
  useEffect(() => {
    try {
      localStorage.setItem("agro_farm_sectors", JSON.stringify(sectors));
      window.dispatchEvent(new CustomEvent("agro_farm_sectors_changed", { detail: sectors }));
    } catch (e) {
      // ignore
    }
  }, [sectors]);

  // Scenario Triggers
  const triggerScenarioSporeOutbreak = () => {
    setActiveScenario("outbreak");
    setSectors((prev) =>
      prev.map((s) => {
        if (s.id === "sec-2a" || s.id === "sec-2b") {
          return {
            ...s,
            leafWetness: 94,
            sporeLoad: Math.round(s.sporeLoad * 1.8 + 120),
            healthIndex: Math.max(45, s.healthIndex - 12),
            status: "critical",
          };
        }
        return s;
      })
    );
    addActionLog("SIMULATION TRIGGER: Microclimate humidity surge (94% RH). Pathogen spore dispersion accelerated in Sectors 2A & 2B.");
  };

  const triggerScenarioPrecisionSpray = () => {
    setActiveScenario("spray");
    const targetSector = sectors.find((s) => s.id === selectedSectorId) || sectors[0];
    setSectors((prev) =>
      prev.map((s) => {
        if (s.id === selectedSectorId || s.status === "critical" || s.status === "warning") {
          return {
            ...s,
            status: "treating",
            droneStatus: s.id === selectedSectorId ? "Deploying Precision Fungicide (Target)" : "Queued for Foliar Spray",
            lastTreatment: "Autonomous Drone Spray (Active)",
            healthIndex: Math.min(99, s.healthIndex + 6),
            sporeLoad: Math.max(5, Math.round(s.sporeLoad * 0.35)),
          };
        }
        return s;
      })
    );
    addActionLog(`AUTONOMOUS ACTION: Precision agricultural drone dispatched for target foliar fungicide application in ${targetSector.name}.`);
  };

  const triggerScenarioDripFertigation = () => {
    setActiveScenario("drip");
    setSectors((prev) =>
      prev.map((s) => ({
        ...s,
        soilMoisture: 40.0,
        irrigation: "Drip Pulse Active (NPK Buffered)",
        healthIndex: Math.min(99, s.healthIndex + 4),
      }))
    );
    addActionLog("IRRIGATION DIRECTIVE: Sub-surface drip fertigation cycle initialized. Soil moisture buffered to optimal 40.0%.");
  };

  const resetSimulation = () => {
    setSectors(INITIAL_SECTORS);
    setActiveScenario("live");
    addActionLog("SYSTEM RESET: Digital twin telemetry re-anchored to primary physical IoT ground sensors.");
  };

  const addActionLog = (msg) => {
    const timeStr = new Date().toLocaleTimeString();
    setActionLog((prev) => [{ id: Date.now(), time: timeStr, message: msg }, ...prev.slice(0, 19)]);
  };

  // Farm-wide calculations
  const totalArea = sectors.reduce((acc, s) => acc + parseFloat(s.area), 0).toFixed(1);
  const avgHealth = Math.round(sectors.reduce((acc, s) => acc + s.healthIndex, 0) / sectors.length);
  const criticalCount = sectors.filter((s) => s.status === "critical").length;
  const warningCount = sectors.filter((s) => s.status === "warning").length;

  return (
    <div className="digital-twin-container">
      {/* Top Banner */}
      <div className="twin-banner-card">
        <div className="twin-header-row">
          <div className="twin-title-group">
            <div className="twin-icon-box">
              <IconActivity size={24} />
            </div>
            <div>
              <h1 className="twin-main-title">Digital Farm Twin & IoT Simulation Hub</h1>
              <p className="twin-sub-title">
                Real-time biophysical telemetry, vegetative health index, spore dispersal simulation, and autonomous drone dispatch
              </p>
            </div>
          </div>

          <div className="twin-sim-controls">
            <div className="sim-status-pill">
              <span className={`sim-dot ${simRunning ? "pulse" : ""}`}></span>
              <span>{simRunning ? `Live Simulation (${simSpeed}x)` : "Simulation Paused"}</span>
            </div>

            <button
              type="button"
              className="sim-ctrl-btn"
              onClick={() => setSimRunning(!simRunning)}
            >
              {simRunning ? "Pause" : "Resume"}
            </button>

            <button
              type="button"
              className={`sim-speed-btn ${simSpeed === 1 ? "active" : ""}`}
              onClick={() => setSimSpeed(1)}
            >
              1x
            </button>
            <button
              type="button"
              className={`sim-speed-btn ${simSpeed === 2 ? "active" : ""}`}
              onClick={() => setSimSpeed(2)}
            >
              2x
            </button>
            <button
              type="button"
              className={`sim-speed-btn ${simSpeed === 5 ? "active" : ""}`}
              onClick={() => setSimSpeed(5)}
            >
              5x
            </button>

            <button
              type="button"
              className="sim-reset-btn"
              onClick={resetSimulation}
              title="Reset Twin State"
            >
              <IconRefresh size={14} />
            </button>
          </div>
        </div>

        {/* Global Key Metrics Strip */}
        <div className="twin-kpi-grid">
          <div className="twin-kpi-card">
            <span className="kpi-label">Farm Total Managed Area</span>
            <div className="kpi-value-row">
              <span className="kpi-number">{totalArea}</span>
              <span className="kpi-unit">Acres</span>
            </div>
            <span className="kpi-sub">6 Monitored Sectors</span>
          </div>

          <div className="twin-kpi-card">
            <span className="kpi-label">Mean Vegetative Health</span>
            <div className="kpi-value-row">
              <span className={`kpi-number ${avgHealth > 85 ? "good" : "warn"}`}>{avgHealth}%</span>
              <span className="kpi-unit">Index</span>
            </div>
            <span className="kpi-sub">Biomass vigor index</span>
          </div>

          <div className="twin-kpi-card">
            <span className="kpi-label">Active Infection Threats</span>
            <div className="kpi-value-row">
              <span className={`kpi-number ${criticalCount > 0 ? "bad" : "good"}`}>{criticalCount}</span>
              <span className="kpi-unit">Critical Plots</span>
            </div>
            <span className="kpi-sub">{warningCount} Warning Sectors</span>
          </div>

          <div className="twin-kpi-card">
            <span className="kpi-label">Autonomous Defense</span>
            <div className="kpi-value-row">
              <span className="kpi-number good">Online</span>
            </div>
            <span className="kpi-sub">Drone & Drip Integrated</span>
          </div>
        </div>
      </div>

      {/* Scenario Sandbox Trigger Strip */}
      <div className="scenario-sandbox-card">
        <div className="scenario-header">
          <div className="scenario-title-left">
            <IconRadar size={16} />
            <span>Digital Twin Simulation Scenarios:</span>
          </div>
          <span className="scenario-desc">Test proactive farm interventions and weather impacts in real-time</span>
        </div>

        <div className="scenario-btn-group">
          <button
            type="button"
            className={`scenario-action-btn outbreak ${activeScenario === "outbreak" ? "active" : ""}`}
            onClick={triggerScenarioSporeOutbreak}
          >
            <IconTrendingDown size={14} />
            <span>Simulate Humidity & Spore Surge</span>
          </button>

          <button
            type="button"
            className={`scenario-action-btn spray ${activeScenario === "spray" ? "active" : ""}`}
            onClick={triggerScenarioPrecisionSpray}
          >
            <IconShield size={14} />
            <span>Dispatch Precision Drone Spray</span>
          </button>

          <button
            type="button"
            className={`scenario-action-btn drip ${activeScenario === "drip" ? "active" : ""}`}
            onClick={triggerScenarioDripFertigation}
          >
            <IconTrendingUp size={14} />
            <span>Optimize Drip Fertigation</span>
          </button>
        </div>
      </div>

      {/* Visual Farm 2D/Topographical Graphical Canvas */}
      <VisualFarmCanvas
        sectors={sectors}
        selectedSectorId={selectedSectorId}
        onSelectSector={setSelectedSectorId}
        activeScenario={activeScenario}
        onTriggerSpray={triggerScenarioPrecisionSpray}
        onTriggerDrip={triggerScenarioDripFertigation}
        onTriggerOutbreak={triggerScenarioSporeOutbreak}
        onReset={resetSimulation}
      />

      {/* Main Twin Layout: 3D Grid + Deep Telemetry Inspector */}
      <div className="twin-main-grid">
        {/* Left: Interactive Isometric Sector Matrix */}
        <div className="twin-matrix-panel">
          <div className="panel-header">
            <h3 className="panel-title">Farm Plot Telemetry Matrix</h3>
            <span className="panel-sub">Select a sector to inspect IoT biophysical telemetry</span>
          </div>

          <div className="sector-cards-matrix">
            {sectors.map((sec) => {
              const isSelected = sec.id === selectedSectorId;
              return (
                <div
                  key={sec.id}
                  className={`sector-card ${sec.status} ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedSectorId(sec.id)}
                >
                  <div className="sec-card-top">
                    <div>
                      <h4 className="sec-title">{sec.name}</h4>
                      <span className="sec-crop">{sec.crop}</span>
                    </div>
                    <span className={`sec-status-badge ${sec.status}`}>
                      {sec.status === "optimal" && "Optimal"}
                      {sec.status === "warning" && "Warning"}
                      {sec.status === "critical" && "Critical"}
                      {sec.status === "treating" && "Treating"}
                    </span>
                  </div>

                  <div className="sec-health-meter">
                    <div className="meter-label">
                      <span>Health Index</span>
                      <strong>{sec.healthIndex}%</strong>
                    </div>
                    <div className="meter-track">
                      <div
                        className={`meter-bar ${sec.status}`}
                        style={{ width: `${sec.healthIndex}%` }}
                      />
                    </div>
                  </div>

                  <div className="sec-micro-metrics">
                    <div className="micro-item">
                      <span>Moisture</span>
                      <strong>{sec.soilMoisture}%</strong>
                    </div>
                    <div className="micro-item">
                      <span>Canopy</span>
                      <strong>{sec.canopyTemp}°C</strong>
                    </div>
                    <div className="micro-item">
                      <span>Spore Load</span>
                      <strong className={sec.sporeLoad > 100 ? "high-spore" : ""}>
                        {sec.sporeLoad}/m³
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Sector Deep Dossier */}
        <div className="twin-inspector-panel">
          <div className="panel-header">
            <h3 className="panel-title">Sector Telemetry Dossier</h3>
            <span className="panel-sub">{selectedSector.name}</span>
          </div>

          <div className="dossier-card">
            <div className="dossier-hero-row">
              <div>
                <h4 className="dossier-sector-name">{selectedSector.name}</h4>
                <span className="dossier-crop-detail">{selectedSector.crop} • {selectedSector.area}</span>
              </div>
              <div className={`dossier-health-tag ${selectedSector.status}`}>
                <span>{selectedSector.healthIndex}% Health</span>
              </div>
            </div>

            {/* Telemetry Gauge Grid */}
            <div className="dossier-telemetry-grid">
              <div className="telemetry-box">
                <span className="t-label">Soil Volumetric Moisture</span>
                <span className="t-value">{selectedSector.soilMoisture}%</span>
                <span className="t-sub">Target: 35% – 45%</span>
              </div>

              <div className="telemetry-box">
                <span className="t-label">Foliar Canopy Temperature</span>
                <span className="t-value">{selectedSector.canopyTemp}°C</span>
                <span className="t-sub">Ambient thermal scan</span>
              </div>

              <div className="telemetry-box">
                <span className="t-label">Vapor Pressure Deficit (VPD)</span>
                <span className="t-value">{selectedSector.vpd} kPa</span>
                <span className="t-sub">{selectedSector.vpd < 0.5 ? "High Spore Risk" : "Transpiration Safe"}</span>
              </div>

              <div className="telemetry-box">
                <span className="t-label">Pathogen Spore Concentration</span>
                <span className={`t-value ${selectedSector.sporeLoad > 100 ? "danger" : ""}`}>
                  {selectedSector.sporeLoad} / m³
                </span>
                <span className="t-sub">Bio-aerosol sensor</span>
              </div>

              <div className="telemetry-box">
                <span className="t-label">Leaf Wetness Duration</span>
                <span className="t-value">{selectedSector.leafWetness}%</span>
                <span className="t-sub">{selectedSector.leafWetness > 75 ? "Germination Alert" : "Dry Foliage"}</span>
              </div>

              <div className="telemetry-box">
                <span className="t-label">Irrigation System Status</span>
                <span className="t-value highlight">{selectedSector.irrigation}</span>
                <span className="t-sub">Automated Valve Ctrl</span>
              </div>
            </div>

            {/* Drone & Defense Status */}
            <div className="dossier-defense-block">
              <div className="defense-row">
                <span className="def-k">Autonomous Drone Status:</span>
                <span className="def-v">{selectedSector.droneStatus}</span>
              </div>
              <div className="defense-row">
                <span className="def-k">Last Treatment Protocol:</span>
                <span className="def-v">{selectedSector.lastTreatment}</span>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="dossier-actions-group">
              <button
                type="button"
                className="dossier-btn primary"
                onClick={triggerScenarioPrecisionSpray}
              >
                <IconShield size={14} />
                <span>Execute Precision Drone Spray</span>
              </button>

              <button
                type="button"
                className="dossier-btn secondary"
                onClick={triggerScenarioDripFertigation}
              >
                <IconActivity size={14} />
                <span>Run Micro-Fertigation Flush</span>
              </button>
            </div>
          </div>

          {/* Real-time Simulation Action Audit Log */}
          <div className="twin-log-card">
            <h4 className="log-title">Biophysical Telemetry Event Log</h4>
            <div className="log-entries-list">
              {actionLog.map((log) => (
                <div key={log.id} className="log-entry">
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-msg">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwinPage;
