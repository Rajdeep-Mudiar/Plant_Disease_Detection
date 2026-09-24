import React, { useState, useRef, useEffect } from "react";
import "./AgronomistChat.css";
import { IconMessage, IconClose, IconMicrophone, IconMicOff, IconVolume, IconGlobe } from "./Icons";

const SUPPORTED_LANGUAGES = [
  { label: "English", code: "en-US", name: "English" },
  { label: "हिंदी (Hindi)", code: "hi-IN", name: "Hindi" },
  { label: "Español (Spanish)", code: "es-ES", name: "Spanish" },
  { label: "ਪੰਜਾਬੀ (Punjabi)", code: "pa-IN", name: "Punjabi" },
  { label: "বাংলা (Bengali)", code: "bn-IN", name: "Bengali" },
  { label: "Français (French)", code: "fr-FR", name: "French" },
  { label: "मराठी (Marathi)", code: "mr-IN", name: "Marathi" },
  { label: "తెలుగు (Telugu)", code: "te-IN", name: "Telugu" },
  { label: "Deutsch (German)", code: "de-DE", name: "German" },
];

const AgronomistChat = ({ currentDiagnosis, apiBaseUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(SUPPORTED_LANGUAGES[0]);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello, I am Dr. Flora, your AI Agronomist. Ask any question regarding foliar infections, chemical dosages, organic alternatives, or prevention schedules.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastError, setLastError] = useState(null);
  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (currentDiagnosis?.disease) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Loaded diagnosis: **${currentDiagnosis.disease}** (${currentDiagnosis.confidence}% confidence). How would you like to treat this crop?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [currentDiagnosis]);

  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: `Conversation reset in ${selectedLang.label}. How can I assist you with your crop pathology today?`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setLastError(null);
  };

  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang.code;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          handleSend(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Speech recognition start failed:", e);
      setIsListening(false);
    }
  };

  const handleSpeakMessage = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*/g, "").replace(/\*/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLang.code;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentHistory = [...messages, userMessage];
    setMessages(currentHistory);
    if (!customText) setInput("");
    setIsTyping(true);
    setLastError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          language: selectedLang.name,
          history: currentHistory.map((m) => ({ sender: m.sender, text: m.text })),
          context: {
            disease: currentDiagnosis?.disease || "General Potato Crop",
            confidence: currentDiagnosis?.confidence || 0,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "I am available to assist with crop treatment recommendations.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("AgronomistChat request failed:", err);
      setLastError(err.message);
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "**Backend Connection Notice:**\nUnable to reach the Python Flask backend at `" + apiBaseUrl + "`. Please ensure the backend is running by running `python app.py` in the `Backend/` folder.\n\n*Temporary Offline Guidance:* For " + (currentDiagnosis?.disease || "blight management") + ", maintain good aeration, avoid overhead watering, and apply protective copper or Mancozeb sprays at early symptoms.",
          isError: true,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "Organic remedies",
    "Chemical dosages",
    "Rain spray timing",
    "Crop rotation & prevention",
    "Pre-harvest waiting days",
  ];

  const formatMessageText = (txt) => {
    const lines = txt.split("\n");
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={idx} className="meta-chat-line">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
            } else if (part.startsWith("*") && part.endsWith("*")) {
              return <em key={pIdx}>{part.slice(1, -1)}</em>;
            }
            return part;
          })}
          {idx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Messenger Style Button */}
      <button
        type="button"
        className="meta-chat-floating-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Open Agronomist Assistant"
      >
        <IconMessage size={18} />
        <span className="chat-fab-label">Assistant</span>
      </button>

      {/* Messenger Window */}
      {isOpen && (
        <div className="meta-messenger-window">
          <div className="messenger-header">
            <div className="messenger-agent-info">
              <div className="agent-avatar-circle">
                <span>DF</span>
                <span className="agent-active-badge"></span>
              </div>
              <div>
                <h4 className="agent-display-name">Dr. Flora</h4>
                <p className="agent-status-line">
                  {currentDiagnosis?.disease
                    ? `Active Context: ${currentDiagnosis.disease}`
                    : "AI Agronomist • Online"}
                </p>
              </div>
            </div>
            
            <div className="messenger-header-actions">
              {/* Language Selector */}
              <div className="lang-picker-wrap" title="Select Voice & Text Language">
                <IconGlobe size={13} className="lang-globe-icon" />
                <select
                  value={selectedLang.code}
                  onChange={(e) => {
                    const l = SUPPORTED_LANGUAGES.find((lang) => lang.code === e.target.value);
                    if (l) setSelectedLang(l);
                  }}
                  className="chat-lang-select"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <button 
                type="button" 
                className="messenger-clear-btn" 
                onClick={handleClearChat}
                title="Reset Conversation"
              >
                Reset
              </button>
              <button 
                type="button" 
                className="messenger-close-btn" 
                onClick={() => setIsOpen(false)}
                title="Close Window"
              >
                <IconClose size={16} />
              </button>
            </div>
          </div>

          <div className="messenger-thread-container">
            {messages.map((m, idx) => (
              <div key={idx} className={`message-row ${m.sender}`}>
                <div className={`message-bubble ${m.sender} ${m.isError ? "error-bubble" : ""}`}>
                  <div className="message-text-content">{formatMessageText(m.text)}</div>
                  <div className="bubble-footer-row">
                    {m.sender === "bot" && (
                      <button
                        type="button"
                        className="bubble-speech-btn"
                        onClick={() => handleSpeakMessage(m.text)}
                        title="Listen to audio"
                      >
                        <IconVolume size={13} />
                      </button>
                    )}
                    <span className="message-time-label">{m.time}</span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-row bot">
                <div className="message-bubble bot typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Filter Chips */}
          <div className="messenger-chips-carousel">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="messenger-chip-btn"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar with Voice Mic */}
          <form
            className="messenger-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder={isListening ? "Listening... speak now..." : `Ask in ${selectedLang.label}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`messenger-text-input ${isListening ? "listening-pulse" : ""}`}
            />
            
            <button
              type="button"
              className={`messenger-mic-button ${isListening ? "listening" : ""}`}
              onClick={handleToggleVoiceInput}
              title={isListening ? "Stop Listening" : "Speak question in your language"}
            >
              {isListening ? <IconMicOff size={16} /> : <IconMicrophone size={16} />}
            </button>

            <button
              type="submit"
              className="messenger-send-button"
              disabled={!input.trim() || isTyping}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AgronomistChat;
