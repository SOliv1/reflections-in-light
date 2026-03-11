import React from "react";
import "./Constellation.css";

// Seasonal helper
function getSeason() {
  const month = new Date().getMonth();
  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
}

export default function Constellation() {
  const season = getSeason();

  const moonPhase = {
    winter: "full",
    spring: "new",
    summer: "crescent",
    autumn: "waning",
  }[season];

  return (
    <div className="constellation-wrapper interactive active">
      <div className={`moon ${moonPhase}`}></div>
      <div className="constellation-overlay"></div>

      <div className="constellation-container">
        {/* Stars */}
        <div className="star" style={{ top: "4%", left: "12%" }}></div>
        <div className="star" style={{ top: "6%", left: "28%" }}></div>
        <div className="star" style={{ top: "5%", left: "45%" }}></div>
        <div className="star" style={{ top: "7%", left: "62%" }}></div>
        <div className="star" style={{ top: "9%", left: "78%" }}></div>
        <div className="star" style={{ top: "12%", left: "35%" }}></div>
        <div className="star" style={{ top: "14%", left: "70%" }}></div>

        {/* Shooting star */}
        <div className="shooting-star"></div>
      </div>
    </div>
  );
}

