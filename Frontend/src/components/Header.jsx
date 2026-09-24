import React from "react";
import "./Header.css";

const Header = () => (
  <header className="header-container" id="home">
    <div className="header-top">
      <div className="header-brand">
        <span className="brand-icon">🌱</span>
        <div>
          <h1 className="header-title">Plant Disease Detector</h1>
          <span className="brand-badge">AI Agro-Pathology 2.0</span>
        </div>
      </div>
      <nav className="nav-bar">
        <a href="#home" className="nav-link">Home</a>
        <a href="#detect" className="nav-link">Scan</a>
        <a href="#weather" className="nav-link">Radar</a>
        <a href="#calculator" className="nav-link">Dosage</a>
        <a href="#diseases" className="nav-link">Encyclopedia</a>
      </nav>
    </div>
  </header>
);

export default Header;
