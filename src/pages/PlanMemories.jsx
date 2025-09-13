import React, { useEffect, useState, useRef } from "react";
import { getPlansFromStorage, savePlanToStorage } from "../utils/planStorage";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PlanMemoriesPage() {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setPlans(getPlansFromStorage());
  }, []);

  function handleSelect(plan) {
    setSelected(plan);
  }

  function handleMemoryChange(activityIdx, { photo, note }) {
    const updated = { ...selected };
    if (!updated.activities[activityIdx].memory) updated.activities[activityIdx].memory = {};
    if (photo !== undefined) updated.activities[activityIdx].memory.photo = photo;
    if (note !== undefined) updated.activities[activityIdx].memory.note = note;
    setSelected(updated);
    savePlanToStorage(updated);
    setPlans(getPlansFromStorage());
  }

  async function handleExportPDF() {
    const node = document.getElementById("memory-journal");
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${selected.name}-memories.pdf`);
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>📚 My Plans & Memories</h1>
      {!selected ? (
        <>
          <h2 style={{ marginTop: 32 }}>Saved Plans</h2>
          {plans.length === 0 && <div>No plans found.</div>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 14 }}>
            {plans.map(plan => (
              <div
                key={plan.id}
                style={{
                  border: "2px solid #e0e7ff",
                  borderRadius: 12,
                  padding: 16,
                  minWidth: 180,
                  background: "#f8fafc",
                  cursor: "pointer"
                }}
                onClick={() => handleSelect(plan)}
              >
                <h3>{plan.name}</h3>
                <div>Status: <b>{plan.status || "on-going"}</b></div>
                <div>Activities: {plan.activities?.length || 0}</div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {new Date(plan.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <MemoryJournal
          plan={selected}
          onBack={() => setSelected(null)}
          onMemoryChange={handleMemoryChange}
          onExport={handleExportPDF}
        />
      )}
    </div>
  );
}

function MemoryJournal({ plan, onBack, onMemoryChange, onExport }) {
  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 16 }}>← Back to Plans</button>
      <h2>{plan.name} <span style={{ fontSize: 18, color: "#888" }}>({plan.status})</span></h2>
      <div style={{ margin: "8px 0 24px 0", color: "#666" }}>
        Created: {new Date(plan.createdAt).toLocaleDateString()}<br />
        Activities: {plan.activities.length}
      </div>
      <div id="memory-journal" style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 22px #6366f133", maxWidth: 700, margin: "0 auto" }}>
        {plan.activities.map((act, idx) => (
          <MemoryActivityBlock
            key={idx}
            activity={act}
            idx={idx}
            onMemoryChange={onMemoryChange}
          />
        ))}
      </div>
      <div style={{ marginTop: 36 }}>
        <button onClick={onExport} style={{ background: "#6366f1", color: "#fff", padding: "8px 20px", borderRadius: 10, border: "none", fontWeight: 600 }}>
          Export as PDF
        </button>
      </div>
    </div>
  );
}

function MemoryActivityBlock({ activity, idx, onMemoryChange }) {
  const [note, setNote] = useState(activity.memory?.note || "");
  const [photoData, setPhotoData] = useState(activity.memory?.photo || "");

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoData(reader.result);
      onMemoryChange(idx, { photo: reader.result });
    };
    reader.readAsDataURL(file);
  }

  function handleNoteSave() {
    onMemoryChange(idx, { note });
  }

  return (
    <div style={{
      border: "1.5px solid #e0e7ff", borderRadius: 10, padding: 18, marginBottom: 18,
      display: "flex", alignItems: "center", background: "#f9fafb"
    }}>
      <div style={{ marginRight: 18, textAlign: "center" }}>
        <div style={{ fontSize: 30 }}>{activity.icon || "📌"}</div>
        <div style={{ fontWeight: 600 }}>{activity.name}</div>
        <div style={{ fontSize: 14, color: "#666" }}>{activity.time || ""}</div>
        <div style={{ fontSize: 13, color: "#888" }}>{activity.place?.name || ""}</div>
      </div>
      <div style={{ flex: 1 }}>
        <div>
          <b>Memory Note:</b>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            onBlur={handleNoteSave}
            rows={2}
            style={{ width: "100%", borderRadius: 8, marginTop: 2, marginBottom: 8, padding: 4 }}
            placeholder="Write your memory or story for this activity..."
          />
        </div>
        <div>
          <b>Photo:</b>
          <div style={{ marginTop: 4, marginBottom: 4 }}>
            {photoData ? (
              <img src={photoData} alt="memory" style={{ maxWidth: 140, borderRadius: 8, marginBottom: 6 }} />
            ) : (
              <span style={{ color: "#aaa" }}>No photo yet</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ marginTop: 4 }}
          />
        </div>
      </div>
    </div>
  );
}