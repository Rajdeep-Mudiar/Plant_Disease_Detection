import React from "react";
import "./Footer.css";
import { IconPlant, IconGlobe } from "./Icons";
import { useTranslation } from "../context/LanguageContext";

const Footer = ({ onNavigate }) => {
  const { t, activeLanguageObj } = useTranslation();

  return (
    <footer className="meta-footer">
      <div className="footer-inner-container">
        <div className="footer-brand-segment">
          <div className="footer-brand-title-row">
            <IconPlant size={18} className="footer-plant-svg" />
            <span className="footer-app-name">AgroPath</span>
          </div>
          <p className="footer-summary-text">
            {t(
              "footer_summary",
              "Agricultural computer vision and agronomic intelligence platform dedicated to early foliar disease detection and crop protection."
            )}
          </p>
          <div className="footer-active-status">
            <span className="status-live-dot"></span>
            <span>TensorFlow Deep Learning Architecture</span>
          </div>
        </div>

        <div className="footer-links-segment">
          <h4 className="footer-segment-heading">Platform</h4>
          <ul className="footer-links-list">
            <li><button onClick={() => onNavigate("home")}>{t("nav_home", "Home Dashboard")}</button></li>
            <li><button onClick={() => onNavigate("detect")}>{t("nav_scanner", "Diagnostic Scanner")}</button></li>
            <li><button onClick={() => onNavigate("twin")}>{t("nav_twin", "Digital Twin Farm")}</button></li>
            <li><button onClick={() => onNavigate("weather")}>{t("nav_radar", "Blight Outbreak Radar")}</button></li>
            <li><button onClick={() => onNavigate("calculator")}>{t("nav_dosage", "Dosage & Tank Calculator")}</button></li>
            <li><button onClick={() => onNavigate("encyclopedia")}>{t("nav_encyclopedia", "Pathology Reference")}</button></li>
            <li><button onClick={() => onNavigate("history")}>{t("nav_journal", "Field Scan Journal")}</button></li>
          </ul>
        </div>

        <div className="footer-links-segment">
          <h4 className="footer-segment-heading">Pathology Scope</h4>
          <ul className="footer-links-list static-text">
            <li>Early Blight (<em>Alternaria solani</em>)</li>
            <li>Late Blight (<em>Phytophthora infestans</em>)</li>
            <li>Healthy Foliage Baseline</li>
            <li>Integrated Pest Management</li>
          </ul>
        </div>
      </div>

      <div className="footer-legal-bar">
        <div className="legal-left-text">
          <span>© {new Date().getFullYear()} AgroPath • Agricultural Intelligence</span>
        </div>
        <div className="legal-right-text">
          <span>AI predictions are intended for field guidance. Verify critical commercial outbreaks with regional agronomy extension officers.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
