import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AgronomistChat from "./components/AgronomistChat";
import HomePage from "./pages/HomePage";
import DetectPage from "./pages/DetectPage";
import WeatherPage from "./pages/WeatherPage";
import CalculatorPage from "./pages/CalculatorPage";
import EncyclopediaPage from "./pages/EncyclopediaPage";
import HistoryPage from "./pages/HistoryPage";
import { generateSampleLeafFile } from "./utils/sampleImages";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

function App() {
  // Theme State (Light vs Dark Mode)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("agropath_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("agropath_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Navigation Route State
  const [activeRoute, setActiveRoute] = useState(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const valid = ["home", "detect", "weather", "calculator", "encyclopedia", "history"];
    return valid.includes(hash) ? hash : "home";
  });

  // Diagnostic State
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [guidance, setGuidance] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [backendMessage, setBackendMessage] = useState("");
  const [lastScanRecord, setLastScanRecord] = useState(null);
  const [scanCount, setScanCount] = useState(0);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      const valid = ["home", "detect", "weather", "calculator", "encyclopedia", "history"];
      if (valid.includes(hash)) {
        setActiveRoute(hash);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update hash when activeRoute changes
  const navigateTo = (routeId) => {
    setActiveRoute(routeId);
    window.location.hash = routeId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Health ping backend
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBackendOnline(true);
        setBackendMessage(`Backend Online • TensorFlow ${data.tensorflow_version}`);
      } catch (e) {
        setBackendOnline(false);
        setBackendMessage("Backend unreachable. Ensure API is running on port 5001.");
      }
    };
    pingBackend();
  }, []);

  // Load scan count from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("plant_disease_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        setScanCount(Array.isArray(parsed) ? parsed.length : 0);
      }
    } catch (e) {
      console.error("Error reading scan count:", e);
    }
  }, [lastScanRecord]);

  const handleImageSelect = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
      setPrediction(null);
      setGuidance(null);
      setError(null);
    }
  };

  const handleCameraCapture = (file, dataUrl) => {
    setImage(file);
    setPreview(dataUrl);
    setPrediction(null);
    setGuidance(null);
    setError(null);
  };

  const handleSelectSampleSpecimen = (sampleKey) => {
    try {
      const cleanKey = sampleKey.includes("healthy")
        ? "healthy"
        : sampleKey.includes("early")
        ? "early_blight"
        : "late_blight";
      const { file, dataUrl } = generateSampleLeafFile(cleanKey);
      setImage(file);
      setPreview(dataUrl);
      setPrediction(null);
      setGuidance(null);
      setError(null);
      navigateTo("detect");
    } catch (e) {
      console.error("Error generating sample specimen:", e);
      navigateTo("detect");
    }
  };

  const handlePredict = async () => {
    if (!image) {
      setError("Please select or capture a leaf photo first");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPrediction(data.prediction);
        setGuidance(data.guidance || null);
        setLastScanRecord({
          prediction: data.prediction,
          guidance: data.guidance,
          preview: preview,
        });
      } else {
        setError(data.error || "Failed to get prediction");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setPrediction(null);
    setGuidance(null);
    setError(null);
  };

  const handleSelectHistoryItem = (item) => {
    setPrediction({
      disease: item.disease,
      confidence: item.confidence,
      severity: item.severity,
      all_predictions: {
        [item.disease]: item.confidence / 100,
      },
    });
    setGuidance(item.guidance);
    if (item.preview) {
      setPreview(item.preview);
    }
  };

  return (
    <div className="App" data-theme={theme}>
      {/* Top Navbar */}
      <Navbar
        activeRoute={activeRoute}
        onNavigate={navigateTo}
        backendOnline={backendOnline}
        scanCount={scanCount}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Routed Page Views */}
      <main className="main-viewport-content">
        {activeRoute === "home" && (
          <HomePage
            onNavigate={navigateTo}
            onSelectSample={handleSelectSampleSpecimen}
            backendOnline={backendOnline}
          />
        )}

        {activeRoute === "detect" && (
          <DetectPage
            image={image}
            preview={preview}
            loading={loading}
            prediction={prediction}
            guidance={guidance}
            error={error}
            backendOnline={backendOnline}
            backendMessage={backendMessage}
            onImageSelect={handleImageSelect}
            onClear={handleClear}
            onPredict={handlePredict}
            onCameraCapture={handleCameraCapture}
          />
        )}

        {activeRoute === "weather" && <WeatherPage />}

        {activeRoute === "calculator" && <CalculatorPage />}

        {activeRoute === "encyclopedia" && (
          <EncyclopediaPage
            onNavigateToScanner={handleSelectSampleSpecimen}
          />
        )}

        {activeRoute === "history" && (
          <HistoryPage
            onSelectHistoryItem={handleSelectHistoryItem}
            currentScan={lastScanRecord}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Persistent AI Agronomist Chatbot on all pages */}
      <AgronomistChat
        currentDiagnosis={prediction}
        apiBaseUrl={API_BASE_URL}
      />

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
