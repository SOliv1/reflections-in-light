import "./miniOrbMenu.css";
import SeasonalControls from "./SeasonalControls";

export default function MiniOrbMenu({
  isOpen,
  activePalette,
  onToggle,
  onSelectPalette
}) {
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
          <p className="mini-orb-copy">Choose the light that colours the clock, orb and weather stage.</p>
          <SeasonalControls
            activePalette={activePalette}
            onSelectPalette={onSelectPalette}
          />
        </div>
      ) : null}
    </div>
  );
}
