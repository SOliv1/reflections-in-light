import React, { useState } from "react";
import "./WeatherGlyph.css";

const WeatherGlyph = ({
  condition,
  temperature,
  location,
  timestamp,
  weatherMood,
  isNight,
  weatherDescription,
}) => {
  const [expanded, setExpanded] = useState(false);

  void location;
  void timestamp;
  void weatherDescription;

  const resolvedCondition = condition ?? "unknown";
  const mood = weatherMood ?? "unknown";

  function poeticCondition(conditionValue) {
    const c = String(conditionValue ?? "unknown").toLowerCase();

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
    if (numericTemp >= 20) return `A warm ${numericTemp}° glow`;
    if (numericTemp >= 12) return `A gentle ${numericTemp}° warmth`;
    if (numericTemp >= 6) return `A cool ${numericTemp}°`;
    if (numericTemp >= 0) return `A crisp ${numericTemp}°`;
    return `A frosty ${numericTemp}°`;
  }

  return (
    <div className="weather-glyph-wrapper">
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
        </div>

        <div className="weather-text">
          <div className="condition">{poeticCondition(resolvedCondition)}</div>
          <div className="temperature">{poeticTemperature(temperature)}</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherGlyph;
