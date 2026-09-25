import React, { useState } from "react";
import "./AgriMarketCommodityTracker.css";
import { IconTrendingUp, IconActivity, IconClock, IconShield } from "./Icons";

const COMMODITIES = [
  {
    id: "potato",
    name: "Table & Processing Potato (Kufri Jyoti)",
    icon: "🥔",
    currentPrice: "₹1,850 / Quintal ($22.2/100kg)",
    trend: "+6.4% this week",
    trendDir: "up",
    aiRecommendation: "📈 HOLD & CURE: Price forecasted to peak at ₹2,150 in 18 days due to regional supply crunch.",
    shelfLifeDays: 45,
    coldStorageTemp: "4–7°C (90% RH)",
    rotRiskScore: "Low (if cured)",
    priceHistory: [
      { day: "Day -15", price: 1620 },
      { day: "Day -10", price: 1680 },
      { day: "Day -5", price: 1740 },
      { day: "Today", price: 1850 },
      { day: "+7 Days (AI)", price: 1980 },
      { day: "+14 Days (AI)", price: 2150 },
    ],
  },
  {
    id: "tomato",
    name: "Commercial Red Tomato (Hybrid)",
    icon: "🍅",
    currentPrice: "₹2,400 / Quintal ($28.8/100kg)",
    trend: "-4.2% this week",
    trendDir: "down",
    aiRecommendation: "⚡ HARVEST & SELL IMMEDIATELY: High humidity increases late blight rot risk; market arrival surge coming.",
    shelfLifeDays: 8,
    coldStorageTemp: "10–12°C",
    rotRiskScore: "High (Perishable)",
    priceHistory: [
      { day: "Day -15", price: 2800 },
      { day: "Day -10", price: 2650 },
      { day: "Day -5", price: 2500 },
      { day: "Today", price: 2400 },
      { day: "+7 Days (AI)", price: 2150 },
      { day: "+14 Days (AI)", price: 1900 },
    ],
  },
  {
    id: "corn",
    name: "Yellow Maize / Field Corn",
    icon: "🌽",
    currentPrice: "₹2,180 / Quintal ($26.1/100kg)",
    trend: "+2.1% this week",
    trendDir: "up",
    aiRecommendation: "🌾 STABLE: Dry down in field to 14% moisture before silo storage to prevent Aspergillus ear rot.",
    shelfLifeDays: 180,
    coldStorageTemp: "Ambient Dry (<14% Moisture)",
    rotRiskScore: "Minimal",
    priceHistory: [
      { day: "Day -15", price: 2100 },
      { day: "Day -10", price: 2120 },
      { day: "Day -5", price: 2150 },
      { day: "Today", price: 2180 },
      { day: "+7 Days (AI)", price: 2220 },
      { day: "+14 Days (AI)", price: 2260 },
    ],
  },
  {
    id: "apple",
    name: "Royal Delicious Apple",
    icon: "🍎",
    currentPrice: "₹7,200 / Quintal ($86.4/100kg)",
    trend: "+8.5% this week",
    trendDir: "up",
    aiRecommendation: "❄️ CONTROLLED ATMOSPHERE STORAGE: High export premium in 30 days. Treat with 1-MCP.",
    shelfLifeDays: 120,
    coldStorageTemp: "0.5–2°C (CA Storage)",
    rotRiskScore: "Low (Under CA)",
    priceHistory: [
      { day: "Day -15", price: 6200 },
      { day: "Day -10", price: 6500 },
      { day: "Day -5", price: 6850 },
      { day: "Today", price: 7200 },
      { day: "+7 Days (AI)", price: 7600 },
      { day: "+14 Days (AI)", price: 8100 },
    ],
  },
];

export default function AgriMarketCommodityTracker() {
  const [selectedCropId, setSelectedCropId] = useState("potato");

  const activeCrop = COMMODITIES.find((c) => c.id === selectedCropId) || COMMODITIES[0];

  return (
    <div className="agri-market-card">
      <div className="market-header">
        <div className="market-title-group">
          <div className="market-icon-frame">
            <IconTrendingUp size={22} />
          </div>
          <div>
            <div className="market-badge-row">
              <span className="market-badge">AGRI-COMMODITY INTELLIGENCE</span>
              <span className="market-sub-badge">Live Mandi & APMC Price Predictor</span>
            </div>
            <h3 className="market-main-title">Live Agricultural Mandi & Harvest Price Index</h3>
            <p className="market-sub-title">
              Matches disease decay risk with future market price curves to advise whether to harvest & sell immediately or store in cold storage for peak price arbitrage.
            </p>
          </div>
        </div>

        {/* Commodity Selector Pills */}
        <div className="market-selector-pills">
          {COMMODITIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`m-pill-btn ${selectedCropId === c.id ? "active" : ""}`}
              onClick={() => setSelectedCropId(c.id)}
            >
              <span>{c.icon}</span>
              <span>{c.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="market-body-grid">
        {/* Left: Price Trend Chart & AI Harvest Advisory */}
        <div className="market-chart-column">
          <div className="current-price-hud">
            <div className="price-primary-row">
              <span className="crop-big-icon">{activeCrop.icon}</span>
              <div>
                <span className="crop-fullname">{activeCrop.name}</span>
                <div className="price-val-group">
                  <span className="price-tag">{activeCrop.currentPrice}</span>
                  <span className={`trend-badge ${activeCrop.trendDir}`}>
                    {activeCrop.trend}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphical Price Bar & AI Projection */}
          <div className="price-bars-container">
            <span className="bars-title">15-Day Historical & AI 14-Day Forward Price Trajectory</span>
            <div className="price-bars-flex">
              {activeCrop.priceHistory.map((item, idx) => {
                const maxPrice = Math.max(...activeCrop.priceHistory.map((p) => p.price));
                const minPrice = Math.min(...activeCrop.priceHistory.map((p) => p.price)) * 0.85;
                const heightPercent = Math.max(25, ((item.price - minPrice) / (maxPrice - minPrice)) * 100);
                const isProjected = item.day.includes("AI");

                return (
                  <div key={idx} className="price-bar-col">
                    <span className="bar-price-val">₹{item.price}</span>
                    <div className="bar-slot">
                      <div
                        className={`bar-fill ${isProjected ? "projected" : "actual"}`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>
                    <span className="bar-day-label">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Decision Alert Box */}
          <div className="ai-harvest-advice-box">
            <div className="advice-badge-row">
              <IconShield size={16} />
              <span className="adv-badge-lbl">AI HARVEST TIMING ADVISORY:</span>
            </div>
            <p className="adv-text-main">{activeCrop.aiRecommendation}</p>
          </div>
        </div>

        {/* Right: Storage Longevity & Post-Harvest Quality Clock */}
        <div className="market-storage-column">
          <div className="storage-decay-card">
            <div className="storage-hdr">
              <IconClock size={18} />
              <span className="storage-title">Cold Storage & Post-Harvest Shelf Life</span>
            </div>

            <div className="storage-stats-grid">
              <div className="st-tile">
                <span className="st-label">Max Shelf Life Window:</span>
                <span className="st-val green">{activeCrop.shelfLifeDays} Days</span>
              </div>
              <div className="st-tile">
                <span className="st-label">Optimal Cold Temp:</span>
                <span className="st-val blue">{activeCrop.coldStorageTemp}</span>
              </div>
              <div className="st-tile">
                <span className="st-label">Post-Harvest Rot Risk:</span>
                <span className={`st-val ${activeCrop.rotRiskScore.includes("High") ? "red" : "orange"}`}>
                  {activeCrop.rotRiskScore}
                </span>
              </div>
              <div className="st-tile">
                <span className="st-label">Market Volatility:</span>
                <span className="st-val purple">Medium-High</span>
              </div>
            </div>

            <div className="mandi-arbitrage-tip">
              <span className="tip-hdr">💡 Arbitrage Tip:</span>
              <p className="tip-p">
                Sell 40% of harvest at current market rate to cover input costs, and hold remaining 60% in sanitized cold storage to capture the forecasted ₹300/Qtl price surge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
