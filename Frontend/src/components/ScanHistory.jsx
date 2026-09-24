import React, { useState, useEffect } from "react";
import "./ScanHistory.css";
import { IconHistory, IconRefresh, IconDocument, IconClose } from "./Icons";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const ScanHistory = ({ onSelectHistoryItem, currentScan }) => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial history from localStorage + sync from MongoDB Atlas
  useEffect(() => {
    try {
      const stored = localStorage.getItem("plant_disease_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local scan history:", e);
    }

    fetchMongoHistory();
  }, []);

  const fetchMongoHistory = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch(`${API_BASE_URL}/api/history?limit=50`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.history) && data.history.length > 0) {
          setHistory((prev) => {
            const combined = [...data.history];
            // Merge local items that might have base64 previews
            prev.forEach((localItem) => {
              const exists = combined.some(
                (c) => c.disease === localItem.disease && Math.abs(c.confidence - localItem.confidence) < 0.1
              );
              if (!exists) combined.push(localItem);
            });
            localStorage.setItem("plant_disease_history", JSON.stringify(combined.slice(0, 50)));
            return combined.slice(0, 50);
          });
        }
      }
    } catch (err) {
      // Offline fallback is normal
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (!currentScan || !currentScan.prediction) return;

    try {
      const newItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        disease: currentScan.prediction.disease,
        confidence: currentScan.prediction.confidence,
        severity: currentScan.prediction.severity,
        guidance: currentScan.guidance,
        preview: currentScan.preview,
      };

      setHistory((prev) => {
        if (prev.length > 0 && prev[0].disease === newItem.disease && prev[0].confidence === newItem.confidence) {
          return prev;
        }
        const updated = [newItem, ...prev].slice(0, 50);
        localStorage.setItem("plant_disease_history", JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  }, [currentScan]);

  const handleClearHistory = async () => {
    if (window.confirm("Clear all field scan records from local cache and MongoDB?")) {
      localStorage.removeItem("plant_disease_history");
      setHistory([]);
      try {
        await fetch(`${API_BASE_URL}/api/history/clear`, { method: "DELETE" });
      } catch (e) {
        console.error("Mongo clear warning:", e);
      }
    }
  };

  const handleDeleteItem = (id, e) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("plant_disease_history", JSON.stringify(updated));
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = "ID,Timestamp,Diagnosis,Confidence (%),Severity Level,Damage Ratio (%)\n";
    const rows = history
      .map((h) => {
        const sevLevel = h.severity?.level || "N/A";
        const sevPct = h.severity?.percentage ?? "N/A";
        return `"${h.id}","${h.date}","${h.disease}","${h.confidence}","${sevLevel}","${sevPct}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Field_Scan_History_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter((item) => {
    if (filter === "ALL") return true;
    return item.disease === filter;
  });

  return (
    <div className="meta-history-card">
      <div className="history-card-header">
        <div className="history-title-column">
          <div className="history-header-left">
            <IconHistory size={20} className="history-svg-icon" />
            <h3 className="history-main-heading">Field Scan Journal & History</h3>
          </div>
          <p className="history-count-subtext">
            {history.length} Specimen Records Archived • MongoDB Cloud Sync Active
          </p>
        </div>

        <div className="history-header-actions">
          <button
            type="button"
            className="history-export-btn"
            onClick={fetchMongoHistory}
            title="Refresh records from MongoDB Atlas"
          >
            <IconRefresh size={13} />
            <span>{isSyncing ? "Syncing..." : "Sync DB"}</span>
          </button>
          {history.length > 0 && (
            <>
              <button
                type="button"
                className="history-export-btn"
                onClick={handleExportCSV}
              >
                <IconDocument size={13} />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                className="history-clear-link-btn"
                onClick={handleClearHistory}
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      <div className="history-filter-tab-bar">
        <button
          className={`history-filter-pill ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          All Scans ({history.length})
        </button>
        <button
          className={`history-filter-pill ${filter === "Healthy" ? "active" : ""}`}
          onClick={() => setFilter("Healthy")}
        >
          Healthy
        </button>
        <button
          className={`history-filter-pill ${filter === "Early Blight" ? "active" : ""}`}
          onClick={() => setFilter("Early Blight")}
        >
          Early Blight
        </button>
        <button
          className={`history-filter-pill ${filter === "Late Blight" ? "active" : ""}`}
          onClick={() => setFilter("Late Blight")}
        >
          Late Blight
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="history-empty-view">
          <p>No specimen records found in this category.</p>
        </div>
      ) : (
        <div className="history-specimen-grid">
          {filteredHistory.map((item) => (
            <div key={item.id} className="history-record-item">
              <button
                type="button"
                className="delete-item-cross-btn"
                title="Remove scan"
                onClick={(e) => handleDeleteItem(item.id, e)}
              >
                <IconClose size={12} />
              </button>

              {item.preview ? (
                <img
                  src={item.preview}
                  alt={item.disease}
                  className="specimen-thumbnail"
                />
              ) : (
                <div className="specimen-thumbnail-placeholder">Leaf</div>
              )}
              <div className="specimen-data-block">
                <div className="specimen-tag-line">
                  <span
                    className={`specimen-status-tag ${
                      item.disease === "Healthy"
                        ? "healthy"
                        : item.disease === "Early Blight"
                        ? "early"
                        : "late"
                    }`}
                  >
                    {item.disease}
                  </span>
                  <span className="specimen-confidence-pill">{item.confidence}%</span>
                </div>
                <p className="specimen-timestamp">{item.date}</p>
                {item.severity && (
                  <p className="specimen-severity-line">
                    Severity: {item.severity.level || `${item.severity.percentage}%`}
                  </p>
                )}
                <button
                  type="button"
                  className="reload-specimen-btn"
                  onClick={() => onSelectHistoryItem(item)}
                >
                  <IconRefresh size={12} />
                  <span>Reload in Scanner</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScanHistory;
