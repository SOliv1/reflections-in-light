import "./miniOrbMenu.css";
import MoodBoardMap from "./MoodBoardMap";
import SeasonalControls from "./SeasonalControls";
import { CURATED_MOOD_SWATCHES } from "../data/moodBoardMap";

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
  const logoOptions = [
    { id: "mood", label: "Mood Logo" },
    { id: "moodTwo", label: "Mood Logo II" },
    { id: "reflectionsMark", label: "R Logo" },
    { id: "reflectionsMarkAlt", label: "R Mark II" },
    { id: "reflectionsScreen", label: "Screen Mark" },
    { id: "springSeasonal", label: "Spring Logo" },
    { id: "pearl", label: "Pearl Logo" },
    { id: "off", label: "Logo Off" }
  ];
  return (
    <div className={`mini-orb-menu ${isOpen ? "is-open" : ""}`}>
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
          <p className="mini-orb-title">Seasonal colours</p>
          <p className="mini-orb-copy">Choose the light for the portal stage, then pick the logo manually.</p>
          <SeasonalControls
            activePalette={activePalette}
            onSelectPalette={onSelectPalette}
          />
          <div className="mini-orb-mood-section">
            <p className="mini-orb-subtitle">Mood colours</p>
            <div className="mini-orb-mood-grid">
              {CURATED_MOOD_SWATCHES.map((mood) => (
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
          <MoodBoardMap />
          <div className="mini-orb-logo-section">
            <p className="mini-orb-subtitle">Logo choice</p>
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
        </div>
      ) : null}
    </div>
  );
}
