import React, { useState, useEffect } from "react";
import "./WeatherRiskCard.css";
import { IconRadar, IconSearch, IconRefresh, IconSparkles } from "./Icons";

const PRESET_LOCATIONS = [
  { name: "Boise Valley, US", lat: 43.615, lon: -116.2023 },
  { name: "Punjab Plains, IN", lat: 30.7333, lon: 76.7794 },
  { name: "Bavaria Region, DE", lat: 48.7904, lon: 11.4979 },
  { name: "Salinas Valley, US", lat: 36.6777, lon: -121.6555 },
  { name: "Highlands, KE", lat: -0.4244, lon: 36.9517 },
];

const SIM_PRESETS = [
  {
    name: "Monsoon Outbreak",
    temp: 19,
    humidity: 94,
    rain: 6.5,
    tag: "High Spore Threat",
  },
  {
    name: "Dry Summer Midday",
    temp: 31,
    humidity: 38,
    rain: 0,
    tag: "Low Risk",
  },
  {
    name: "Cool Foggy Morning",
    temp: 15,
    humidity: 86,
    rain: 0.8,
    tag: "Moderate Sporulation",
  },
  {
    name: "Post-Rain Inoculum",
    temp: 22,
    humidity: 82,
    rain: 3.2,
    tag: "Critical Spray Window",
  },
];

const WeatherRiskCard = () => {
  const [mode, setMode] = useState("live"); // "live" or "simulate"
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("Current Field");
  const [searchCity, setSearchCity] = useState("");
  const [error, setError] = useState(null);

  // Simulation Sliders state
  const [simTemp, setSimTemp] = useState(19);
  const [simHumidity, setSimHumidity] = useState(85);
  const [simRain, setSimRain] = useState(1.2);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherData(pos.coords.latitude, pos.coords.longitude, "Current Location");
        },
        () => {
          fetchWeatherData(PRESET_LOCATIONS[0].lat, PRESET_LOCATIONS[0].lon, PRESET_LOCATIONS[0].name);
        }
      );
    } else {
      fetchWeatherData(PRESET_LOCATIONS[0].lat, PRESET_LOCATIONS[0].lon, PRESET_LOCATIONS[0].name);
    }
  }, []);

  const calculateRiskIndex = (temp, humidity, precipitation) => {
    let riskScore = 0;
    if (humidity > 85) riskScore += 50;
    else if (humidity > 70) riskScore += 30;
    else if (humidity > 50) riskScore += 15;

    if (temp >= 14 && temp <= 24) riskScore += 35;
    else if (temp >= 10 && temp <= 28) riskScore += 20;

    if (precipitation > 0.2) riskScore += 15;

    let riskLevel = "Low Risk";
    let riskClass = "low";
    let sprayAdvice = "Conditions are dry and stable. Standard cultural maintenance.";

    if (riskScore >= 75) {
      riskLevel = "Critical Outbreak Risk";
      riskClass = "critical";
      sprayAdvice = "High moisture and optimal temperature window. Spores can germinate in under 6 hours. Apply systemic protection.";
    } else if (riskScore >= 50) {
      riskLevel = "High Blight Risk";
      riskClass = "high";
      sprayAdvice = "Elevated humidity favors fungal sporulation. Apply protective fungicide prior to forecasted precipitation.";
    } else if (riskScore >= 30) {
      riskLevel = "Moderate Risk";
      riskClass = "moderate";
      sprayAdvice = "Favorable dew point. Inspect lower canopy for initial lesion flecks.";
    }

    return { riskScore, riskLevel, riskClass, sprayAdvice };
  };

  const fetchWeatherData = async (lat, lon, label) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&forecast_days=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather service unreachable");
      const data = await res.json();

      const current = data.current || {};
      const temp = Math.round(current.temperature_2m ?? 20);
      const humidity = Math.round(current.relative_humidity_2m ?? 65);
      const precipitation = current.precipitation ?? 0;
      const windSpeed = Math.round(current.wind_speed_10m ?? 8);

      const riskData = calculateRiskIndex(temp, humidity, precipitation);

      setWeather({
        temp,
        humidity,
        windSpeed,
        precipitation,
        ...riskData,
      });
      setLocationName(label);
    } catch (err) {
      console.error("Weather error:", err);
      setError("Unable to load real-time microclimate data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchCity.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchCity
      )}&count=1&language=en&format=json`;
      const res = await fetch(geoUrl);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        fetchWeatherData(
          place.latitude,
          place.longitude,
          `${place.name}, ${place.country_code || ""}`
        );
        setSearchCity("");
      } else {
        setError(`City "${searchCity}" not found.`);
        setLoading(false);
      }
    } catch (err) {
      setError("Location lookup failed.");
      setLoading(false);
    }
  };

  const applyPreset = (preset) => {
    setSimTemp(preset.temp);
    setSimHumidity(preset.humidity);
    setSimRain(preset.rain);
  };

  // Simulated Weather Calculations
  const simRiskData = calculateRiskIndex(simTemp, simHumidity, simRain);

  return (
    <div className="meta-weather-card">
      <div className="weather-card-top-bar">
        <div className="weather-brand-block">
          <IconRadar size={20} className="weather-radar-icon" />
          <div>
            <h3 className="weather-card-heading">Blight Outbreak & Microclimate Radar</h3>
            <p className="weather-location-text">
              {mode === "live" ? `Live Station: ${locationName}` : "Interactive Microclimate Simulator"}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="weather-mode-toggle-group">
          <button
            type="button"
            className={`mode-toggle-btn ${mode === "live" ? "active" : ""}`}
            onClick={() => setMode("live")}
          >
            Live GPS Weather
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${mode === "simulate" ? "active" : ""}`}
            onClick={() => setMode("simulate")}
          >
            <IconSparkles size={13} />
            <span>Risk Simulator</span>
          </button>
        </div>
      </div>

      {mode === "live" ? (
        <>
          {/* Preset Location Shortcuts */}
          <div className="location-preset-pills-row">
            {PRESET_LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                type="button"
                className={`preset-pill ${locationName.includes(loc.name.split(",")[0]) ? "active" : ""}`}
                onClick={() => fetchWeatherData(loc.lat, loc.lon, loc.name)}
              >
                {loc.name}
              </button>
            ))}
          </div>

          <form className="location-search-box" onSubmit={handleCitySearch}>
            <input
              type="text"
              placeholder="Search custom farm city (e.g. Lima, London, Punjab)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="location-input-field"
            />
            <button type="submit" className="location-submit-btn">
              <IconSearch size={14} />
            </button>
          </form>

          {loading ? (
            <div className="weather-state-loading">
              <span>Retrieving atmospheric conditions...</span>
            </div>
          ) : error ? (
            <div className="weather-error-box">{error}</div>
          ) : weather ? (
            <div className="weather-layout-grid">
              <div className={`risk-status-panel ${weather.riskClass}`}>
                <div className="risk-level-heading">
                  <span className="risk-indicator-badge"></span>
                  <span className="risk-text-label">{weather.riskLevel}</span>
                </div>
                <div className="risk-bar-track">
                  <div
                    className="risk-bar-fill"
                    style={{ width: `${weather.riskScore}%` }}
                  ></div>
                </div>
                <p className="risk-guidance-summary">{weather.sprayAdvice}</p>
              </div>

              <div className="weather-stats-grid">
                <div className="weather-stat-cell">
                  <span className="cell-label">Temperature</span>
                  <span className="cell-value">{weather.temp}°C</span>
                  <span className="cell-sub">
                    {weather.temp >= 15 && weather.temp <= 22 ? "Optimal for blight" : "Standard range"}
                  </span>
                </div>

                <div className="weather-stat-cell">
                  <span className="cell-label">Relative Humidity</span>
                  <span className={`cell-value ${weather.humidity > 80 ? "high" : ""}`}>
                    {weather.humidity}%
                  </span>
                  <span className="cell-sub">
                    {weather.humidity > 80 ? "High spore moisture" : "Dry canopy"}
                  </span>
                </div>

                <div className="weather-stat-cell">
                  <span className="cell-label">Wind Velocity</span>
                  <span className="cell-value">{weather.windSpeed} km/h</span>
                  <span className="cell-sub">
                    {weather.windSpeed < 15 ? "Safe for spraying" : "Drift risk"}
                  </span>
                </div>

                <div className="weather-stat-cell">
                  <span className="cell-label">24h Rainfall</span>
                  <span className="cell-value">{weather.precipitation} mm</span>
                  <span className="cell-sub">Precipitation total</span>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        /* Interactive Simulation Mode */
        <div className="interactive-simulation-panel">
          {/* Quick Scenario Presets */}
          <div className="sim-presets-bar">
            <span className="sim-preset-label">Quick Microclimate Scenarios:</span>
            <div className="sim-preset-chips">
              {SIM_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className="scenario-chip-btn"
                  onClick={() => applyPreset(p)}
                >
                  <span className="scenario-chip-title">{p.name}</span>
                  <span className="scenario-chip-sub">{p.temp}°C | {p.humidity}% RH</span>
                </button>
              ))}
            </div>
          </div>

          <div className="simulation-sliders-box">
            <div className="sim-slider-row">
              <div className="sim-slider-label-row">
                <span>Simulated Air Temperature</span>
                <strong>{simTemp}°C</strong>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                value={simTemp}
                onChange={(e) => setSimTemp(Number(e.target.value))}
                className="sim-range-slider"
              />
            </div>

            <div className="sim-slider-row">
              <div className="sim-slider-label-row">
                <span>Simulated Relative Humidity</span>
                <strong>{simHumidity}%</strong>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={simHumidity}
                onChange={(e) => setSimHumidity(Number(e.target.value))}
                className="sim-range-slider"
              />
            </div>

            <div className="sim-slider-row">
              <div className="sim-slider-label-row">
                <span>Simulated 24h Rainfall</span>
                <strong>{simRain} mm</strong>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={simRain}
                onChange={(e) => setSimRain(Number(e.target.value))}
                className="sim-range-slider"
              />
            </div>
          </div>

          <div className={`risk-status-panel ${simRiskData.riskClass}`}>
            <div className="risk-level-heading">
              <span className="risk-indicator-badge"></span>
              <span className="risk-text-label">{simRiskData.riskLevel}</span>
            </div>
            <div className="risk-bar-track">
              <div
                className="risk-bar-fill"
                style={{ width: `${simRiskData.riskScore}%` }}
              ></div>
            </div>
            <p className="risk-guidance-summary">{simRiskData.sprayAdvice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherRiskCard;
