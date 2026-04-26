import { useEffect, useState } from "react";
import "./BackgroundCarousel.css";
import Veil from "./Veil/Veil";
import { fetchFromApi } from "../api";

const VEIL_CLASS_MAP = {
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

// ------------------------------------------------------------
// BACKEND RANDOMIZER (Express + Cloudinary Search API)
// ------------------------------------------------------------

async function getRandomFromServer(folder) {
  try {
    const res = await fetchFromApi(`/random-image?folder=${encodeURIComponent(folder)}`);
    const data = await res.json();
    return data.url || null;
  } catch (err) {
    console.error("Randomizer backend error:", err);
    return null;
  }
}


export default function BackgroundCarousel({
  photos,
  veilMode,
  weatherImage,
  weatherMood,
  season,
}) {
  const [index, setIndex] = useState(0);

  const [deepLayer, setDeepLayer] = useState(null);
  const [midLayer, setMidLayer] = useState(null);
  const [foregroundLayer, setForegroundLayer] = useState(null);

  const hasPhotos = Array.isArray(photos) && photos.length > 0;

  // ------------------------------------------------------------
  // Rotate DB photos
  // ------------------------------------------------------------
  useEffect(() => {
    if (!hasPhotos) {
      setIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [hasPhotos, photos]);

  // ------------------------------------------------------------
  // Load Cloudinary atmospheric layers (via backend)
  // ------------------------------------------------------------
  useEffect(() => {
    async function loadLayers() {
      const deep = await getRandomFromServer("reflections");
      const mid = await getRandomFromServer(season ? season.toLowerCase() : "spring");
      const fg = await getRandomFromServer("textures");

      setDeepLayer(deep);
      setMidLayer(mid);
      setForegroundLayer(fg);
    }

    loadLayers();
  }, [season, weatherMood]);

  const veilClassName = VEIL_CLASS_MAP[veilMode] || VEIL_CLASS_MAP.on;
  const moodClassName = MOOD_CLASS_MAP[weatherMood] || MOOD_CLASS_MAP.neutral;
  const seasonClassName = season ? `season-${season}` : "";

  return (
    <div className={`background-carousel ${veilClassName} ${moodClassName} ${seasonClassName}`}>
      <div className="seasonal-drift" />

      {/* Deep atmospheric layer */}
      {deepLayer && (
        <div
          className="bg-layer deep-layer loaded"
          style={{ backgroundImage: `url(${deepLayer})` }}
        />
      )}

      {/* Mid-layer */}
      {midLayer && (
        <div
          className="bg-layer mid-layer loaded"
          style={{ backgroundImage: `url(${midLayer})` }}
        />
      )}

      {/* Weather image layer */}
      {weatherImage && (
        <div
          className="weather-image loaded"
          style={{ backgroundImage: `url(${weatherImage})` }}
        />
      )}

      {weatherMood === "rain" && <div className="rain-layer" />}
      {weatherMood === "snow" && <div className="snow-layer" />}
      {weatherMood === "mist" && <div className="mist-layer" />}
      {weatherMood === "storm" && <div className="lightning-flash" />}
      {season === "autumn" && <div className="embers" />}

      {/* DB photos */}
      {hasPhotos &&
        photos.map((src, i) => (
          <img
            key={i}
            src={src}
            className={`bg-image ${i === index ? "active" : ""}`}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}

      {/* Foreground shimmer */}
      {foregroundLayer && (
        <div
          className="bg-layer foreground-layer loaded"
          style={{ backgroundImage: `url(${foregroundLayer})` }}
        />
      )}

      {/* Cinematic veil */}
      <Veil moodColor={weatherMood} state={veilMode} season={season} />
    </div>
  );
}
