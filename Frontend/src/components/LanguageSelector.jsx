import React, { useState, useRef, useEffect } from "react";
import "./LanguageSelector.css";
import { useTranslation } from "../context/LanguageContext";
import { IconGlobe, IconCheck } from "./Icons";

const LanguageSelector = () => {
  const { currentLang, activeLanguageObj, languages, changeLanguage, isTranslating, t } =
    useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="language-selector-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`language-trigger-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title={t("switch_language", "Select Language")}
        aria-label="Language Selector"
      >
        <span className="lang-flag-preview">{activeLanguageObj.flag}</span>
        <span className="lang-code-preview">{activeLanguageObj.code.toUpperCase()}</span>
        <IconGlobe size={14} className={`lang-globe-icon ${isTranslating ? "spinning" : ""}`} />
      </button>

      {isOpen && (
        <div className="language-dropdown-menu">
          <div className="language-dropdown-header">
            <div className="dropdown-title-row">
              <IconGlobe size={14} />
              <span>{t("switch_language", "Select Language")}</span>
            </div>
            <span className="dropdown-badge">LibreTranslate</span>
          </div>

          <div className="language-list-scroll">
            {languages.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  className={`language-menu-item ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelect(lang.code)}
                >
                  <span className="lang-item-flag">{lang.flag}</span>
                  <div className="lang-item-names">
                    <span className="lang-item-native">{lang.nativeName}</span>
                    <span className="lang-item-english">{lang.name}</span>
                  </div>
                  {isSelected && (
                    <span className="lang-check-icon">
                      <IconCheck size={14} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="language-dropdown-footer">
            <span>{t("powered_by_libre", "Powered by LibreTranslate Engine")}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
