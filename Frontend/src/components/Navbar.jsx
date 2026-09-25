import React, { useState, useEffect } from "react";
import "./Navbar.css";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "../context/LanguageContext";
import {
  IconPlant,
  IconHome,
  IconScanner,
  IconRadar,
  IconCalculator,
  IconBook,
  IconHistory,
  IconActivity,
  IconSun,
  IconMoon,
  IconTrendingUp,
  IconShield,
} from "./Icons";

const NAV_ITEMS = [
  { id: "home", translationKey: "nav_home", defaultLabel: "Home", icon: IconHome },
  { id: "detect", translationKey: "nav_scanner", defaultLabel: "Scanner", icon: IconScanner },
  { id: "twin", translationKey: "nav_twin", defaultLabel: "Digital Twin", icon: IconActivity },
  { id: "agronomy", translationKey: "nav_agronomy", defaultLabel: "Crop Science", icon: IconPlant },
  { id: "iot", translationKey: "nav_iot", defaultLabel: "IoT Sensors", icon: IconRadar },
  { id: "market", translationKey: "nav_market", defaultLabel: "Agri-Market", icon: IconTrendingUp },
  { id: "crisis", translationKey: "nav_crisis", defaultLabel: "Crisis Sim", icon: IconShield },
  { id: "weather", translationKey: "nav_radar", defaultLabel: "Radar", icon: IconRadar },
  { id: "calculator", translationKey: "nav_dosage", defaultLabel: "Dosage", icon: IconCalculator },
  { id: "encyclopedia", translationKey: "nav_encyclopedia", defaultLabel: "Encyclopedia", icon: IconBook },
  { id: "history", translationKey: "nav_journal", defaultLabel: "Journal", icon: IconHistory },
];

const Navbar = ({
  activeRoute,
  onNavigate,
  backendOnline,
  scanCount = 0,
  theme = "light",
  onToggleTheme,
}) => {
  const { t } = useTranslation();
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
            <span className="brand-subtitle">{t("tagline", "Plant Pathology System")}</span>
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
                <span>{t(item.translationKey, item.defaultLabel)}</span>
                {item.id === "history" && scanCount > 0 && (
                  <span className="nav-counter">{scanCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Status & Actions */}
        <div className="navbar-actions-right">
          {/* Language Switcher Dropdown */}
          <LanguageSelector />

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
              {backendOnline ? t("system_ready", "System Ready") : t("api_offline", "API Offline")}
            </span>
          </div>

          <button
            type="button"
            className="navbar-cta-btn"
            onClick={() => handleNavClick("detect")}
          >
            <IconScanner size={15} />
            <span>{t("nav_scan_leaf", "Scan Leaf")}</span>
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
                <span>{t(item.translationKey, item.defaultLabel)}</span>
                {item.id === "history" && scanCount > 0 && (
                  <span className="mobile-counter-pill">{scanCount}</span>
                )}
              </button>
            );
          })}

          <div className="mobile-controls-row">
            <LanguageSelector />

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

