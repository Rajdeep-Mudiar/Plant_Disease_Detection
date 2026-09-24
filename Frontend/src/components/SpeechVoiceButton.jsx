import React, { useState, useEffect } from "react";
import "./SpeechVoiceButton.css";
import { IconVolume, IconVolumeMute } from "./Icons";

const SpeechVoiceButton = ({ textToRead, title = "Diagnosis Guidance" }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lang, setLang] = useState("en-US");

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
    }
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = () => {
    if (!isSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!textToRead) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <div className="meta-speech-controls">
      <button
        type="button"
        className={`speech-action-button ${isSpeaking ? "speaking" : ""}`}
        onClick={handleToggleSpeech}
        title="Listen to diagnosis and care recommendations"
      >
        {isSpeaking ? <IconVolumeMute size={15} /> : <IconVolume size={15} />}
        <span className="speech-button-text">
          {isSpeaking ? "Stop Audio" : "Listen to Advice"}
        </span>
      </button>

      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="speech-lang-picker"
        title="Audio Language"
      >
        <option value="en-US">EN (English)</option>
        <option value="hi-IN">HI (Hindi)</option>
        <option value="es-ES">ES (Spanish)</option>
        <option value="fr-FR">FR (French)</option>
      </select>
    </div>
  );
};

export default SpeechVoiceButton;
