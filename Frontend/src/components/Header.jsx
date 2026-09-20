import React from "react";
import "./Header.css";

const Header = () => (
  <header className="header-container" id="home">
    <div className="header-top">
      <div className="header-brand">
        <span className="brand-icon">🌱</span>
        <h1 className="header-title">Plant Disease Detector</h1>
      </div>
      <nav className="nav-bar">
        <a href="#home" className="nav-link">Home</a>
        <a href="#detect" className="nav-link">Detect</a>
        <a href="#diseases" className="nav-link">Diseases</a>
        <a href="#about" className="nav-link">About</a>
      </nav>
    </div>
  </header>
);

export default Header;

