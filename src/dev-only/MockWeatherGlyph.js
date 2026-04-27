import React, { useState } from "react";
import WeatherGlyph from "../components/WeatherGlyphPanel";

export default function MockWeatherGlyph() {
  const [condition, setCondition] = useState("clear");
  const [isNight, setIsNight] = useState(false);
  const [temperature, setTemperature] = useState(12);

  const conditions = [
    "clear",
    "cloudy",
    "rain",
    "snow",
    "mist",
    "storm"
  ];

  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "#fff" }}>
      <h2>WeatherGlyph Visual Tester</h2>

      <WeatherGlyph
        condition={condition}
        temperature={temperature}
        location="Test Location"
        timestamp={new Date().toISOString()}
        weatherMood={condition}
        isNight={isNight}
        weatherDescription={condition}
      />

      <div style={{ marginTop: "2rem" }}>
        <h3>Weather Conditions</h3>
        {conditions.map((c) => (
          <button
            key={c}
            onClick={() => setCondition(c)}
            style={{
              margin: "0.3rem",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h3>Night Mode</h3>
        <button
          onClick={() => setIsNight(!isNight)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Toggle Night
        </button>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h3>Temperature</h3>
        <input
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            width: "80px",
            textAlign: "center"
          }}
        />
      </div>
    </div>
  );
}
