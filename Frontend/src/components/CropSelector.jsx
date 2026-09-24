import React from "react";
import "./CropSelector.css";
import { IconLayers, IconCheck } from "./Icons";

export const SUPPORTED_CROPS = [
  {
    id: "potato",
    name: "Potato",
    scientific: "Solanum tuberosum",
    engine: "Local ResNet CNN & Groq AI",
    status: "Primary CNN",
    diseases: ["Early Blight", "Late Blight", "Healthy"],
  },
  {
    id: "tomato",
    name: "Tomato",
    scientific: "Solanum lycopersicum",
    engine: "Groq Vision & AI Agronomist",
    status: "Expanded AI",
    diseases: ["Early Blight", "Late Blight", "Septoria Leaf Spot", "Leaf Mold", "Healthy"],
  },
  {
    id: "corn",
    name: "Corn / Maize",
    scientific: "Zea mays",
    engine: "Groq Vision & AI Agronomist",
    status: "Expanded AI",
    diseases: ["Common Rust", "Gray Leaf Spot", "Northern Corn Blight", "Healthy"],
  },
  {
    id: "grape",
    name: "Grapevine",
    scientific: "Vitis vinifera",
    engine: "Groq Vision & AI Agronomist",
    status: "Expanded AI",
    diseases: ["Black Rot", "Esca (Black Measles)", "Leaf Blight", "Healthy"],
  },
  {
    id: "apple",
    name: "Apple Orchard",
    scientific: "Malus domestica",
    engine: "Groq Vision & AI Agronomist",
    status: "Expanded AI",
    diseases: ["Apple Scab", "Black Rot", "Cedar Apple Rust", "Healthy"],
  },
];

const CropSelector = ({ selectedCrop = "potato", onSelectCrop }) => {
  return (
    <div className="crop-selector-bar">
      <div className="crop-selector-header">
        <div className="crop-header-left">
          <IconLayers size={16} />
          <span className="crop-header-title">Crop Pathology Target Engine:</span>
        </div>
        <span className="crop-header-status">Multi-Crop Diagnostic Active</span>
      </div>

      <div className="crop-pills-row">
        {SUPPORTED_CROPS.map((crop) => {
          const isSelected = selectedCrop === crop.id;
          return (
            <button
              key={crop.id}
              type="button"
              className={`crop-pill-btn ${isSelected ? "active" : ""}`}
              onClick={() => onSelectCrop(crop.id)}
            >
              <div className="crop-pill-top">
                <span className="crop-pill-name">{crop.name}</span>
                {isSelected && <IconCheck size={12} />}
              </div>
              <span className="crop-pill-sub">{crop.status}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CropSelector;
