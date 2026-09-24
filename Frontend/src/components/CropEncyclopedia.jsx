import React, { useState, useMemo } from "react";
import "./CropEncyclopedia.css";
import { IconBook, IconSearch, IconCheck, IconScanner, IconSparkles } from "./Icons";

const CROPS_DATA = {
  potato: {
    name: "Potato (Solanum tuberosum)",
    family: "Solanaceae",
    diseases: [
      {
        id: "potato_early_blight",
        name: "Early Blight (Alternaria solani)",
        badge: "Fungal",
        symptoms: "Concentric circular brown lesions (bulls-eye pattern) surrounded by chlorotic yellow halos on mature lower foliage.",
        favoredBy: "Warm temperatures (24°C–29°C) and alternating wet and dry weather periods.",
        management: "Chlorothalonil or Mancozeb protective sprays, 3-year crop rotation, drip irrigation to reduce leaf wetness.",
        symptomKeys: ["concentric_rings", "yellow_halo", "brown_spots", "lower_leaves"],
        sampleKey: "early_blight",
      },
      {
        id: "potato_late_blight",
        name: "Late Blight (Phytophthora infestans)",
        badge: "Oomycete",
        symptoms: "Water-soaked dark brown to black lesions with white sporulating downy growth on leaf undersides during humid mornings.",
        favoredBy: "Relative humidity (>90%) and cool-moderate temperatures (12°C–22°C).",
        management: "Ridomil Gold or Cymoxanil systemic fungicides, destruction of cull piles, certified disease-free seed tubers.",
        symptomKeys: ["water_soaked", "white_mold", "dark_rot", "rapid_spread"],
        sampleKey: "late_blight",
      },
      {
        id: "potato_blackleg",
        name: "Blackleg & Soft Rot (Pectobacterium)",
        badge: "Bacterial",
        symptoms: "Inky black stem lesions initiating at soil line with internal tuber decay and foul odor.",
        favoredBy: "Waterlogged soils and mechanical seed handling injuries.",
        management: "Certified disease-free seed, well-drained planting beds, sanitized cutters, avoid excess nitrogen.",
        symptomKeys: ["black_stem", "soft_rot", "wilting", "foul_odor"],
      },
    ],
  },
  tomato: {
    name: "Tomato (Solanum lycopersicum)",
    family: "Solanaceae",
    diseases: [
      {
        id: "tomato_tylcv",
        name: "Yellow Leaf Curl Virus (TYLCV)",
        badge: "Viral",
        symptoms: "Severe upward leaf curling, chlorotic margins, stunted bushy plant habit, and complete flower abscission.",
        favoredBy: "Silverleaf whitefly (Bemisia tabaci) vector populations in warm arid conditions.",
        management: "Insect exclusion 50-mesh netting, yellow sticky traps, imidacloprid vector control, resistant hybrid varieties.",
        symptomKeys: ["leaf_curl", "yellow_margins", "stunted_growth"],
      },
      {
        id: "tomato_septoria",
        name: "Septoria Leaf Spot (Septoria lycopersici)",
        badge: "Fungal",
        symptoms: "Numerous small circular spots with grey centers and defined dark margins on lower foliage.",
        favoredBy: "High humidity (>85%) and overhead irrigation rain splash.",
        management: "Ground mulching, bottom pruning up to 12 inches, copper hydroxide protective sprays.",
        symptomKeys: ["brown_spots", "lower_leaves", "yellow_halo"],
      },
    ],
  },
  corn: {
    name: "Corn / Maize (Zea mays)",
    family: "Poaceae",
    diseases: [
      {
        id: "corn_nclb",
        name: "Northern Corn Leaf Blight (Exserohilum turcicum)",
        badge: "Fungal",
        symptoms: "Elongated, elliptical grey-green to tan cigar-shaped lesions parallel to leaf veins.",
        favoredBy: "Extended dew periods (6+ hours) and moderate temperatures (18°C–27°C).",
        management: "Resistant hybrid selection, crop residue tillage, foliar strobilurin/triazole fungicides at tasseling.",
        symptomKeys: ["elongated_lesions", "cigar_shaped", "grey_tan_spots"],
      },
      {
        id: "corn_rust",
        name: "Common Rust (Puccinia sorghi)",
        badge: "Fungal",
        symptoms: "Golden to reddish-brown powdery pustules scattered across both upper and lower leaf surfaces.",
        favoredBy: "Cool, humid weather conditions (16°C–25°C) and heavy night dew.",
        management: "Resistant cultivars, early planting dates, triazole sprays when economic threshold reached.",
        symptomKeys: ["orange_rust", "powdery_pustules"],
      },
    ],
  },
  apple: {
    name: "Apple (Malus domestica)",
    family: "Rosaceae",
    diseases: [
      {
        id: "apple_scab",
        name: "Apple Scab (Venturia inaequalis)",
        badge: "Fungal",
        symptoms: "Olive-green velvety lesions on leaves maturing into dark corky, deformed lesions on fruit.",
        favoredBy: "Continuous leaf wetness during early spring green-tip stage.",
        management: "Captan or Myclobutanil preventive sprays, autumn leaf litter shredding or urea spray to accelerate decomposition.",
        symptomKeys: ["olive_velvety", "corky_lesions"],
      },
      {
        id: "apple_rust",
        name: "Cedar Apple Rust (Gymnosporangium)",
        badge: "Fungal",
        symptoms: "Bright yellow-orange spots on upper leaf surfaces with gelatinous spore horns on juniper galls.",
        favoredBy: "Proximity to Eastern Red Cedar / Juniper alternate hosts during damp spring periods.",
        management: "Removal of nearby juniper galls, sterol-inhibitor fungicide applications before petal fall.",
        symptomKeys: ["orange_rust", "yellow_halo"],
      },
    ],
  },
};

const SYMPTOM_CHECKLIST = [
  { key: "concentric_rings", label: "Concentric 'Bullseye' Rings" },
  { key: "yellow_halo", label: "Yellow / Chlorotic Halos" },
  { key: "water_soaked", label: "Water-Soaked Dark Lesions" },
  { key: "white_mold", label: "White Fungal Spore Down / Mold" },
  { key: "brown_spots", label: "Small Brown / Grey Spots" },
  { key: "lower_leaves", label: "Starting on Bottom / Mature Leaves" },
  { key: "leaf_curl", label: "Upward Leaf Curling / Crinkling" },
  { key: "orange_rust", label: "Powdery Orange / Rust Pustules" },
  { key: "black_stem", label: "Blackened Stems / Soft Base Rot" },
  { key: "stunted_growth", label: "Stunted Plant / Growth Arrest" },
];

const CropEncyclopedia = ({ onNavigateToScanner }) => {
  const [activeCropKey, setActiveCropKey] = useState("potato");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [activeTab, setActiveTab] = useState("library"); // 'library' or 'matcher'

  const toggleSymptom = (key) => {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const clearSymptoms = () => setSelectedSymptoms([]);

  // Calculate live matching score for matcher mode
  const rankedDiseases = useMemo(() => {
    const allDiseases = [];
    Object.entries(CROPS_DATA).forEach(([cropKey, cropData]) => {
      cropData.diseases.forEach((d) => {
        let matchCount = 0;
        if (selectedSymptoms.length > 0 && d.symptomKeys) {
          matchCount = selectedSymptoms.filter((s) => d.symptomKeys.includes(s)).length;
        }
        const score = selectedSymptoms.length > 0 ? Math.round((matchCount / selectedSymptoms.length) * 100) : 0;
        allDiseases.push({
          ...d,
          cropKey,
          cropName: cropData.name,
          score,
          matchCount,
        });
      });
    });

    return allDiseases.sort((a, b) => b.score - a.score || b.matchCount - a.matchCount);
  }, [selectedSymptoms]);

  // Filter diseases for active crop
  const crop = CROPS_DATA[activeCropKey] || CROPS_DATA.potato;
  const filteredDiseases = crop.diseases.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.badge.toLowerCase().includes(q) ||
      d.symptoms.toLowerCase().includes(q) ||
      d.management.toLowerCase().includes(q)
    );
  });

  return (
    <div className="meta-encyclopedia-card">
      {/* Top Header Controls */}
      <div className="encyclopedia-top-bar">
        {/* View Switcher: Reference Library vs Interactive Symptom Matcher */}
        <div className="encyclopedia-view-toggles">
          <button
            type="button"
            className={`view-toggle-btn ${activeTab === "library" ? "active" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            <IconBook size={15} />
            <span>Pathology Catalog</span>
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${activeTab === "matcher" ? "active" : ""}`}
            onClick={() => setActiveTab("matcher")}
          >
            <IconSparkles size={15} />
            <span>Interactive Symptom Matcher</span>
            {selectedSymptoms.length > 0 && (
              <span className="symptom-count-badge">{selectedSymptoms.length}</span>
            )}
          </button>
        </div>

        {activeTab === "library" && (
          <div className="encyclopedia-search-box">
            <IconSearch size={14} className="search-icon-svg" />
            <input
              type="text"
              placeholder={`Search ${crop.name.split(" ")[0]} pathology...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="encyclopedia-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {activeTab === "library" ? (
        <>
          {/* Crop Selector Tabs */}
          <div className="encyclopedia-crop-bar">
            <div className="crop-selection-tabs">
              {Object.entries(CROPS_DATA).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  className={`crop-nav-tab ${activeCropKey === key ? "active" : ""}`}
                  onClick={() => setActiveCropKey(key)}
                >
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </button>
              ))}
            </div>

            <span className="crop-family-badge">Family: {crop.family}</span>
          </div>

          {/* Main Pathology Grid */}
          <div className="encyclopedia-main-view">
            <h4 className="crop-specimen-title">{crop.name}</h4>

            {filteredDiseases.length === 0 ? (
              <div className="empty-search-state">
                <p>No pathology matches found for "{searchQuery}".</p>
                <button
                  type="button"
                  className="clear-query-btn"
                  onClick={() => setSearchQuery("")}
                >
                  Reset Search Filter
                </button>
              </div>
            ) : (
              <div className="pathology-cards-grid">
                {filteredDiseases.map((d) => (
                  <div key={d.id} className="pathology-data-card">
                    <div className="pathology-data-header">
                      <h5 className="disease-scientific-title">{d.name}</h5>
                      <span className={`pathology-type-badge ${d.badge.toLowerCase()}`}>
                        {d.badge}
                      </span>
                    </div>

                    <div className="pathology-detail-row">
                      <span className="detail-tag">Symptoms:</span>
                      <p className="detail-text">{d.symptoms}</p>
                    </div>

                    <div className="pathology-detail-row">
                      <span className="detail-tag">Environmental Triggers:</span>
                      <p className="detail-text">{d.favoredBy}</p>
                    </div>

                    <div className="pathology-detail-row">
                      <span className="detail-tag">Management Protocol:</span>
                      <p className="detail-text highlighted">{d.management}</p>
                    </div>

                    {d.sampleKey && onNavigateToScanner && (
                      <div className="pathology-card-footer">
                        <button
                          type="button"
                          className="test-sample-scanner-btn"
                          onClick={() => onNavigateToScanner(d.sampleKey)}
                        >
                          <IconScanner size={13} />
                          <span>Test Sample in AI Scanner</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Interactive Symptom Matcher View */
        <div className="interactive-matcher-view">
          <div className="matcher-intro-banner">
            <div>
              <h4 className="matcher-title">Field Symptom Differential Matrix</h4>
              <p className="matcher-description">
                Check all observed leaf and stem symptoms on your plant. The matrix computes match probabilities across known pathogens.
              </p>
            </div>
            {selectedSymptoms.length > 0 && (
              <button
                type="button"
                className="clear-all-symptoms-btn"
                onClick={clearSymptoms}
              >
                Clear Selection ({selectedSymptoms.length})
              </button>
            )}
          </div>

          {/* Interactive Checklist Pills */}
          <div className="symptoms-checklist-grid">
            {SYMPTOM_CHECKLIST.map((item) => {
              const isChecked = selectedSymptoms.includes(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`symptom-check-chip ${isChecked ? "selected" : ""}`}
                  onClick={() => toggleSymptom(item.key)}
                >
                  <span className={`custom-checkbox ${isChecked ? "checked" : ""}`}>
                    {isChecked && <IconCheck size={12} />}
                  </span>
                  <span className="chip-label-text">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Diagnostic Match Probability Leaderboard */}
          <div className="matcher-results-section">
            <h5 className="ranked-results-title">
              Diagnostic Probabilities & Differential Matches
            </h5>

            {selectedSymptoms.length === 0 ? (
              <div className="matcher-empty-prompt">
                <p>Select one or more symptoms above to compute pathogen match scores.</p>
              </div>
            ) : (
              <div className="ranked-diseases-list">
                {rankedDiseases.map((item) => (
                  <div key={item.id} className="ranked-disease-row">
                    <div className="ranked-info-col">
                      <div className="ranked-name-row">
                        <span className="ranked-disease-name">{item.name}</span>
                        <span className="ranked-crop-tag">{item.cropName.split(" ")[0]}</span>
                        <span className={`pathology-type-badge ${item.badge.toLowerCase()}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="ranked-symptoms-summary">{item.symptoms}</p>
                    </div>

                    <div className="ranked-score-col">
                      <div className="ranked-score-header">
                        <span className="score-percentage">{item.score}% Match</span>
                        <span className="score-fraction">
                          {item.matchCount} / {selectedSymptoms.length} criteria
                        </span>
                      </div>
                      <div className="score-progress-bar-bg">
                        <div
                          className={`score-progress-bar-fill ${
                            item.score >= 70 ? "high" : item.score >= 40 ? "medium" : "low"
                          }`}
                          style={{ width: `${Math.max(item.score, 6)}%` }}
                        ></div>
                      </div>
                      {item.sampleKey && onNavigateToScanner && item.score >= 50 && (
                        <button
                          type="button"
                          className="ranked-test-scanner-btn"
                          onClick={() => onNavigateToScanner(item.sampleKey)}
                        >
                          <IconScanner size={12} />
                          <span>Inspect Specimen</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropEncyclopedia;
