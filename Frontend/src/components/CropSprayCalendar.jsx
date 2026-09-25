import React, { useState } from "react";
import "./CropSprayCalendar.css";
import {
  IconClock,
  IconCheck,
  IconShield,
  IconSparkles,
  IconAlert,
  IconDocument,
} from "./Icons";

const INITIAL_SCHEDULE = [
  {
    day: 1,
    title: "Initial Curative Foliar Spray",
    type: "chemical",
    product: "Mancozeb 75% WP or Metalaxyl-M",
    dosage: "2.5 g / Liter (37.5 g per 15L Tank)",
    timing: "Early Morning (06:30 AM - 08:30 AM)",
    status: "done",
    rainRisk: "Low (5% precip)",
    notes: "Apply uniformly to both upper and lower leaf surfaces. Check nozzle pressure.",
  },
  {
    day: 4,
    title: "Canopy Lesion & Recovery Inspection",
    type: "inspection",
    product: "Visual Stomatal & Stem Check",
    dosage: "Inspect 20 random plants across plot",
    timing: "Afternoon (04:00 PM)",
    status: "pending",
    rainRisk: "Clear (0% precip)",
    notes: "Verify that water-soaked lesions are desiccating into dry brown halos.",
  },
  {
    day: 7,
    title: "Booster Protectant Spray (Spore Block)",
    type: "chemical",
    product: "Copper Oxychloride 50% WP + Sticker",
    dosage: "3.0 g / Liter (45 g per 15L Tank)",
    timing: "Morning (07:00 AM - 09:00 AM)",
    status: "pending",
    rainRisk: "Moderate Rain Forecast (Rainfast adhesive required)",
    notes: "Crucial barrier spray to stop secondary spore penetration from adjacent fields.",
  },
  {
    day: 14,
    title: "Systemic Resistance Rotation (FRAC 40)",
    type: "chemical",
    product: "Dimethomorph 50% WP (Anti-Resistance)",
    dosage: "1.0 g / Liter (15 g per 15L Tank)",
    timing: "Morning (07:00 AM)",
    status: "pending",
    rainRisk: "Low (10% precip)",
    notes: "FRAC chemical group rotation to prevent fungal mutation and fungicide resistance.",
  },
  {
    day: 21,
    title: "Bio-Organic Inoculation & Soil Drench",
    type: "organic",
    product: "Trichoderma viride + Pseudomonas",
    dosage: "5 ml / Liter water",
    timing: "Late Afternoon (05:00 PM)",
    status: "pending",
    rainRisk: "Optimal Soil Moisture",
    notes: "Restores beneficial rhizosphere microflora and strengthens root defenses.",
  },
  {
    day: 28,
    title: "Pre-Harvest Interval (PHI) Clearance",
    type: "safety",
    product: "Zero-Chemical Residue Verification",
    dosage: "Nil (Watering only)",
    timing: "All Day",
    status: "pending",
    rainRisk: "Safe Window",
    notes: "Mandatory withholding interval before harvest to guarantee 100% food safety.",
  },
];

const CropSprayCalendar = ({ diseaseName = "Late Blight", cropName = "Potato" }) => {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState("calendar"); // "calendar" | "timeline"
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);

  // Month navigation offset
  const [monthOffset, setMonthOffset] = useState(0);

  const toggleTask = (index) => {
    setSchedule((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, status: item.status === "done" ? "pending" : "done" }
          : item
      )
    );
  };

  const completedCount = schedule.filter((s) => s.status === "done").length;
  const progressPercent = Math.round((completedCount / schedule.length) * 100);

  // Helper to map task days to real Date objects
  const getTaskForDate = (year, month, dayNumber) => {
    const targetDateStr = new Date(year, month, dayNumber).toDateString();
    const baseDate = new Date(startDate);

    return schedule.map((task, idx) => {
      const taskDate = new Date(baseDate);
      taskDate.setDate(baseDate.getDate() + (task.day - 1));
      return { ...task, originalIndex: idx, dateStr: taskDate.toDateString() };
    }).find((t) => t.dateStr === targetDateStr);
  };

  // Calendar generation logic
  const baseStart = new Date(startDate);
  const displayDate = new Date(baseStart.getFullYear(), baseStart.getMonth() + monthOffset, 1);
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const monthName = displayDate.toLocaleString("default", { month: "long" });

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Create array of grid cells (including empty padding before day 1)
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ type: "empty", key: `empty-${i}` });
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const task = getTaskForDate(year, month, d);
    calendarDays.push({
      type: "day",
      dayNumber: d,
      date: new Date(year, month, d),
      task: task || null,
      key: `day-${d}`,
    });
  }

  // Generate .ICS Calendar File
  const handleExportIcs = () => {
    const baseDate = new Date(startDate);
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AgroPath AI//Crop Spray Protocol//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;

    schedule.forEach((task, idx) => {
      const taskDate = new Date(baseDate);
      taskDate.setDate(baseDate.getDate() + (task.day - 1));
      const dateStr = taskDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      icsContent += `BEGIN:VEVENT\nUID:agropath-spray-${Date.now()}-${idx}@agropath.ai\nDTSTAMP:${dateStr}\nDTSTART:${dateStr}\nSUMMARY:AgroPath: ${task.title} (${cropName})\nDESCRIPTION:Product: ${task.product}\\nDosage: ${task.dosage}\\nTiming: ${task.timing}\\nNotes: ${task.notes}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AgroPath_${cropName}_Spray_Schedule.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedTask = schedule[selectedTaskIndex] || schedule[0];
  const selectedTaskDate = new Date(baseStart);
  selectedTaskDate.setDate(baseStart.getDate() + (selectedTask.day - 1));

  return (
    <div className="crop-calendar-card">
      {/* Header Row */}
      <div className="calendar-header-row">
        <div className="cal-header-left">
          <div className="cal-badge">
            <IconClock size={14} />
            <span>Automated Agronomy Schedule</span>
          </div>
          <h3 className="cal-title">
            Interactive Crop Spraying Calendar &amp; Task Scheduler
          </h3>
          <p className="cal-subtitle">
            Smart multi-stage treatment plan for <strong>{cropName}</strong> targeting <strong>{diseaseName}</strong> with weather alerts and calendar sync.
          </p>
        </div>

        <div className="cal-header-actions">
          <div className="view-toggle-pill">
            <button
              type="button"
              className={`view-btn ${viewMode === "calendar" ? "active" : ""}`}
              onClick={() => setViewMode("calendar")}
            >
              📅 Month Calendar View
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === "timeline" ? "active" : ""}`}
              onClick={() => setViewMode("timeline")}
            >
              📋 Timeline List
            </button>
          </div>

          <div className="date-picker-wrap">
            <label>Treatment Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setMonthOffset(0);
              }}
            />
          </div>
          <button type="button" className="cal-export-btn" onClick={handleExportIcs}>
            <IconDocument size={15} />
            <span>Sync to Calendar (.ICS)</span>
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="cal-progress-bar-wrap">
        <div className="cal-progress-info">
          <span>Treatment Protocol Adherence</span>
          <span className="cal-pct">{completedCount} of {schedule.length} Tasks Completed ({progressPercent}%)</span>
        </div>
        <div className="cal-track">
          <div className="cal-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* VIEW 1: MONTHLY CALENDAR GRID */}
      {viewMode === "calendar" && (
        <div className="cal-month-view-container">
          {/* Calendar Month Navigation Header */}
          <div className="cal-month-nav-bar">
            <div className="cmn-month-title">
              <h4>{monthName} {year}</h4>
              <span className="cmn-sub">Active Spraying &amp; Foliar Protection Cycle</span>
            </div>
            <div className="cmn-nav-buttons">
              <button
                type="button"
                className="cmn-nav-btn"
                onClick={() => setMonthOffset((prev) => prev - 1)}
              >
                ◀ Prev Month
              </button>
              <button
                type="button"
                className="cmn-nav-btn reset"
                onClick={() => setMonthOffset(0)}
              >
                Today
              </button>
              <button
                type="button"
                className="cmn-nav-btn"
                onClick={() => setMonthOffset((prev) => prev + 1)}
              >
                Next Month ▶
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="cal-weekdays-grid">
            <span>SUN</span>
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
          </div>

          {/* 7-Column Days Grid */}
          <div className="cal-days-grid">
            {calendarDays.map((cell) => {
              if (cell.type === "empty") {
                return <div key={cell.key} className="cal-day-cell empty"></div>;
              }

              const hasTask = Boolean(cell.task);
              const isSelected = hasTask && cell.task.originalIndex === selectedTaskIndex;

              return (
                <div
                  key={cell.key}
                  className={`cal-day-cell ${hasTask ? "has-event" : ""} ${
                    hasTask ? cell.task.type : ""
                  } ${isSelected ? "selected-cell" : ""} ${
                    hasTask && cell.task.status === "done" ? "event-done" : ""
                  }`}
                  onClick={() => {
                    if (hasTask) {
                      setSelectedTaskIndex(cell.task.originalIndex);
                    }
                  }}
                >
                  <div className="cell-top-row">
                    <span className="cell-day-num">{cell.dayNumber}</span>
                    {hasTask && (
                      <span className={`cell-status-dot ${cell.task.status}`}>
                        {cell.task.status === "done" ? "✓" : `D${cell.task.day}`}
                      </span>
                    )}
                  </div>

                  {hasTask && (
                    <div className="cell-event-pill">
                      <span className="event-title-short">
                        {cell.task.title}
                      </span>
                      <span className="event-product-short">
                        {cell.task.product.split("(")[0]}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Day Event Drawer / Detail Inspector */}
          {selectedTask && (
            <div className={`cal-event-detail-drawer ${selectedTask.type}`}>
              <div className="ced-left">
                <div className="ced-badge-row">
                  <span className="ced-day-pill">Day {selectedTask.day}</span>
                  <span className="ced-date-text">
                    {selectedTaskDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className={`ced-type-badge ${selectedTask.type}`}>
                    {selectedTask.type.toUpperCase()} PROTOCOL
                  </span>
                </div>
                <h3 className="ced-title">{selectedTask.title}</h3>
                
                <div className="ced-spec-grid">
                  <div className="ced-spec">
                    <span className="cs-label">Prescription Agrochemical / Bio</span>
                    <span className="cs-val">{selectedTask.product}</span>
                  </div>
                  <div className="ced-spec">
                    <span className="cs-label">Recommended Tank Dosage</span>
                    <span className="cs-val">{selectedTask.dosage}</span>
                  </div>
                  <div className="ced-spec">
                    <span className="cs-label">Application Window</span>
                    <span className="cs-val">{selectedTask.timing}</span>
                  </div>
                  <div className="ced-spec">
                    <span className="cs-label">Weather Radar</span>
                    <span className="cs-val">{selectedTask.rainRisk}</span>
                  </div>
                </div>

                <p className="ced-protocol-note">
                  <strong>Agronomist Directive:</strong> {selectedTask.notes}
                </p>
              </div>

              <div className="ced-right">
                <button
                  type="button"
                  className={`ced-toggle-btn ${selectedTask.status === "done" ? "done" : ""}`}
                  onClick={() => toggleTask(selectedTaskIndex)}
                >
                  <IconCheck size={18} />
                  <span>{selectedTask.status === "done" ? "Task Completed" : "Mark as Completed"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: TIMELINE LIST */}
      {viewMode === "timeline" && (
        <div className="cal-timeline-list">
          {schedule.map((item, idx) => {
            const taskDate = new Date(startDate);
            taskDate.setDate(taskDate.getDate() + (item.day - 1));
            const formattedDate = taskDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            return (
              <div
                key={idx}
                className={`cal-timeline-item ${item.status === "done" ? "completed" : ""} ${item.type}`}
              >
                <div className="cal-day-col">
                  <span className="cal-day-badge">Day {item.day}</span>
                  <span className="cal-date-label">{formattedDate}</span>
                </div>

                <div className="cal-info-col">
                  <div className="cal-item-title-row">
                    <h4 className="cal-item-heading">{item.title}</h4>
                    <span className={`cal-type-tag ${item.type}`}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="cal-details-grid">
                    <div className="c-detail">
                      <span className="cd-label">Prescription</span>
                      <span className="cd-val">{item.product}</span>
                    </div>
                    <div className="c-detail">
                      <span className="cd-label">Recommended Dosage</span>
                      <span className="cd-val">{item.dosage}</span>
                    </div>
                    <div className="c-detail">
                      <span className="cd-label">Application Window</span>
                      <span className="cd-val">{item.timing}</span>
                    </div>
                    <div className="c-detail">
                      <span className="cd-label">Weather Radar Status</span>
                      <span className={`cd-val weather-status ${item.rainRisk.includes("Moderate") ? "rain-warn" : ""}`}>
                        {item.rainRisk}
                      </span>
                    </div>
                  </div>

                  <p className="cal-note-text">
                    <em>💡 Protocol Note:</em> {item.notes}
                  </p>
                </div>

                <div className="cal-action-col">
                  <button
                    type="button"
                    className={`task-check-btn ${item.status === "done" ? "checked" : ""}`}
                    onClick={() => toggleTask(idx)}
                  >
                    <IconCheck size={16} />
                    <span>{item.status === "done" ? "Completed" : "Mark Done"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CropSprayCalendar;
