import React, { useState, useRef, useEffect } from "react";
import "./AgronomistChat.css";
import { IconMessage, IconClose } from "./Icons";

const AgronomistChat = ({ currentDiagnosis, apiBaseUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello, I am Dr. Flora, your AI Agronomist powered by Groq AI. Ask any question regarding foliar infections, chemical dosages, organic alternatives, or prevention schedules.",
      source: "Groq AI Agronomist",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastError, setLastError] = useState(null);
  const chatBottomRef = useRef(null);

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
          source: "Groq AI Agronomist",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [currentDiagnosis]);

  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Conversation reset. How can I assist you with your potato crop or plant pathology questions today?",
        source: "Groq AI Agronomist",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setLastError(null);
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
          source: data.source || "Groq AI",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("AgronomistChat request failed:", err);
      setLastError(err.message);
      
      // Informative offline diagnostic response
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "**Backend Connection Notice:**\nUnable to reach the Python Flask backend at `" + apiBaseUrl + "`. Please ensure the backend is running by running `python app.py` in the `Backend/` folder.\n\n*Temporary Offline Guidance:* For " + (currentDiagnosis?.disease || "blight management") + ", maintain good aeration, avoid overhead watering, and apply protective copper or Mancozeb sprays at early symptoms.",
          source: "Offline Diagnostic Mode",
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
                    : "Groq LLM Engine • Online"}
                </p>
              </div>
            </div>
            <div className="messenger-header-actions">
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
                  <div className="message-meta-footer">
                    {m.source && <span className="message-source-tag">{m.source}</span>}
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

          {/* Input Bar */}
          <form
            className="messenger-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Ask about treatments, dosages, remedies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="messenger-text-input"
            />
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
