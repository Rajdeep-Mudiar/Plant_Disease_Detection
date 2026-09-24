import React from "react";
import "./WeatherPage.css";
import WeatherRiskCard from "../components/WeatherRiskCard";
import FarmOutbreakMap from "../components/FarmOutbreakMap";
import { IconRadar } from "../components/Icons";

const WeatherPage = () => {
  return (
    <div className="meta-weather-container">
      <div className="weather-banner-card">
        <div className="weather-title-row">
          <div className="weather-icon-box">
            <IconRadar size={22} />
          </div>
          <div>
            <h1 className="weather-main-title">Blight Outbreak & Microclimate Radar</h1>
            <p className="weather-sub-title">
              Live temperature, relative humidity, and precipitation monitoring to forecast foliar infection windows and optimal spraying periods.
            </p>
          </div>
        </div>
      </div>

      <div className="weather-content-area">
        <WeatherRiskCard />

        {/* Feature 3: Farm Plot GIS Outbreak Heatmap */}
        <FarmOutbreakMap />

        <div className="weather-principles-card">
          <h3 className="principles-heading">Pathogen & Weather Correlation Principles</h3>
          <div className="principles-grid">
            <div className="principle-box">
              <span className="principle-pill alert">Relative Humidity &gt; 80%</span>
              <h4>Spore Germination Trigger</h4>
              <p>Late blight sporangia produce zoospores within 2 to 3 hours when continuous free water or heavy dew remains on leaves.</p>
            </div>

            <div className="principle-box">
              <span className="principle-pill warning">15°C – 22°C Temperature</span>
              <h4>Rapid Infection Window</h4>
              <p>Moderate temperatures paired with high moisture accelerate mycelial growth across healthy plant tissue.</p>
            </div>

            <div className="principle-box">
              <span className="principle-pill safe">Wind Speed &lt; 15 km/h</span>
              <h4>Optimal Application Window</h4>
              <p>Calm early morning spraying prevents chemical drift and maximizes foliar droplet retention.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;

