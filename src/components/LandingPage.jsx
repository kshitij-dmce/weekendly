import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">Weekendly</h1>
      <p className="landing-desc">
        Plan your perfect weekend or long weekend with fun, interactive tools. Pick activities, drag & drop, assign moods, and make every weekend memorable!
      </p>
      <button className="landing-btn" onClick={() => navigate("/plan")}>
        Start Planning
      </button>
    </div>
  );
}