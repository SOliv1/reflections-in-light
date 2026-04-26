import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
//import logo from "./assets/logo.png";
import BackgroundCarousel from "./components/BackgroundCarousel";
import Calendar from "./components/Calendar";
import Constellation from "./components/Constellation";
import Portal from "./components/portal/Portal";
import WeatherGlyph from "./components/WeatherGlyphPanel";
import { fetchFromApi } from "./api";
import { BIRTHDAY_DAY, BIRTHDAY_MONTH } from "./data/birthdayExperience";
import useWeatherPhotos from "./hooks/useWeatherPhotos";
import DayPage from "./pages/DayPage";
import MockWeatherGlyph from "./dev-only/MockWeatherGlyph";
import QuietActionsDrawer from "./components/QuietActionsDrawer";
import "./styles/DrawerUnified.css";
import ShortReflectionsDrawer from "./components/ShortReflectionsDrawer";
import UnifiedDrawer from "./components/UnifiedDrawer";
import QuoteDrawer from "./components/QuoteDrawer";
import LightNotesDrawer from "./components/LightNotesDrawer";
import { quotes } from "./data/quotes";


function normalizeWeatherClass(condition = "unknown") {
  const value = String(condition).toLowerCase();

  if (value.includes("clear")) return "sunny";
  if (value.includes("cloud")) return "cloudy";
  if (value.includes("drizzle") || value.includes("rain")) return "rain";
  if (value.includes("snow")) return "snow";
  if (
    value.includes("mist") ||
    value.includes("fog") ||
    value.includes("haze") ||
    value.includes("smoke") ||
    value.includes("dust") ||
    value.includes("ash")
  ) {
    return "mist";
  }
  if (value.includes("thunder") || value.includes("storm")) return "storm";

  return "unknown";
}

function normalizeWeatherEntry(weatherEntry = {}) {
  const main = String(weatherEntry.main || "");
  const description = String(weatherEntry.description || "");
  const icon = String(weatherEntry.icon || "");
  const combined = `${main} ${description}`.toLowerCase();
  const isDaytimeIcon = icon.endsWith("d");

  if (
    isDaytimeIcon &&
    (
      combined.includes("few clouds") ||
      combined.includes("scattered clouds") ||
      combined.includes("broken clouds")
    )
  ) {
    return "sunny";
  }

  if (icon.startsWith("01") || icon.startsWith("02")) return "sunny";
  if (icon.startsWith("03") || icon.startsWith("04")) return "cloudy";
  if (icon.startsWith("09") || icon.startsWith("10")) return "rain";
  if (icon.startsWith("11")) return "storm";
  if (icon.startsWith("13")) return "snow";
  if (icon.startsWith("50")) return "mist";

  return normalizeWeatherClass(combined || main);
}

function formatLocationLabel(data) {
  const city = String(data?.name || "").trim();
  const country = String(data?.sys?.country || "").trim();

  if (city && country) {
    return `${city}, ${country}`;
  }

  if (city) {
    return city;
  }

  return "Local weather";
}

function getQuoteOfTheDay() {
  const today = new Date();
  const index = (today.getDate() - 1) % quotes.length;
  return quotes[index];
}

function AppShell() {
  const modes = ["architectural", "water", "macro"];
  const [mode, setMode] = useState("architectural");
  const [photos, setPhotos] = useState([]);
  const [veilMode, setVeilMode] = useState("off");
  const [autoVeil, setAutoVeil] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState("Local weather");
  const veilOn = () => setVeilMode("on");
  const liftVeil = () => setVeilMode("lift");
  const veilOff = () => setVeilMode("off");
  

  const cycleMode = () => {
    const currentIndex = modes.indexOf(mode);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const birthdayMatch = location.pathname.match(/^\/day\/(\d{4})-(\d{2})-(\d{2})$/);
  const isBirthdayScene = birthdayMatch
    ? Number(birthdayMatch[2]) === BIRTHDAY_MONTH &&
      Number(birthdayMatch[3]) === BIRTHDAY_DAY
    : false;

  useEffect(() => {
    async function loadGallery() {
      async function attemptGalleryLoad(remainingAttempts = 3) {
        const res = await fetchFromApi("/api/gallery");

        if (!res.ok) {
          throw new Error(`Gallery request failed with status ${res.status}`);
        }

        const data = await res.json();
        const urls = Array.isArray(data)
          ? data
              .map((item) => item?.photoUrl || item?.imageUrl || item?.url)
              .filter(Boolean)
          : [];

        return urls;
      }

      try {
        let urls = [];
        let attemptsRemaining = 3;

        while (attemptsRemaining > 0) {
          try {
            urls = await attemptGalleryLoad(attemptsRemaining);
            break;
          } catch (error) {
            attemptsRemaining -= 1;
            if (attemptsRemaining === 0) {
              throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 1200));
          }
        }

        setPhotos(urls);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        setPhotos([]);
      }
    }

    loadGallery();
  }, []);

  useEffect(() => {
    async function loadWeather() {
      async function applyWeatherResponse(res) {
        if (!res.ok) {
          throw new Error(`Weather request failed with status ${res.status}`);
        }

        const data = await res.json();
        const primaryWeather = data.weather?.[0] || {};

        setTemperature(data.main?.temp || null);
        setWeatherDescription(primaryWeather.description || primaryWeather.main || "Unknown");
        setWeatherCondition(normalizeWeatherEntry(primaryWeather));
        setWeatherLocation(formatLocationLabel(data));
      }

      const geolocationOptions = {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      };

      try {
        if (!navigator.geolocation) {
          throw new Error("Geolocation not supported");
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              const res = await fetchFromApi(`/api/weather?lat=${lat}&lon=${lon}`);
              await applyWeatherResponse(res);
            } catch (err) {
              console.error("Failed to load weather:", err);
              setWeatherDescription("Unknown");
              setWeatherCondition(normalizeWeatherClass("unknown"));
              setWeatherLocation("Local weather");
            }
          },
          (geoError) => {
            console.warn("Geolocation failed for weather:", geoError);
            loadWeatherFallback();
          },
          geolocationOptions
        );
      } catch (err) {
        console.error("Geolocation setup failed:", err);
        loadWeatherFallback();
      }

      async function loadWeatherFallback() {
        try {
          const res = await fetchFromApi("/api/weather");
          await applyWeatherResponse(res);
        } catch (err) {
          console.error("Failed to load weather:", err);
          setWeatherDescription("Unknown");
          setWeatherCondition(normalizeWeatherClass("unknown"));
          setWeatherLocation("Local weather");
        }
      }
    }

    loadWeather();
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--scroll", window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hour = new Date().getHours();
  let timeOfDay = "day";
  if (hour >= 19 || hour < 5) timeOfDay = "night";
  else if (hour >= 17) timeOfDay = "evening";

  const month = new Date().getMonth();
  const season =
    month === 11 || month <= 1
      ? "winter"
      : month >= 2 && month <= 4
        ? "spring"
        : month >= 5 && month <= 7
          ? "summer"
          : "autumn";

  const isNight = hour < 6 || hour >= 18;
  const backgroundImage = useWeatherPhotos(isHomePage);
  const weatherMood = weatherCondition || "neutral";

  // App.js or HomePage.js
  const [orbColor, setOrbColor] = useState('#8ab4f8'); // example default

  const [isReflectionsOpen, setReflectionsOpen] = useState(false);
  const [isQuoteOpen, setQuoteOpen] = useState(false);
  const [isActionsHelpOpen, setActionsHelpOpen] = useState(false);

  const openReflections = () => setReflectionsOpen(true);
  const closeReflections = () => setReflectionsOpen(false);

  const openQuoteDrawer = () => setQuoteOpen(true);
  const closeQuoteDrawer = () => setQuoteOpen(false);
  const [currentQuote] = useState(() => getQuoteOfTheDay());
  const [isActionsOpen, setActionsOpen] = useState(false);
  const openActionsDrawer = () => setActionsOpen(true);
  const closeActionsDrawer = () => setActionsOpen(false);
  const openActionsHelp = () => setActionsHelpOpen(true);
  const closeActionsHelp = () => setActionsHelpOpen(false);

  const [isNotesOpen, setNotesOpen] = useState(false);
  const openNotesDrawer = () => setNotesOpen(true);
  const closeNotesDrawer = () => setNotesOpen(false);

  // When mode changes:
  useEffect(() => {
    if (mode === 'architectural') setOrbColor('#e3b57a');
    if (mode === 'water') setOrbColor('#7ac6ff');
    if (mode === 'macro') setOrbColor('#d88cff');
  }, [mode]);


  return (
  <>
    <div className="sky-wrapper">
      <Constellation veilMode={veilMode} birthdayMode={isBirthdayScene} />
      <Portal
        type="mood"
        dayIndex={1}
        season={season}
        mood={weatherMood}
        cueText=""
        weatherMood={weatherMood}
      />
    </div>

    <div className={`App mode-${mode} time-${timeOfDay}`}>
      <Link to="/" className="app-home-logo" aria-label="Return home">
        {/*<img src={logo} className="App-logo" alt="My Reflections Glow logo" /> */}
      </Link>

      {!isHomePage ? (
        <Link
          to="/"
          className="crescent-portal app-home-orb"
          aria-label="Return home"
        />
      ) : null}

      {isHomePage ? (
        <BackgroundCarousel
          photos={photos}
          veilMode={veilMode}
          weatherImage={backgroundImage}
          weatherMood={weatherMood}
          season={season}
        />
      ) : null}

      <div className="veil-controls-wrapper">
        <div className="veil-controls">
          <button
            type="button"
            className={`veil-control-btn veil-control-btn--on ${veilMode === "on" ? "is-active" : ""}`}
            onClick={veilOn}
          >
            Veil On
          </button>
          <button
            type="button"
            className={`veil-control-btn veil-control-btn--lift ${veilMode === "lift" ? "is-active" : ""}`}
            onClick={liftVeil}
          >
            Lift Veil
          </button>
          <button
            type="button"
            className={`veil-control-btn veil-control-btn--off ${veilMode === "off" ? "is-active" : ""}`}
            onClick={veilOff}
          >
            Veil Off
          </button>
          <button
            type="button"
            className={`veil-control-btn veil-control-btn--auto ${autoVeil ? "is-active" : ""}`}
            onClick={() => setAutoVeil(!autoVeil)}
          >
              {autoVeil ? "Manual Veil" : "Auto Veil"}
          </button>
        </div>

        {/* Top UI Row */}
        <div className="top-ui-row">
          <div className="reflections-trigger">
            <div className="inspiration-panel">
              <button className="inspo-btn" onClick={openReflections}>
                Reflections
              </button>

          <button className="inspo-btn" onClick={openQuoteDrawer}>
                Quote of the Day
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal Header */}
      <div className="seasonal-header">
        <h1 className="month-title">A Month of Light</h1>
        <h2 className="date-subtitle">April 2026</h2>
      </div>

      {isHomePage ? (
        <>
          <div className="actions-help-trigger-row">
            <button
              type="button"
              className={`actions-help-pill actions-help-pill--${mode}`}
              onClick={openActionsHelp}
              aria-haspopup="dialog"
              aria-expanded={isActionsHelpOpen}
              aria-controls="actions-help-modal"
            >
              How it works
            </button>
          </div>

          {isActionsHelpOpen ? (
            <div
              className="actions-help-overlay"
              role="presentation"
              onClick={closeActionsHelp}
            >
              <section
                id="actions-help-modal"
                className={`actions-help-modal actions-help-modal--${mode}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="actions-help-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="actions-help-close"
                  onClick={closeActionsHelp}
                  aria-label="Close help"
                >
                  ×
                </button>

                <h3 id="actions-help-title" className="actions-help-title">
                  Actions reminders
                </h3>

                <p className="actions-help-intro">
                  A quick guide for setting up gentle browser reminders.
                </p>

                <ol className="actions-help-list">
                  <li>Open <strong>Reflections</strong>, then choose <strong>Quiet Actions</strong>.</li>
                  <li>Add the tasks or intentions you want to remember.</li>
                  <li>Pick a reminder time and tap <strong>Enable reminders</strong>.</li>
                  <li>Allow notifications when the browser asks.</li>
                  <li>Use <strong>Send test notification</strong> to confirm it works.</li>
                </ol>

                <p className="actions-help-note">
                  On iPhone, Safari plus adding the site to the Home Screen is the most reliable setup.
                </p>
              </section>
            </div>
          ) : null}
        </>
      ) : null}

      {/* Drawers */}
      <UnifiedDrawer isOpen={isReflectionsOpen} onClose={closeReflections}>
        <ShortReflectionsDrawer
          orbColor={orbColor}
          weatherMood={weatherMood}
          season={season}
          onOpenActions={openActionsDrawer}
          onOpenNotes={openNotesDrawer}
          onClose={closeReflections}
        />
      </UnifiedDrawer>

      <UnifiedDrawer isOpen={isQuoteOpen} onClose={closeQuoteDrawer}>
        <QuoteDrawer
          quote={currentQuote}
          orbColor={orbColor}
          onClose={closeQuoteDrawer}
        />
      </UnifiedDrawer>

      <UnifiedDrawer isOpen={isActionsOpen} onClose={closeActionsDrawer}>
        <QuietActionsDrawer
          orbColor={orbColor}
          onClose={closeActionsDrawer}
        />
      </UnifiedDrawer>

      <UnifiedDrawer isOpen={isNotesOpen} onClose={closeNotesDrawer}>
        <LightNotesDrawer
          orbColor={orbColor}
          onClose={closeNotesDrawer}
        />
      </UnifiedDrawer>

      {/* Mode Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          className={mode === "architectural" ? "selected" : ""}
          onClick={() => setMode("architectural")}
        >
          Architectural
        </button>
        <button
          className={mode === "water" ? "selected" : ""}
          onClick={() => setMode("water")}
        >
          Water
        </button>
        <button
          className={mode === "macro" ? "selected" : ""}
          onClick={() => setMode("macro")}
        >
          Macro
        </button>
      </div>

      {/* Global Mood Orb */}
      <button
        type="button"
        className="global-mood-orb"
        aria-label={`Change visual mode. Current mode: ${mode}`}
        title={`Mode: ${mode}`}
        onClick={cycleMode}
      />

      {/* Weather Glyph */}
      {isHomePage && (
        <WeatherGlyph
          condition={weatherCondition}
          temperature={temperature}
          location={weatherLocation}
          timestamp={new Date().toISOString()}
          weatherMood={weatherMood}
          isNight={isNight}
          weatherDescription={weatherDescription}
        />
      )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <Calendar
              season={season}
              isNight={isNight}
              weatherCondition={weatherCondition}
              weatherMood={weatherMood}
              isHomePage={isHomePage}
            />
          }
        />
        <Route path="/dev/weather-glyph" element={<MockWeatherGlyph />} />
        <Route path="/day/:date" element={<DayPage />} />
      </Routes>
    </div>
  </>
);
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
