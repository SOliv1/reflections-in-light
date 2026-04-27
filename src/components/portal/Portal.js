import "./Portal.css";
import { useEffect, useMemo, useState } from "react";

export function Portal({
  dayIndex,
  season,
  mood,
  type,
  onClick,
  macroMood,
  setMood,
  cueText,
  portalState,
  showClock = false
}) {
  const [showMoodMenu, setShowMoodMenu] = useState(false);
  const [isPinnedOpen, setPinnedOpen] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [clock, setClock] = useState(() => new Date());
  const resolvedMood = ["calm", "joyful", "stormy", "reflective", "natural"].includes(mood)
    ? mood
    : "natural";

  useEffect(() => {
    if (!showClock) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [showClock]);

  const dayClass = dayIndex ? `portal--day-${dayIndex}` : "";
  const seasonClass = season ? `portal--season-${season}` : "";
  const moodClass = mood ? `portal--mood-${mood}` : "";
  const hoverClass = document.body.classList.contains("portal-hovering")
    ? "portal--hover"
    : "";

  const pulseClass =
    mood === "calm"
      ? "portal--pulse-slow"
      : mood === "reflective"
      ? "portal--pulse-medium"
      : "portal--pulse-fast";

  const typeClass = type ? `portal--${type}` : "";
  const glowClass = type === "mood" ? "portal--glow" : "";
  const awareClass = portalState === "aware" ? "portal--aware" : "";
  const clockOpenClass = showClock && (isPinnedOpen || isHovered) ? "portal--clock-open" : "";
  const orbOpenClass = isPinnedOpen || isHovered ? "portal--orb-open" : "";
  const containerMoodClass = `portal-container--mood-${resolvedMood}`;
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

  const classes = [
    "portal",
    typeClass,
    dayClass,
    seasonClass,
    moodClass,
    pulseClass,
    glowClass,
    awareClass,
    hoverClass,
    macroMood,
    orbOpenClass,
    clockOpenClass
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`portal-container ${containerMoodClass}`}>

      {/* ⭐ EXISTING MOOD ORB — now interactive */}
      <button
        type="button"
        className={`mood-orb ${showMoodMenu ? "open" : ""}`}
        aria-expanded={showMoodMenu}
        aria-controls="mood-radial-menu"
        aria-label={showMoodMenu ? "Close mood menu" : "Open mood menu"}
        onClick={() => setShowMoodMenu(!showMoodMenu)}
      >
        <span className="mood-orb__label">Mood</span>
      </button>

      {/* ⭐ RADIAL MOOD MENU */}
      {showMoodMenu && (
        <div id="mood-radial-menu" className={`mood-radial-menu mood-radial-menu--${resolvedMood}`}>
          <div className="mood-radial-menu__title">Mood</div>
          <div className="mood-radial-menu__grid">
          {[
            ["calm", "Calm"],
            ["joyful", "Joyful"],
            ["stormy", "Stormy"],
            ["reflective", "Reflective"],
            ["natural", "Natural"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className="mood-option"
              onClick={() => {
                setMood(value);
                setShowMoodMenu(false);
              }}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="mood-reset"
            onClick={() => {
              setMood(null);
              setShowMoodMenu(false);
            }}
          >
            Reset
          </button>
          </div>
        </div>
      )}

      {/* ⭐ PORTAL CORE */}
      <div
        className={classes}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (showClock) {
            setPinnedOpen((open) => !open);
          }
          if (type === "mood" && setMood) {
            setMood(mood);
          }
          if (onClick) onClick();
        }}
      >
        <div className="portal__core">
          <div className="portal__crescent"></div>
          <div className="portal__shimmer"></div>
          {showClock ? (
            <div className="portal__clock">
              <span className="portal__clock-time">{currentTime}</span>
              <span className="portal__clock-date">{currentDate}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ⭐ CUE TEXT */}
      {cueText && (
        <div className="portal__cue">
          {cueText}
        </div>
      )}

      {/* ⭐ SUBTITLE */}
      {portalState === "aware" && (
        <div className="portal-subtitle">
          The Door begins the story
        </div>
      )}
    </div>
  );
}

export default Portal;
