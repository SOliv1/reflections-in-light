import React, { useEffect, useMemo, useState } from "react";
import "./WeatherGlyph.css";
import "./WeatherGlyphPanel.css";
import MiniOrbMenu from "./miniOrbMenu";

const PALETTE_CLASSES = {
  winter: "weather-glyph-palette--winter",
  spring: "weather-glyph-palette--spring",
  summer: "weather-glyph-palette--summer",
  autumn: "weather-glyph-palette--autumn"
};

export default function WeatherGlyphPanel({
  condition,
  temperature,
  location,
  timestamp,
  weatherMood,
  isNight,
  weatherDescription,
  season = "spring",
  activeMode = "architectural"
}) {
  const [expanded, setExpanded] = useState(false);
  const [isMiniOrbOpen, setMiniOrbOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const [activePalette, setActivePalette] = useState(season);
  void timestamp;

  useEffect(() => {
    setActivePalette(season);
  }, [season]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const resolvedCondition = condition ?? "unknown";
  const mood = weatherMood ?? "unknown";
  const resolvedLocation = location || "Local weather";
  const conditionCopy = weatherDescription || resolvedCondition;
  const panelMoodClass = `weather-glyph-panel--${mood}`;
  const paletteClass = PALETTE_CLASSES[activePalette] || PALETTE_CLASSES.spring;
  const currentTime = useMemo(
    () =>
      clock.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
      }),
    [clock]
  );
  const currentDate = useMemo(
    () =>
      clock.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short"
      }),
    [clock]
  );

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
    <>
      <MiniOrbMenu
        isOpen={isMiniOrbOpen}
        activePalette={activePalette}
        onToggle={() => setMiniOrbOpen((open) => !open)}
        onSelectPalette={(palette) => {
          setActivePalette(palette);
          setMiniOrbOpen(false);
        }}
      />

      <div className={`weather-glyph-stage ${paletteClass} mode-${activeMode}`}>
        <div className={`weather-glyph-panel ${panelMoodClass}`}>
          <button
            type="button"
            className={`weather-glyph ${resolvedCondition} mood-${mood} ${
              isNight ? "night" : "day"
            } ${expanded ? "expanded" : ""}`}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="Expand weather orb"
          >
            <div className="breathing-wrapper">
              <div className="weather-core"></div>
              <div className="rain-layer"></div>
              <div className="snow-layer"></div>
              <div className="sparkle-layer"></div>
              <div className="weather-reading">
                <span className="weather-reading-time">{currentTime}</span>
                <span className="weather-reading-date">{currentDate}</span>
                <span className="weather-reading-temp">{displayTemperature(temperature)} deg C</span>
              </div>
            </div>
          </button>

          <div className="weather-panel-text">
            <div className="condition">{poeticCondition(conditionCopy)}</div>
            <div className="temperature">{poeticTemperature(temperature)}</div>
            <div className="location">{resolvedLocation}</div>
            <div className="weather-panel-note">
              Tap the orb to open the stage. Use the mini orb to colour the light.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
