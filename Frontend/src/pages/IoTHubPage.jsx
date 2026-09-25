import React from "react";
import "./IoTHubPage.css";
import SoilMultiDepthProbe from "../components/SoilMultiDepthProbe";
import PheromoneTrapNetwork from "../components/PheromoneTrapNetwork";
import GroundRoverScanner from "../components/GroundRoverScanner";
import { IconActivity, IconRadar, IconShield } from "../components/Icons";

export default function IoTHubPage() {
  return (
    <div className="iot-page-container">
      {/* Page Hero Header */}
      <div className="iot-hero">
        <div className="iot-hero-content">
          <div className="hero-badge-pill iot">
            <IconActivity size={16} />
            <span>VIRTUAL IOT HARDWARE & TELEMETRY SUITE</span>
          </div>
          <h1 className="hero-title">Virtual Smart Farm Hardware & Sensor Network</h1>
          <p className="hero-subtitle">
            Live multi-depth soil NPK/EC probe data, automated optical pheromone insect trap cameras with EIL threshold monitoring, and ground robotic sub-canopy rover scanning.
          </p>
        </div>
      </div>

      {/* Main Hardware Modules */}
      <div className="iot-modules-stack">
        <SoilMultiDepthProbe />
        <PheromoneTrapNetwork />
        <GroundRoverScanner />
      </div>
    </div>
  );
}
