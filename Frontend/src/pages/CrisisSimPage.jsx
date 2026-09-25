import React from "react";
import "./CrisisSimPage.css";
import CrisisOutbreakSimulator from "../components/CrisisOutbreakSimulator";
import { IconShield, IconActivity } from "../components/Icons";

export default function CrisisSimPage() {
  return (
    <div className="crisis-page-container">
      {/* Page Hero Header */}
      <div className="crisis-hero">
        <div className="crisis-hero-content">
          <div className="hero-badge-pill crisis">
            <IconShield size={16} />
            <span>TACTICAL EMERGENCY OUTBREAK RESPONSE</span>
          </div>
          <h1 className="hero-title">60-Second Farm Crisis & Epidemic Simulator</h1>
          <p className="hero-subtitle">
            Put your agronomic decision-making to the test in a high-intensity crisis scenario. Make split-second choices on chemical payloads, nozzle pressure, and containment barriers.
          </p>
        </div>
      </div>

      {/* Main Simulator Module */}
      <div className="crisis-modules-stack">
        <CrisisOutbreakSimulator />
      </div>
    </div>
  );
}
