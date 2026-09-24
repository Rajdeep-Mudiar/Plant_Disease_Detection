import React, { useState, useEffect } from "react";
import "./Navbar.css";
import {
  IconPlant,
  IconHome,
  IconScanner,
  IconRadar,
  IconCalculator,
  IconBook,
  IconHistory,
  IconSun,
  IconMoon,
} from "./Icons";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: IconHome },
  { id: "detect", label: "Scanner", icon: IconScanner },
  { id: "weather", label: "Radar", icon: IconRadar },
  { id: "calculator", label: "Dosage", icon: IconCalculator },
  { id: "encyclopedia", label: "Encyclopedia", icon: IconBook },
  { id: "history", label: "Journal", icon: IconHistory },
];

const Navbar = ({
  activeRoute,
  onNavigate,
  backendOnline,
  scanCount = 0,
  theme = "light",
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`meta-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand-group" onClick={() => handleNavClick("home")}>
          <div className="brand-badge-icon">
            <IconPlant size={22} className="brand-svg" />
          </div>
          <div className="brand-text-column">
            <span className="brand-title">AgroPath</span>
            <span className="brand-subtitle">Plant Pathology System</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="navbar-menu-desktop">
          {NAV_ITEMS.map((item) => {
            const IconComp = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-button ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComp size={16} className="nav-button-icon" />
                <span>{item.label}</span>
                {item.id === "history" && scanCount > 0 && (
                  <span className="nav-counter">{scanCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Status & Actions */}
        <div className="navbar-actions-right">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <IconMoon size={16} className="theme-icon moon" />
            ) : (
              <IconSun size={16} className="theme-icon sun" />
            )}
          </button>

          <div className={`status-pill ${backendOnline ? "online" : "offline"}`}>
            <span className="status-indicator-dot"></span>
            <span className="status-label-text">
              {backendOnline ? "System Ready" : "API Offline"}
            </span>
          </div>

          <button
            type="button"
            className="navbar-cta-btn"
            onClick={() => handleNavClick("detect")}
          >
            <IconScanner size={15} />
            <span>Scan Leaf</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`mobile-toggle-button ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          {NAV_ITEMS.map((item) => {
            const IconComp = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`mobile-nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComp size={18} />
                <span>{item.label}</span>
                {item.id === "history" && scanCount > 0 && (
                  <span className="mobile-counter-pill">{scanCount}</span>
                )}
              </button>
            );
          })}

          <div className="mobile-theme-row">
            <span className="mobile-theme-label">Theme Mode:</span>
            <button
              type="button"
              className="mobile-theme-toggle-btn"
              onClick={onToggleTheme}
            >
              {theme === "light" ? (
                <>
                  <IconMoon size={15} />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <IconSun size={15} />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
