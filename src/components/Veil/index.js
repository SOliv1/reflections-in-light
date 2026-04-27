import React from "react";

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

export default function Veil({ moodColor = "neutral", state = "on", season = "" }) {
  const veilStateClass = STATE_CLASS_MAP[state] || STATE_CLASS_MAP.on;
  const moodClass = MOOD_CLASS_MAP[moodColor] || MOOD_CLASS_MAP.neutral;
  const seasonClass = season ? `season-${season}` : "";

  return (
    <div id="veil" className={`${veilStateClass} ${moodClass} ${seasonClass}`} aria-hidden="true">
      <div className="twilight-overlay" />
    </div>
  );
}
