import React, { useState, useEffect } from "react";
import "./MiniOrbMenu.css";

export default function MiniOrbMenu({
  testSeason,
  setTestSeason,
  showTestLogo,
  setShowTestLogo,
  showR,
  setShowR
}) {
  const [open, setOpen] = useState(false);
  const [radialOpen, setRadialOpen] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [starDensity, setStarDensity] = useState("normal"); // constellation density

  // 1. Seasonal tint colours
  const seasonTint = {
    spring: "rgba(255, 180, 220, 0.55)",
    summer: "rgba(140, 200, 255, 0.55)",
    autumn: "rgba(255, 180, 120, 0.55)",
    winter: "rgba(200, 220, 255, 0.55)"
  };

  // 4. Orb memory — restore last season on mount
  useEffect(() => {
    const saved = window.localStorage.getItem("miniOrbSeason");
    if (saved && ["spring", "summer", "autumn", "winter"].includes(saved)) {
      setTestSeason(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 4. Orb memory — persist when season changes
  useEffect(() => {
    if (testSeason) {
      window.localStorage.setItem("miniOrbSeason", testSeason);
    }
  }, [testSeason]);

  // 1. Sleep / wake logic (idle timer)
  useEffect(() => {
    let timer = setTimeout(() => setIsSleeping(true), 8000);
    const wake = () => {
      setIsSleeping(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIsSleeping(true), 8000);
    };

    window.addEventListener("mousemove", wake);
    window.addEventListener("mousedown", wake);
    window.addEventListener("touchstart", wake);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("mousedown", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, []);

  // 6. Heartbeat sync — listen for main-orb heartbeat events
  useEffect(() => {
    const handler = () => {
      const orb = document.querySelector(".mini-orb");
      if (!orb) return;
      orb.classList.add("heartbeat");
      setTimeout(() => orb.classList.remove("heartbeat"), 500);
    };

    window.addEventListener("main-orb-heartbeat", handler);
    return () => window.removeEventListener("main-orb-heartbeat", handler);
  }, []);

  // 2. Constellation density controls (simple toggle example)
  const cycleStarDensity = () => {
    setStarDensity(prev =>
      prev === "low" ? "normal" : prev === "normal" ? "high" : "low"
    );
  };

  // 3. Seasonal moon paths — just expose season to CSS
  const moonSeason = testSeason || "spring";

  // 5. Breathing animation — class when idle & closed
  const breathingClass = !open ? "breathing" : "";

  // Long‑press radial menu
  let pressTimer;
  const startPress = () => {
    pressTimer = setTimeout(() => setRadialOpen(true), 450);
  };
  const endPress = () => {
    clearTimeout(pressTimer);
  };

  // Cycle season
  const cycleSeason = () => {
    const order = ["spring", "summer", "autumn", "winter"];
    const next = order[(order.indexOf(testSeason) + 1) % order.length];
    setTestSeason(next);
  };

  return (
    <div
      className="mini-orb-wrapper"
      data-star-density={"normal"}
    >
      {/* Seasonal particle drift */}
      <div
        className="mini-orb-particles"
        style={{ "--orb-tint": seasonTint[testSeason] }}
      />

      {/* Orbiting moon (seasonal path via data attribute) */}
      <div
        className="mini-orb-moon"
        data-season={moonSeason}
        style={{ "--orb-tint": seasonTint[testSeason] }}
      />

      {/* Micro-weather */}
      <div
        className="mini-orb-weather"
        data-season={testSeason}
      />

      {/* Main mini orb */}
      <div
        className={`mini-orb ${open ? "open" : ""} ${breathingClass} ${
          isSleeping ? "sleep" : ""
        }`}
        style={{ "--orb-tint": seasonTint[testSeason] }}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onClick={() => {
          setOpen(!open);
          setRadialOpen(false);
          setIsSleeping(false);
        }}
      />

      {/* Long‑press radial menu */}
      {radialOpen && (
        <div className="radial-menu">
          <button onClick={cycleSeason}>Season</button>
          <button onClick={cycleStarDensity}>Stars</button>
          <button onClick={() => setShowTestLogo(!showTestLogo)}>Logo</button>
          <button onClick={() => setShowR(!showR)}>R</button>
        </div>
      )}

      {/* Drop‑down menu */}
      {open && (
        <div className="mini-orb-menu">
          <button onClick={cycleSeason}>
            Season: {testSeason || "auto"}
          </button>

          <button onClick={cycleStarDensity}>
            Stars: {starDensity}
          </button>

          <button onClick={() => setShowTestLogo(!showTestLogo)}>
            {showTestLogo ? "Hide Logo" : "Show Logo"}
          </button>

          <button onClick={() => setShowR(!showR)}>
            {showR ? "Hide R" : "Show R"}
          </button>
        </div>
      )}
    </div>
  );
}
