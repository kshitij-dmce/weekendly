// import React, { useState } from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import "./HomePage.css";
// import BrowseActivitiesModal from "./BrowseActivitiesModal";
// import PlanEditor from "./PlanEditor";
// import { usePlan } from "../context/PlanContext";
// import PlanTimelineEditor from "./PlanEditor";

// export default function HomePage() {
//   const { selectedDays, setSelectedDays, plan, setPlan } = usePlan();
//   const [calendarDone, setCalendarDone] = useState(false);
//   const [dateValue, setDateValue] = useState([null, null]);
//   const [browsing, setBrowsing] = useState(false);

//   // Step 1: select dates
//   function onCalendarChange(value) {
//     setDateValue(value);
//     if (Array.isArray(value) && value[0] && value[1]) {
//       const days = [];
//       let cur = new Date(value[0]);
//       while (cur <= value[1]) {
//         days.push(cur.toISOString().slice(0, 10));
//         cur.setDate(cur.getDate() + 1);
//       }
//       setSelectedDays(days);
//     }
//   }

//   function handleCalendarConfirm() {
//     setCalendarDone(true);
//   }

//   // Step 2: handle adding activities to plan
//   function handleBrowseDone(newActivities) {
//     // Evenly assign new activities to days
//     const planCopy = { ...plan };
//     selectedDays.forEach((day) => {
//       if (!planCopy[day]) planCopy[day] = [];
//     });
//     newActivities.forEach((act, idx) => {
//       const day = selectedDays[idx % selectedDays.length];
//       planCopy[day].push({ ...act, mood: null });
//     });
//     setPlan(planCopy);
//     setBrowsing(false);
//   }

//   // UI
//   return (
//     <div className="homepage-root">
//       {!calendarDone ? (
//         <div className="calendar-section">
//           <h2 className="calendar-header">Select your weekend/holiday dates</h2>
//           <Calendar
//             onChange={onCalendarChange}
//             value={dateValue}
//             selectRange={true}
//             className="main-calendar"
//           />
//           <div className="calendar-selected-dates">
//             {Array.isArray(dateValue) && dateValue[0] && dateValue[1] && (
//               <>
//                 <span>Selected: </span>
//                 <b>
//                   {dateValue[0].toLocaleDateString()} –{" "}
//                   {dateValue[1].toLocaleDateString()}
//                 </b>
//               </>
//             )}
//           </div>
//           <button
//             className="calendar-confirm-btn"
//             disabled={!(Array.isArray(dateValue) && dateValue[0] && dateValue[1])}
//             onClick={handleCalendarConfirm}
//           >
//             Confirm Dates
//           </button>
//         </div>
//       ) : (
//         <div className="planning-screen">
//           <div className="planning-topbar">
//             <button
//               className="browse-activities-btn"
//               onClick={() => setBrowsing(true)}
//             >
//               Browse Activities
//             </button>
//           </div>
//           <PlanTimelineEditor />
//         </div>
//       )}

//       {browsing && (
//         <BrowseActivitiesModal
//           onSave={handleBrowseDone}
//           onClose={() => setBrowsing(false)}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./HomePage.css";
import BrowseActivitiesModal from "./BrowseActivitiesModal";
import PlanTimelineEditor from "./PlanEditor";
import { usePlan } from "../context/PlanContext";
import { activities } from "../data/activities"; // <-- Import your activities data
import html2canvas from "html2canvas";
import DistanceTracker from "./DistanceTracker"; // Import the DistanceTracker component

const SLOT_KEYS = ["morning", "afternoon", "evening", "night"];

export default function HomePage() {
  const { selectedDays, setSelectedDays, addActivity, setPlan, plan } = usePlan();
  const [calendarDone, setCalendarDone] = useState(false);
  const [dateValue, setDateValue] = useState([null, null]);
  const [browseModal, setBrowseModal] = useState({ open: false, day: null, slot: null });
  const [browsing, setBrowsing] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const planRef = useRef();

  // For Distance Tracker modal
  const [showDistance, setShowDistance] = useState(false);

  function handleExportImage() {
    if (!planRef.current) return;
    html2canvas(planRef.current, { useCORS: true, backgroundColor: "#fff" }).then(canvas => {
      const link = document.createElement("a");
      link.download = "MyPlan.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }

  function onCalendarChange(value) {
    setDateValue(value);
    if (Array.isArray(value) && value[0] && value[1]) {
      const days = [];
      let cur = new Date(value[0]);
      while (cur <= value[1]) {
        days.push(cur.toISOString().slice(0, 10));
        cur.setDate(cur.getDate() + 1);
      }
      setSelectedDays(days);
    }
  }

  function handleCalendarConfirm() {
    setCalendarDone(true);
  }

  function handleAddActivity(day, slot) {
    setBrowseModal({ open: true, day, slot });
  }

  function handleBrowseButton() {
    setBrowsing(true);
  }

  function handleBrowseDoneSlot(selectedActs) {
    selectedActs.forEach((act) => addActivity(browseModal.day, browseModal.slot, act));
    setBrowseModal({ open: false, day: null, slot: null });
  }

  function handleBrowseDone(selectedActs) {
    // Add to "morning" slot (or distribute as you wish)
    selectedActs.forEach((act, idx) => {
      const day = selectedDays[idx % selectedDays.length];
      addActivity(day, "morning", act);
    });
    setBrowsing(false);
  }

  // --- Surprise Me Feature ---
  function handleSurpriseMe() {
    if (!selectedDays.length) return;

    // Flatten all activities
    const allActs = activities.flatMap(cat =>
      cat.items.map(item => ({
        ...item,
        id: `${cat.id}-${item.id}`,
        category: cat.name,
        icon: cat.icon,
        name: item.name,
      }))
    );

    // Helper for random pick
    const randomAct = () => allActs[Math.floor(Math.random() * allActs.length)];

    // Build random plan: { [day]: { slot: [activity] } }
    const randomPlan = {};
    selectedDays.forEach(day => {
      randomPlan[day] = {};
      SLOT_KEYS.forEach(slot => {
        randomPlan[day][slot] = [randomAct()];
      });
    });
    setPlan(randomPlan);
  }

  // --- Save Plan to localStorage ---
function handleSavePlan() {
  if (!plan || Object.keys(plan).length === 0) {
    setSaveMsg("No plan to save!");
    setTimeout(() => setSaveMsg(""), 2000);
    return;
  }

  // Get current plans array from localStorage or use empty array
  const plans = JSON.parse(localStorage.getItem("savedPlans")) || [];

  // Add a unique id if not present (optional but recommended)
  if (!plan.id) {
    plan.id = "plan-" + Date.now();
    plan.createdAt = new Date().toISOString();
  }

  // Remove any existing plan with the same id (replace if re-saving)
  const filtered = plans.filter(p => p.id !== plan.id);

  // Add current plan
  filtered.push(plan);

  // Save back to localStorage
  localStorage.setItem("savedPlans", JSON.stringify(filtered));

  setSaveMsg("Plan saved successfully!");
  setTimeout(() => setSaveMsg(""), 2000);
}

  return (
    <div className="homepage-root">
      {!calendarDone ? (
        <div className="calendar-section">
          <h2 className="calendar-header">Select your weekend/holiday dates</h2>
          <Calendar
            onChange={onCalendarChange}
            value={dateValue}
            selectRange={true}
            className="main-calendar"
          />
          <div className="calendar-selected-dates">
            {Array.isArray(dateValue) && dateValue[0] && dateValue[1] && (
              <>
                <span>Selected: </span>
                <b>
                  {dateValue[0].toLocaleDateString()} –{" "}
                  {dateValue[1].toLocaleDateString()}
                </b>
              </>
            )}
          </div>
          <button
            className="calendar-confirm-btn"
            disabled={!(Array.isArray(dateValue) && dateValue[0] && dateValue[1])}
            onClick={handleCalendarConfirm}
          >
            Confirm Dates
          </button>
        </div>
      ) : (
        <div className="planning-screen">
          <div className="planning-topbar">
            <button
              className="browse-activities-btn"
              onClick={handleBrowseButton}
            >
              Browse Activities
            </button>
            <button
              className="surprise-btn"
              style={{
                marginLeft: 10,
                background: "#34d399",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "8px 22px",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px -4px #34d39977",
                transition: "background 0.16s"
              }}
              onClick={handleSurpriseMe}
            >
              🎲 Surprise Me!
            </button>
            <button
              className="save-plan-btn"
              style={{
                marginLeft: 10,
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "8px 22px",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px -4px #6366f199",
                transition: "background 0.16s"
              }}
              onClick={handleSavePlan}
            >
              💾 Save Plan
            </button>
            <button
              className="export-plan-btn"
              style={{
                marginLeft: 10,
                background: "#f59e42",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "8px 22px",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px -4px #f59e4277",
                transition: "background 0.16s"
              }}
              onClick={handleExportImage}
            >
              🖼️ Export as Image
            </button>
            <button
              className="distance-btn"
              style={{
                marginLeft: 10,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "8px 22px",
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 2px 8px -4px #2563eb77",
                transition: "background 0.16s"
              }}
              onClick={() => setShowDistance(true)}
            >
              🗺️ Show Route & Distance
            </button>
          </div>
          {saveMsg && (
            <div style={{ color: "#22c55e", marginTop: 8, fontWeight: 500 }}>
              {saveMsg}
            </div>
          )}
          <div ref={planRef}>
            <PlanTimelineEditor onAddActivity={handleAddActivity} />
          </div>
          {/* Distance Tracker Modal Overlay */}
          {showDistance && (
            <div className="distance-tracker-overlay">
              <div className="distance-tracker-modal-card">
                <button
                  className="close-distance-btn"
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 20,
                    background: "none",
                    border: "none",
                    fontSize: "1.6em",
                    cursor: "pointer",
                    color: "#888"
                  }}
                  onClick={() => setShowDistance(false)}
                >
                  ×
                </button>
                <DistanceTracker />
              </div>
            </div>
          )}
        </div>
      )}

      {browsing && (
        <BrowseActivitiesModal
          onSave={handleBrowseDone}
          onClose={() => setBrowsing(false)}
        />
      )}
      {browseModal.open && (
        <BrowseActivitiesModal
          onSave={handleBrowseDoneSlot}
          onClose={() => setBrowseModal({ open: false, day: null, slot: null })}
        />
      )}
    </div>
  );
}