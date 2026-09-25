import React from "react";
import "./MarketPage.css";
import AgriMarketCommodityTracker from "../components/AgriMarketCommodityTracker";
import GovtSubsidyMatcher from "../components/GovtSubsidyMatcher";
import { IconTrendingUp, IconShield } from "../components/Icons";

export default function MarketPage() {
  return (
    <div className="market-page-container">
      {/* Page Hero Header */}
      <div className="market-hero">
        <div className="market-hero-content">
          <div className="hero-badge-pill market">
            <IconTrendingUp size={16} />
            <span>AGRIBUSINESS & COMMODITY INTELLIGENCE</span>
          </div>
          <h1 className="hero-title">Agricultural Mandi Market & Government Subsidy Hub</h1>
          <p className="hero-subtitle">
            Track real-time APMC wholesale commodity prices, optimize your harvest timing to beat price crashes, and discover eligible government grants and subsidies.
          </p>
        </div>
      </div>

      {/* Main Market Modules */}
      <div className="market-modules-stack">
        <AgriMarketCommodityTracker />
        <GovtSubsidyMatcher />
      </div>
    </div>
  );
}
