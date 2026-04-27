import { useEffect, useState } from "react";
import "./miniOrbMenu.css";
import SeasonalControls from "./SeasonalControls";

export default function MiniOrbMenu({
  isOpen,
  activePalette,
  activeLogo,
  activeMood,
  onToggle,
  onSelectPalette,
  onSelectLogo,
  onSelectMood
}) {
  const [activeSection, setActiveSection] = useState("colors");
  const [isCompactScreen, setIsCompactScreen] = useState(false);
  const sectionMeta = {
    colors: {
      label: "Palette",
      copy: "Set the seasonal atmosphere for the portal stage.",
    },
    mood: {
      label: "Mood",
      copy: "Pick a softer emotional tone for the orb and glyph.",
    },
    logo: {
      label: "Logos",
      copy: "Choose the mark that appears across the app shell.",
    },
  };
  const logoOptions = [
    { id: "moodTwo", label: "Mood Mark I" },
    { id: "mood", label: "Mood Mark II" },
    { id: "reflectionsMark", label: "R Mark I" },
    { id: "reflectionsMarkAlt", label: "R Mark II" },
    { id: "reflectionsScreen", label: "Screen Mark" },
    { id: "springSeasonal", label: "Spring Mark" },
    { id: "pearl", label: "Pearl Mark" },
    { id: "off", label: "No Logo" }
  ];
  const moodOptions = [
    { id: "calm", label: "Calm", swatchClass: "mood-swatch--calm" },
    { id: "joyful", label: "Joyful", swatchClass: "mood-swatch--joyful" },
    { id: "stormy", label: "Stormy", swatchClass: "mood-swatch--stormy" },
    { id: "reflective", label: "Reflective", swatchClass: "mood-swatch--reflective" },
    { id: "natural", label: "Natural", swatchClass: "mood-swatch--natural" }
  ];

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const query = window.matchMedia("(max-width: 768px), (max-height: 760px)");
    const updateCompactState = (event) => {
      setIsCompactScreen(event.matches);
    };

    setIsCompactScreen(query.matches);
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", updateCompactState);
      return () => query.removeEventListener("change", updateCompactState);
    }

    query.addListener(updateCompactState);
    return () => query.removeListener(updateCompactState);
  }, []);

  useEffect(() => {
    if (!isOpen || !isCompactScreen) {
      return;
    }

    setActiveSection((current) => (current === "colors" ? "logo" : current));
  }, [isOpen, isCompactScreen]);

  return (
    <div
      className={`mini-orb-menu palette-${activePalette} mood-${activeMood || "natural"} ${
        isOpen ? "is-open" : ""
      }`}
    >
      <button
        type="button"
        className="mini-orb-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="seasonal-mini-orb-panel"
        aria-label="Open seasonal colour controls"
      >
        <span className="mini-orb-core" />
      </button>

      {isOpen ? (
        <div id="seasonal-mini-orb-panel" className="mini-orb-panel">
          <div className="mini-orb-panel-handle" aria-hidden="true" />
          <p className="mini-orb-title">Seasonal colours</p>
          <p className="mini-orb-copy">Choose the light for the portal stage, then pick the logo manually.</p>
          <div className="mini-orb-tabs" role="group" aria-label="Seasonal menu sections">
            <button
              type="button"
              aria-pressed={activeSection === "colors"}
              className={`mini-orb-tab ${activeSection === "colors" ? "is-active" : ""}`}
              onClick={() => setActiveSection("colors")}
            >
              Colours
            </button>
            <button
              type="button"
              aria-pressed={activeSection === "mood"}
              className={`mini-orb-tab ${activeSection === "mood" ? "is-active" : ""}`}
              onClick={() => setActiveSection("mood")}
            >
              Mood
            </button>
            <button
              type="button"
              aria-pressed={activeSection === "logo"}
              className={`mini-orb-tab ${activeSection === "logo" ? "is-active" : ""}`}
              onClick={() => setActiveSection("logo")}
            >
              Logos
            </button>
          </div>
          <div className="mini-orb-section-meta" aria-live="polite">
            <span className="mini-orb-section-chip">{sectionMeta[activeSection].label}</span>
            <p className="mini-orb-section-hint">{sectionMeta[activeSection].copy}</p>
          </div>
          <div className="mini-orb-scroll-area">
            {activeSection === "colors" ? (
              <div className="mini-orb-section mini-orb-section--active">
                <SeasonalControls
                  activePalette={activePalette}
                  onSelectPalette={onSelectPalette}
                />
              </div>
            ) : null}

            {activeSection === "mood" ? (
              <div className="mini-orb-section mini-orb-section--active">
                <div className="mini-orb-mood-grid">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.id}
                      type="button"
                      className={`mini-orb-mood-btn ${mood.swatchClass} ${activeMood === mood.id ? "is-active" : ""}`}
                      onClick={() => onSelectMood?.(mood.id)}
                    >
                      <span className="mini-orb-mood-dot" aria-hidden="true" />
                      <span>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {activeSection === "logo" ? (
              <div className="mini-orb-section mini-orb-section--active">
                <div className="mini-orb-logo-grid">
                  {logoOptions.map((logo) => (
                    <button
                      key={logo.id}
                      type="button"
                      className={`mini-orb-logo-btn ${activeLogo === logo.id ? "is-active" : ""}`}
                      onClick={() => onSelectLogo(logo.id)}
                    >
                      {logo.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
