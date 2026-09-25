import React, { useState, useEffect } from "react";
import "./CrisisOutbreakSimulator.css";
import { IconShield, IconActivity, IconClock, IconRadar } from "./Icons";

export default function CrisisOutbreakSimulator() {
  const [gameState, setGameState] = useState("idle"); // "idle", "running", "won", "lost"
  const [timeLeft, setTimeLeft] = useState(60);
  const [budget, setBudget] = useState(500); // $500 initial budget
  const [containmentScore, setContainmentScore] = useState(15); // starts at 15%
  const [droneBatteries, setDroneBatteries] = useState(2);
  const [logMessages, setLogMessages] = useState([
    "🚨 ALERT: 98% Relative Humidity rainstorm detected over Sector 2A.",
    "⚠️ Airborne sporangia spreading southward at 18 km/h.",
  ]);

  // Tactical choices state
  const [selectedChemical, setSelectedChemical] = useState("mancozeb"); // "mancozeb" ($120), "metalaxyl" ($220), "cyazofamid" ($280)
  const [nozzlePressure, setNozzlePressure] = useState("hollow_cone"); // "hollow_cone", "flat_fan", "drift_guard"
  const [barrierDeployed, setBarrierDeployed] = useState(false);
  const [greenhouseVentClosed, setGreenhouseVentClosed] = useState(false);

  // Timer loop
  useEffect(() => {
    let timer = null;
    if (gameState === "running" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // End of game
            if (containmentScore >= 75) {
              setGameState("won");
            } else {
              setGameState("lost");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, containmentScore]);

  const handleStartMission = () => {
    setGameState("running");
    setTimeLeft(60);
    setBudget(500);
    setContainmentScore(20);
    setDroneBatteries(2);
    setBarrierDeployed(false);
    setGreenhouseVentClosed(false);
    setLogMessages([
      "⏱️ MISSION STARTED: 60 seconds to halt epidemic spread!",
      "🚨 Sector 2A spore count climbing to 450 spores/m³.",
    ]);
  };

  const handleDeployDroneSpray = () => {
    const cost = selectedChemical === "cyazofamid" ? 280 : selectedChemical === "metalaxyl" ? 220 : 120;
    if (budget < cost) {
      addLog("❌ Insufficient budget to purchase this chemical payload!");
      return;
    }
    if (droneBatteries <= 0) {
      addLog("❌ Drone batteries depleted! Recharging required.");
      return;
    }

    setBudget((prev) => prev - cost);
    setDroneBatteries((prev) => prev - 1);

    const boost = selectedChemical === "cyazofamid" ? 35 : selectedChemical === "metalaxyl" ? 25 : 15;
    setContainmentScore((prev) => Math.min(100, prev + boost));
    addLog(`🚁 Drone deployed with ${selectedChemical.toUpperCase()} (${nozzlePressure})! Containment +${boost}%.`);
  };

  const handleDeployBioBarrier = () => {
    if (barrierDeployed) return;
    if (budget < 80) {
      addLog("❌ Insufficient budget for Bio-Fumigant barrier ($80 needed)!");
      return;
    }
    setBudget((prev) => prev - 80);
    setBarrierDeployed(true);
    setContainmentScore((prev) => Math.min(100, prev + 20));
    addLog("🛡️ Bio-Fungicide vapor barrier strip deployed between Sector 2A and 1B! +20% Containment.");
  };

  const handleCloseGreenhouseVents = () => {
    if (greenhouseVentClosed) return;
    setGreenhouseVentClosed(true);
    setContainmentScore((prev) => Math.min(100, prev + 15));
    addLog("🍅 Automated Tomato Greenhouse automated louvers sealed! Sector 1B protected. +15% Containment.");
  };

  const addLog = (msg) => {
    setLogMessages((prev) => [msg, ...prev.slice(0, 4)]);
  };

  return (
    <div className="crisis-simulator-card">
      <div className="crisis-header">
        <div className="crisis-title-group">
          <div className="crisis-icon-frame">
            <IconShield size={22} />
          </div>
          <div>
            <div className="crisis-badge-row">
              <span className="crisis-badge">CRISIS MANAGEMENT ENGINE</span>
              <span className="crisis-sub-badge">60-Second Tactical Challenge</span>
            </div>
            <h3 className="crisis-main-title">"60-Second Farm Crisis Response" Simulator</h3>
            <p className="crisis-sub-title">
              Sudden 98% humidity rainstorm triggers an aggressive Late Blight outbreak in Sector 2A. Manage your $500 budget and drone batteries to halt the epidemic before the timer hits zero!
            </p>
          </div>
        </div>

        {gameState === "idle" && (
          <button type="button" className="start-crisis-btn" onClick={handleStartMission}>
            🎮 Launch 60s Outbreak Crisis
          </button>
        )}
      </div>

      {gameState !== "idle" && (
        <div className="crisis-body-grid">
          {/* Tactical HUD Header */}
          <div className="crisis-hud-strip">
            <div className="hud-metric-pill timer">
              <IconClock size={16} />
              <span>TIME: <strong>{timeLeft}s</strong></span>
            </div>

            <div className="hud-metric-pill budget">
              <span>BUDGET: <strong>${budget}</strong></span>
            </div>

            <div className="hud-metric-pill battery">
              <span>DRONE BATTERIES: <strong>{droneBatteries}/2</strong></span>
            </div>

            <div className="hud-metric-pill score">
              <span>CONTAINMENT: <strong className={containmentScore >= 75 ? "green" : "red"}>{containmentScore}%</strong></span>
            </div>
          </div>

          {/* Game Outcome Modals */}
          {gameState === "won" && (
            <div className="crisis-outcome-banner won">
              <h4>🏆 OUTBREAK CONTAINED! (Score: {containmentScore}%)</h4>
              <p>Outstanding agronomic leadership! You halted the fungal spore wave and protected the greenhouse crop with ${budget} remaining in budget.</p>
              <button type="button" className="retry-btn" onClick={handleStartMission}>Play Again</button>
            </div>
          )}

          {gameState === "lost" && (
            <div className="crisis-outcome-banner lost">
              <h4>⚠️ CROP LOSS! Containment Failed ({containmentScore}%)</h4>
              <p>Spore front breached Sector 1B and 2B due to delayed chemical interception. Try using systemic Cyazofamid or sealing greenhouse vents earlier!</p>
              <button type="button" className="retry-btn" onClick={handleStartMission}>Retry Simulation</button>
            </div>
          )}

          {/* Tactical Action Grid */}
          {gameState === "running" && (
            <div className="crisis-actions-layout">
              {/* Left: Chemical & Payload Selection */}
              <div className="payload-selection-card">
                <h4 className="card-lbl">1. Select Drone Chemical Payload:</h4>
                <div className="payload-options">
                  <button
                    type="button"
                    className={`payload-btn ${selectedChemical === "mancozeb" ? "active" : ""}`}
                    onClick={() => setSelectedChemical("mancozeb")}
                  >
                    <span>Mancozeb 75 WP (Contact)</span>
                    <strong>$120 • +15% Boost</strong>
                  </button>
                  <button
                    type="button"
                    className={`payload-btn ${selectedChemical === "metalaxyl" ? "active" : ""}`}
                    onClick={() => setSelectedChemical("metalaxyl")}
                  >
                    <span>Metalaxyl-M Systemic</span>
                    <strong>$220 • +25% Boost</strong>
                  </button>
                  <button
                    type="button"
                    className={`payload-btn ${selectedChemical === "cyazofamid" ? "active" : ""}`}
                    onClick={() => setSelectedChemical("cyazofamid")}
                  >
                    <span>Cyazofamid Premium Anti-Oomycete</span>
                    <strong>$280 • +35% Boost</strong>
                  </button>
                </div>

                <button
                  type="button"
                  className="deploy-spray-now-btn"
                  onClick={handleDeployDroneSpray}
                >
                  🚁 Deploy Drone Chemical Strike
                </button>
              </div>

              {/* Right: Defensive Countermeasures & Live Terminal */}
              <div className="defense-countermeasures-card">
                <h4 className="card-lbl">2. Defensive Countermeasures:</h4>
                <div className="countermeasure-btns">
                  <button
                    type="button"
                    className={`cm-btn ${barrierDeployed ? "done" : ""}`}
                    onClick={handleDeployBioBarrier}
                    disabled={barrierDeployed}
                  >
                    {barrierDeployed ? "✅ Barrier Deployed" : "🛡️ Deploy Bio-Fumigant Barrier ($80)"}
                  </button>
                  <button
                    type="button"
                    className={`cm-btn ${greenhouseVentClosed ? "done" : ""}`}
                    onClick={handleCloseGreenhouseVents}
                    disabled={greenhouseVentClosed}
                  >
                    {greenhouseVentClosed ? "✅ Greenhouse Sealed" : "🍅 Seal Greenhouse Vents ($0)"}
                  </button>
                </div>

                <div className="crisis-live-log-box">
                  <span className="log-hdr">TACTICAL MISSION LOG:</span>
                  <div className="log-items">
                    {logMessages.map((msg, i) => (
                      <span key={i} className="log-line">{msg}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
