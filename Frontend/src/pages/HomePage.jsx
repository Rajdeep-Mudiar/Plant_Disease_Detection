import React, { useState } from "react";
import "./HomePage.css";
import { useTranslation } from "../context/LanguageContext";
import {
  IconScanner,
  IconRadar,
  IconCalculator,
  IconBook,
  IconShield,
  IconCheck,
  IconSparkles,
  IconActivity,
} from "../components/Icons";

const FAQS = [
  {
    q: "How does the deep learning leaf classifier identify plant pathology?",
    a: "The neural network is trained on thousands of curated high-resolution foliar pathology images. It extracts micro-morphological spatial features (such as concentric chlorotic halos, necrotic bullseye rings, and water-soaked lesions) to classify the pathogen class and compute confidence probabilities.",
  },
  {
    q: "What is the XAI Lesion Attention Heatmap and how is severity calculated?",
    a: "Explainable AI (XAI) overlays visual segmentation masks over infected leaf tissue. By isolating diseased necrotic zones against the healthy green leaf lamina, the engine calculates the infected surface area ratio percentage and severity classification (Mild, Moderate, Severe).",
  },
  {
    q: "How does the Blight Outbreak Radar predict fungal risks?",
    a: "Fungal pathogens such as Phytophthora infestans and Alternaria solani require specific microclimatic windows (relative humidity >80%, temperatures 14°C–24°C, and extended leaf wetness). The radar aggregates live Open-Meteo satellite observations or simulated parameters to generate immediate spray warnings.",
  },
  {
    q: "Can I generate certified diagnostic reports for insurance or field records?",
    a: "Yes. Every scan can generate an official Diagnostic Certificate PDF complete with specimen metadata, class probability breakdown, XAI severity percentage, and chemical IPM prescription.",
  },
];

const HomePage = ({ onNavigate, onSelectSample }) => {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleQuickTest = (sampleKey) => {
    if (onSelectSample) {
      onSelectSample(sampleKey);
    }
    onNavigate("detect");
  };

  return (
    <div className="meta-home-container">
      {/* Hero Section */}
      <section className="meta-hero-card">
        <div className="hero-inner-content">
          <div className="meta-badge-indicator">
            <span className="badge-live-dot"></span>
            <span>{t("tagline", "Agricultural Computer Vision Platform")}</span>
          </div>
          <h1 className="hero-headline">
            {t("hero_title", "Plant Pathology & Diagnostic Intelligence")}
          </h1>
          <p className="hero-description">
            {t(
              "hero_subtitle",
              "Identify foliar plant diseases with deep learning classification, inspect neural lesion attention heatmaps, calculate knapsack chemical dosages, and track atmospheric blight outbreak risks in real time."
            )}
          </p>

          <div className="hero-action-buttons">
            <button
              type="button"
              className="meta-primary-btn"
              onClick={() => onNavigate("detect")}
            >
              <IconScanner size={16} />
              <span>{t("start_diagnosis", "Launch Leaf Scanner")}</span>
            </button>
            <button
              type="button"
              className="meta-secondary-btn"
              onClick={() => onNavigate("twin")}
            >
              <IconActivity size={16} />
              <span>{t("explore_twin", "Digital Twin Farm")}</span>
            </button>
            <button
              type="button"
              className="meta-secondary-btn"
              onClick={() => onNavigate("weather")}
            >
              <IconRadar size={16} />
              <span>{t("spore_radar", "Blight Outbreak Radar")}</span>
            </button>
            <button
              type="button"
              className="meta-secondary-btn"
              onClick={() => onNavigate("calculator")}
            >
              <IconCalculator size={16} />
              <span>{t("dosage_calc", "Dosage Simulator")}</span>
            </button>
          </div>

          <div className="hero-metrics-bar">
            <div className="metric-cell">
              <span className="metric-number">98.4%</span>
              <span className="metric-subtext">Validation Accuracy</span>
            </div>
            <div className="metric-separator"></div>
            <div className="metric-cell">
              <span className="metric-number">&lt; 300ms</span>
              <span className="metric-subtext">Inference Latency</span>
            </div>
            <div className="metric-separator"></div>
            <div className="metric-cell">
              <span className="metric-number">5 Crops</span>
              <span className="metric-subtext">Pathology Library</span>
            </div>
            <div className="metric-separator"></div>
            <div className="metric-cell">
              <span className="metric-number">TensorFlow</span>
              <span className="metric-subtext">Neural Architecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick-Test Sandbox */}
      <section className="quick-test-section">
        <div className="quick-test-card">
          <div className="quick-test-header">
            <div className="quick-test-title-col">
              <div className="interactive-sparkle-badge">
                <IconSparkles size={14} />
                <span>1-Click Interactive Diagnostic Playground</span>
              </div>
              <h3 className="quick-test-heading">Test Live Neural Detection on Curated Specimens</h3>
              <p className="quick-test-desc">
                Select any specimen below to instantly load canvas image data into the AI Scanner and run live segmentation.
              </p>
            </div>
          </div>

          <div className="quick-test-specimen-grid">
            <div
              className="specimen-interactive-card"
              onClick={() => handleQuickTest("healthy")}
            >
              <div className="specimen-badge-row">
                <span className="specimen-tag healthy">Healthy Specimen</span>
                <span className="specimen-confidence">Target: 0% Lesion</span>
              </div>
              <h4 className="specimen-card-title">Potato Healthy Foliage</h4>
              <p className="specimen-card-sub">Crisp green lamina with intact stomatal network and zero pathogen chlorosis.</p>
              <div className="specimen-card-cta">
                <span>Run Instant AI Scan</span>
                <span className="arrow-glyph">→</span>
              </div>
            </div>

            <div
              className="specimen-interactive-card"
              onClick={() => handleQuickTest("early_blight")}
            >
              <div className="specimen-badge-row">
                <span className="specimen-tag early">Early Blight</span>
                <span className="specimen-confidence">Target: Alternaria</span>
              </div>
              <h4 className="specimen-card-title">Alternaria solani Specimen</h4>
              <p className="specimen-card-sub">Classic target-board concentric necrotic spots with chlorotic yellow boundaries.</p>
              <div className="specimen-card-cta">
                <span>Run Instant AI Scan</span>
                <span className="arrow-glyph">→</span>
              </div>
            </div>

            <div
              className="specimen-interactive-card"
              onClick={() => handleQuickTest("late_blight")}
            >
              <div className="specimen-badge-row">
                <span className="specimen-tag late">Late Blight</span>
                <span className="specimen-confidence">Target: Phytophthora</span>
              </div>
              <h4 className="specimen-card-title">Phytophthora infestans Specimen</h4>
              <p className="specimen-card-sub">Aggressive water-soaked dark lesions with surrounding sporulation margins.</p>
              <div className="specimen-card-cta">
                <span>Run Instant AI Scan</span>
                <span className="arrow-glyph">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="meta-features-section">
        <div className="meta-section-header">
          <h2 className="section-main-heading">Integrated Agricultural Diagnostics Suite</h2>
          <p className="section-sub-heading">
            Modern agronomic tools designed for precision farming, plant health monitoring, and crop loss prevention.
          </p>
        </div>

        <div className="meta-cards-grid">
          {/* Feature 1 */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("detect")}
          >
            <div className="tool-icon-frame">
              <IconScanner size={20} />
            </div>
            <h3 className="tool-card-title">AI Leaf Scanner & Heatmap</h3>
            <p className="tool-card-description">
              Upload or snap a specimen with live camera capture. View explainable AI
              segmentation maps highlighting infection hotspots and leaf damage percentage.
            </p>
            <div className="tool-card-footer">
              <span>Open Scanner</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("weather")}
          >
            <div className="tool-icon-frame">
              <IconRadar size={20} />
            </div>
            <h3 className="tool-card-title">Microclimate Blight Radar</h3>
            <p className="tool-card-description">
              Live weather-based Blight Risk Index calculation from relative humidity (&gt;80%)
              and temperature windows to determine optimal spray timing before rain.
            </p>
            <div className="tool-card-footer">
              <span>Open Radar</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("calculator")}
          >
            <div className="tool-icon-frame">
              <IconCalculator size={20} />
            </div>
            <h3 className="tool-card-title">Dosage & Tank Simulator</h3>
            <p className="tool-card-description">
              Calculate exact chemical powder weights, water volume, and 16L knapsack
              sprayer tank loads based on field acreage and fungicide formulations.
            </p>
            <div className="tool-card-footer">
              <span>Open Simulator</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>

          {/* Feature 4: Crop Science & Physiology Suite */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("agronomy")}
          >
            <div className="tool-icon-frame">
              <IconPlant size={20} />
            </div>
            <h3 className="tool-card-title">🔬 Crop Science & Physiology</h3>
            <p className="tool-card-description">
              14-day disease progression time-lapse, 4-season biological crop rotation,
              and chemical burn phytotoxicity risk indices.
            </p>
            <div className="tool-card-footer">
              <span>Open Science Lab</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>

          {/* Feature 5: IoT Hardware & Sensor Network */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("iot")}
          >
            <div className="tool-icon-frame">
              <IconRadar size={20} />
            </div>
            <h3 className="tool-card-title">🌐 Virtual IoT Hardware Suite</h3>
            <p className="tool-card-description">
              Multi-depth soil NPK/EC probes at 5–30cm, optical camera pheromone insect traps,
              and ground rover sub-canopy robotic feeds.
            </p>
            <div className="tool-card-footer">
              <span>Open IoT Suite</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>

          {/* Feature 6: Agri-Market & Government Grants */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("market")}
          >
            <div className="tool-icon-frame">
              <IconCalculator size={20} />
            </div>
            <h3 className="tool-card-title">💰 Agri-Market & Subsidies</h3>
            <p className="tool-card-description">
              Live Mandi commodity prices with AI harvest timing recommendations,
              cold storage shelf-life clocks, and government subsidy matchers.
            </p>
            <div className="tool-card-footer">
              <span>Open Market Hub</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>

          {/* Feature 7: 60-Second Outbreak Crisis Simulator */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("crisis")}
          >
            <div className="tool-icon-frame">
              <IconActivity size={20} />
            </div>
            <h3 className="tool-card-title">🎮 60-Sec Outbreak Crisis Sim</h3>
            <p className="tool-card-description">
              Fast-paced tactical crisis response scenario. Manage emergency budgets,
              drone chemical payloads, and containment barriers.
            </p>
            <div className="tool-card-footer">
              <span>Play Challenge</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>

          {/* Feature 8: Digital Farm Twin */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("twin")}
          >
            <div className="tool-icon-frame">
              <IconActivity size={20} />
            </div>
            <h3 className="tool-card-title">Digital Farm Twin & GIS</h3>
            <p className="tool-card-description">
              Simulate 6-sector biophysical telemetry, spore dispersion contagion models,
              precision drone spray deployments, and sub-surface fertigation.
            </p>
            <div className="tool-card-footer">
              <span>Launch Twin</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>

          {/* Feature 9: Pathology Library */}
          <div
            className="meta-tool-card"
            onClick={() => onNavigate("encyclopedia")}
          >
            <div className="tool-icon-frame">
              <IconBook size={20} />
            </div>
            <h3 className="tool-card-title">Pathology Reference Library</h3>
            <p className="tool-card-description">
              Comprehensive disease profiles for Potato, Tomato, Corn, and Apple. Review
              diagnostic symptom checklists, weather triggers, and IPM protocols.
            </p>
            <div className="tool-card-footer">
              <span>View Library</span>
              <span className="arrow-glyph">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="meta-faq-section">
        <div className="meta-section-header">
          <h2 className="section-main-heading">Frequently Asked Questions</h2>
          <p className="section-sub-heading">Common inquiries regarding machine learning accuracy, fungicides, and field protocols.</p>
        </div>

        <div className="faq-accordion-list">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`faq-item-card ${isOpen ? "open" : ""}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question-row">
                  <span className="faq-question-text">{faq.q}</span>
                  <span className="faq-chevron">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
