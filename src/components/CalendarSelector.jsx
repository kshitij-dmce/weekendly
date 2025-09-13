import React from "react";
import "./CalendarSelector.css";
import { usePlan } from "../context/PlanContext";

export default function CalendarSelector() {
  const { selectedDays, setSelectedDays } = usePlan();

  const presets = [
    { label: "Weekend (Sat–Sun)", days: [6, 0] },
    { label: "Long Weekend (Fri–Sun)", days: [5, 6, 0] },
    { label: "Extra Long (Fri–Mon)", days: [5, 6, 0, 1] },
  ];

  const handlePreset = (days) => {
    const today = new Date();
    let start = new Date(today);
    start.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));
    const selected = days.map((d, i) => {
      let date = new Date(start);
      date.setDate(start.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    setSelectedDays(selected);
  };

  return (
    <div className="calendar-selector">
      <h2 className="calendar-title">Pick your weekend:</h2>
      <div className="calendar-btn-row">
        {presets.map(preset => (
          <button
            key={preset.label}
            className="calendar-btn"
            onClick={() => handlePreset(preset.days)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="calendar-selected">
        {selectedDays.length > 0 && `Selected: ${selectedDays.join(', ')}`}
      </div>
    </div>
  );
}