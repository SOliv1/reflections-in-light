import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

import BackgroundCarousel from "../components/BackgroundCarousel";
import Calendar from "../components/Calendar";
import Constellation from "../components/Constellation";
import Portal from "../components/portal/Portal";
import WeatherGlyph from "../components/WeatherGlyphPanel";
import DailyQuote from "../components/DailyQuote";
import DrawerUnified from "./DrawerUnified/DrawerUnified";

import { fetchFromApi } from "../api";
import { BIRTHDAY_DAY, BIRTHDAY_MONTH } from "../data/birthdayExperience";
import useWeatherPhotos from "../hooks/useWeatherPhotos";

import MockWeatherGlyph from "../dev-only/MockWeatherGlyph";
import DayPage from "../pages/DayPage";

import springSeasonal from "../assets/logos/springSeasonalLogo.png";
import reflectionsMarkLogo from "../assets/logos/reflectionsMarkLogo.png";
import moodLogo from "../assets/logos/moodLogo.png";
import moodOrbBlue from "../assets/logos/moodOrbBlue.png";
import moodOrbPink from "../assets/logos/moodOrbPink.png";
import { getSeasonalLogo, activeTint } from "../logoSeasonal";
import {
  normalizeWeatherClass,
  normalizeWeatherEntry,
  formatLocationLabel
} from "../utils/weatherHelpers";

export default function AppShell({ testSeason, showTestLogo, showR }) {

  /* ---------------- MODE + UI STATE ---------------- */
  const modes = ["architectural", "water", "macro"];
  const [mode, setMode] = useState("architectural");
  const [photos, setPhotos] = useState([]);
  const [veilMode, setVeilMode] = useState("off");
  const [autoVeil, setAutoVeil] = useState(false);

  const veilOn = () => setVeilMode("on");
  const liftVeil = () => setVeilMode("lift");
  const veilOff = () => setVeilMode("off");


  const seasonalLogos = {
  spring: moodOrbPink,
  summer: moodOrbBlue,
  autumn: moodLogo,      // your main orb
  winter: springSeasonal,
 };


  const activeLogo = testSeason
    ? seasonalLogos[testSeason]
    : getSeasonalLogo();

  const activeTintOverride = testSeason
    ? seasonalLogos[testSeason]
    : activeTint;

  /* ---------------- ROUTER + BIRTHDAY ---------------- */
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const birthdayMatch = location.pathname.match(/^\/day\/(\d{4})-(\d{2})-(\d{2})$/);
  const isBirthdayScene = birthdayMatch
    ? Number(birthdayMatch[2]) === BIRTHDAY_MONTH &&
      Number(birthdayMatch[3]) === BIRTHDAY_DAY
    : false;

  /* ---------------- WEATHER + GALLERY ---------------- */
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState("Local weather");

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetchFromApi("/api/gallery");
        const data = await res.json();
        const urls = Array.isArray(data)
          ? data
              .map((item) => item?.photoUrl || item?.imageUrl || item?.url)
              .filter(Boolean)
          : [];
        setPhotos(urls);
      } catch {
        setPhotos([]);
      }
    }
    loadGallery();
  }, []);

  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetchFromApi("/api/weather");
        const data = await res.json();
        const primary = data.weather?.[0] || {};

        setTemperature(data.main?.temp || null);
        setWeatherDescription(primary.description || primary.main || "Unknown");
        setWeatherCondition(normalizeWeatherEntry(primary));
        setWeatherLocation(formatLocationLabel(data));
      } catch {
        setWeatherDescription("Unknown");
        setWeatherCondition(normalizeWeatherClass("unknown"));
        setWeatherLocation("Local weather");
      }
    }
    loadWeather();
  }, []);

  /* ---------------- SCROLL LISTENER ---------------- */
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

  /* ---------------- TIME + SEASON ---------------- */
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

  /* ---------------- DRAWERS ---------------- */
  const [drawerOpen, setDrawerOpen] = useState(false);

  /*---------------- ORB AUDIO ---------------- */

  useEffect(() => {
  const event = new CustomEvent("orb-ping");
  window.dispatchEvent(event);
  }, [testSeason]);




  /* ---------------- RENDER ---------------- */
  return (
    <>


      <div className="orb-base">
            {showR && (
        <img
          src={reflectionsMarkLogo}
          className="orb-mark behind"
          alt="Reflections logo"
          />
        )}

        <img
          src={showTestLogo ? activeLogo : activeTintOverride}
          className="orb-tint"
          alt=""
        />
      </div>

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
        {/* Orb Logo */}
        <Link to="/" className="app-home-logo" aria-label="Return home">
          <div className="orb-base">
              <img
                src={showTestLogo ? activeLogo : activeTintOverride}
                className="orb-tint" alt="Orb Tint"
              />
                {showR && (
              <img
                src={reflectionsMarkLogo}
                className="orb-mark"
                alt="Reflections logo"
              />
            )}
          </div>
        </Link>

        <Link to="/" className="app-home-logo">
          <div className="orb-base">
            <img
              src={showTestLogo ? activeLogo : activeTintOverride}
              className="orb-tint"
              alt=""
            />

            {showR && (
              <img
                src={reflectionsMarkLogo}
                className="orb-mark"
                alt="Reflections logo"
              />
            )}
          </div>
        </Link>


        {/* Background */}
        {isHomePage && (
          <BackgroundCarousel
            photos={photos}
            veilMode={veilMode}
            weatherImage={backgroundImage}
            weatherMood={weatherMood}
            season={season}
          />
        )}

        {/* Unified Drawer */}
        <DrawerUnified
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          season={season}
          mood={weatherMood}
        />

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

