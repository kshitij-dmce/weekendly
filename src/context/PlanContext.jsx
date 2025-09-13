// import React, { createContext, useContext, useState } from "react";

// const PlanContext = createContext();

// export const usePlan = () => useContext(PlanContext);

// export const PlanProvider = ({ children }) => {
//   const [selectedDays, setSelectedDays] = useState([]); // e.g. ['2025-09-13', '2025-09-14']
//   const [plan, setPlan] = useState({}); // { '2025-09-13': [ {activity, mood}, ... ] }
  
//   // Add activity to a specific day
//   const addActivity = (day, activity) => {
//     setPlan((prev) => ({
//       ...prev,
//       [day]: prev[day] ? [...prev[day], { ...activity, mood: null }] : [{ ...activity, mood: null }],
//     }));
//   };

//   // Remove activity
//   const removeActivity = (day, activityId) => {
//     setPlan((prev) => ({
//       ...prev,
//       [day]: prev[day].filter(a => a.id !== activityId),
//     }));
//   };

//   // Update mood
//   const setMood = (day, activityId, mood) => {
//     setPlan((prev) => ({
//       ...prev,
//       [day]: prev[day].map(a => a.id === activityId ? { ...a, mood } : a),
//     }));
//   };

//   // Reorder activities
//   const reorderActivities = (day, newOrder) => {
//     setPlan((prev) => ({
//       ...prev,
//       [day]: newOrder,
//     }));
//   };

//    return (
//     <PlanContext.Provider value={{
//       selectedDays, setSelectedDays,
//       plan, setPlan, // <-- add setPlan here
//       addActivity, removeActivity, setMood, reorderActivities
//     }}>
//       {children}
//     </PlanContext.Provider>
//   );
// };


import React, { createContext, useContext, useState } from "react";

const slotKeys = ["morning", "afternoon", "evening", "night"];

const PlanContext = createContext();

export const usePlan = () => useContext(PlanContext);

export const PlanProvider = ({ children }) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [plan, setPlan] = useState({});

  // Ensure plan is initialized when days change
  React.useEffect(() => {
    if (selectedDays.length) {
      setPlan(
        selectedDays.reduce((acc, day) => {
          acc[day] = acc[day] || { morning: [], afternoon: [], evening: [], night: [] };
          return acc;
        }, {})
      );
    }
  }, [selectedDays]);

  // Add activity to a day's slot
  function addActivity(day, slot, activity) {
    setPlan(prev => {
      const dayPlan = prev[day] || { morning: [], afternoon: [], evening: [], night: [] };
      // Ensure unique string id for dnd
      let id = activity.id || `${activity.category || "act"}-${activity.name}`; 
      return {
        ...prev,
        [day]: {
          ...dayPlan,
          [slot]: [...(dayPlan[slot] || []), { ...activity, id: String(id) }]
        }
      };
    });
  }

  // Remove activity
  function removeActivity(day, slot, id) {
    setPlan(prev => {
      const dayPlan = { ...prev[day] };
      dayPlan[slot] = dayPlan[slot].filter(act => String(act.id) !== String(id));
      return { ...prev, [day]: dayPlan };
    });
  }

  // Move activity (used for mobile "Move" button or dnd)
  function moveActivity(fromDay, fromSlot, toDay, toSlot, id) {
    setPlan(prev => {
      const srcList = Array.from(prev[fromDay]?.[fromSlot] || []);
      const idx = srcList.findIndex(act => String(act.id) === String(id));
      if (idx === -1) return prev;
      const [moved] = srcList.splice(idx, 1);
      const destList = Array.from(prev[toDay]?.[toSlot] || []);
      destList.push(moved);
      return {
        ...prev,
        [fromDay]: { ...prev[fromDay], [fromSlot]: srcList },
        [toDay]: { ...prev[toDay], [toSlot]: destList }
      };
    });
  }

  // Drag & Drop reorder/move
  function reorderTimelineActivities(result) {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    const [srcDay, srcSlot] = source.droppableId.split("|");
    const [destDay, destSlot] = destination.droppableId.split("|");
    setPlan(prev => {
      const srcList = Array.from(prev[srcDay]?.[srcSlot] || []);
      const [moved] = srcList.splice(source.index, 1);
      const destList = Array.from(prev[destDay]?.[destSlot] || []);
      destList.splice(destination.index, 0, moved);
      return {
        ...prev,
        [srcDay]: { ...prev[srcDay], [srcSlot]: srcList },
        [destDay]: { ...prev[destDay], [destSlot]: destList }
      };
    });
  }

  function setActivityPlace(day, slot, id, place) {
  setPlan(prev => {
    const oldSlot = prev[day][slot];
    const updatedSlot = oldSlot.map(act =>
      String(act.id) === String(id) ? { ...act, place } : act
    );
    return {
      ...prev,
      [day]: { ...prev[day], [slot]: updatedSlot }
    };
  });
}


// set mood of the activity 
  const setMood = (day, activityId, mood) => {
  setPlan(prev => ({
    ...prev,
    [day]: Object.fromEntries(
      Object.entries(prev[day]).map(([slot, acts]) => [
        slot,
        acts.map(a => a.id === activityId ? { ...a, mood } : a)
      ])
    )
  }));
};
  return (
    <PlanContext.Provider value={{
      selectedDays, setSelectedDays,
      plan, setPlan, setActivityPlace,setMood,
      addActivity, removeActivity, moveActivity,
      reorderTimelineActivities
    }}>
      {children}
    </PlanContext.Provider>
  );
};