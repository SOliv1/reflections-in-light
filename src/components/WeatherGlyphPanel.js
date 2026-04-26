import React, { useState } from "react";
import "./WeatherGlyph.css";
import "./WeatherGlyphPanel.css";

export default function WeatherGlyphPanel({
  condition,
  temperature,
  location,
  timestamp,
  weatherMood,
  isNight,
  weatherDescription,
}) {
  const [expanded, setExpanded] = useState(false);
  void timestamp;

  const resolvedCondition = condition ?? "unknown";
  const mood = weatherMood ?? "unknown";
  const resolvedLocation = location || "Local weather";
  const conditionCopy = weatherDescription || resolvedCondition;
  const panelMoodClass = `weather-glyph-panel--${mood}`;

  function poeticCondition(conditionValue) {
    const c = String(conditionValue ?? "unknown").toLowerCase();

    if (resolvedCondition === "sunny" || c.includes("clear sky")) {
      return "Bright, clear daylight";
    }
    if (c.includes("broken clouds") || c.includes("scattered clouds")) {
      return "A bright sunny day with cloud drift";
    }
    if (c.includes("few clouds")) {
      return "Peach-gold sunshine with a veil of cloud";
    }
    if (c.includes("clear sky")) return "Clear, sunlit skies";
    if (c.includes("few clouds")) return "Bright light with a passing veil of cloud";
    if (c.includes("overcast")) return "A quiet layer of overcast cloud";
    if (c.includes("cloud")) return "Soft cloud cover drifting above";
    if (c.includes("clear")) return "Clear, open skies";
    if (c.includes("rain")) return "Rain whispering through the air";
    if (c.includes("snow")) return "Snowlight drifting softly";
    if (c.includes("mist") || c.includes("fog")) return "Mist settling gently";
    if (c.includes("storm")) return "A restless storm presence";

    return conditionValue;
  }

  function poeticTemperature(temp) {
    const numericTemp = Number(temp);
    if (Number.isNaN(numericTemp)) return "Temperature unknown";
    if (numericTemp >= 20) return `A warm ${numericTemp.toFixed(1)} deg glow`;
    if (numericTemp >= 12) return `A gentle ${numericTemp.toFixed(1)} deg warmth`;
    if (numericTemp >= 6) return `A cool ${numericTemp.toFixed(1)} deg`;
    if (numericTemp >= 0) return `A crisp ${numericTemp.toFixed(1)} deg`;
    return `A frosty ${numericTemp.toFixed(1)} deg`;
  }

  function displayTemperature(temp) {
    const numericTemp = Number(temp);
    if (Number.isNaN(numericTemp)) return "--";
    return numericTemp.toFixed(1);
  }

  return (
    <div className={`weather-glyph-panel ${panelMoodClass}`}>
      <div
        className={`weather-glyph ${resolvedCondition} mood-${mood} ${
          isNight ? "night" : "day"
        } ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="breathing-wrapper">
          <div className="weather-core"></div>
          <div className="rain-layer"></div>
          <div className="snow-layer"></div>
          <div className="sparkle-layer"></div>
          <div className="weather-reading">
            <span className="weather-reading-value">{displayTemperature(temperature)}</span>
            <span className="weather-reading-unit">deg C</span>
          </div>
        </div>
      </div>

      <div className="weather-panel-text">
        <div className="condition">{poeticCondition(conditionCopy)}</div>
        <div className="temperature">{poeticTemperature(temperature)}</div>
        <div className="location">{resolvedLocation}</div>
      </div>
    </div>
  );
}
