import React from "react";
import "./AgronomyPage.css";
import DiseaseProgressionTimeLapse from "../components/DiseaseProgressionTimeLapse";
import CropRotationPlanner from "../components/CropRotationPlanner";
import PhytotoxicityRiskIndex from "../components/PhytotoxicityRiskIndex";
import PlantAnatomyDissector from "../components/PlantAnatomyDissector";
import { IconPlant, IconBook, IconShield } from "../components/Icons";

export default function AgronomyPage() {
  return (
    <div className="agronomy-page-container">
      {/* Page Hero Header */}
      <div className="agronomy-hero">
        <div className="agronomy-hero-content">
          <div className="hero-badge-pill">
            <IconPlant size={16} />
            <span>ADVANCED CROP SCIENCE & PHYSIOLOGY LAB</span>
          </div>
          <h1 className="hero-title">Plant Pathology & Agronomic Physiology Suite</h1>
          <p className="hero-subtitle">
            Explore 14-day disease progression time-lapses, 4-season biological crop rotation cycles, chemical burn risk matrices, and 3D plant anatomical dissections.
          </p>
        </div>
      </div>

      {/* Main Suite Modules */}
      <div className="agronomy-modules-stack">
        <DiseaseProgressionTimeLapse />
        <CropRotationPlanner />
        <PhytotoxicityRiskIndex />
        <PlantAnatomyDissector />
      </div>
    </div>
  );
}
