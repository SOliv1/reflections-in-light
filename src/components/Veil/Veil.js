// src/components/Veil/Veil.js
import React, { useMemo } from "react";

const STATE_CLASS_MAP = {
  on: "veil-default",
  lift: "veil-lift",
  off: "veil-none",
};

const MOOD_CLASS_MAP = {
  sunny: "mood-sunny",
  clear: "mood-sunny",
  cloudy: "mood-cloudy",
  rain: "mood-rain",
  storm: "mood-storm",
  mist: "mood-mist",
  snow: "mood-snow",
  neutral: "mood-neutral",
  unknown: "mood-neutral",
};

export default function Veil({ moodColor = "neutral", state = "on", season = "", autoVeil = false }) {
  // Auto veil logic
  const computedState = useMemo(() => {
    if (!autoVeil) return state; // manual mode

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "on";        // morning veil (soft)
    if (hour >= 12 && hour < 17) return "on";       // twilight veil (your default)
    if (hour >= 17 && hour < 21) return "lift";     // blue-hour (lighter lift)
    return "off";                                   // night veil (deep)
  }, [state, autoVeil]);

  const veilStateClass = STATE_CLASS_MAP[computedState] || STATE_CLASS_MAP.on;
  const moodClass = MOOD_CLASS_MAP[moodColor] || MOOD_CLASS_MAP.neutral;
  const seasonClass = season ? `season-${season}` : "";

  return (
    <div id="veil" className={`${veilStateClass} ${moodClass} ${seasonClass}`} aria-hidden="true">
      <div className="twilight-overlay" />
    </div>
  );
}
