import { SEASONAL_PALETTES } from "../data/moodBoardMap";

export default function SeasonalControls({ activePalette, onSelectPalette }) {
  return (
    <div className="seasonal-controls" role="group" aria-label="Seasonal colour controls">
      {SEASONAL_PALETTES.map((palette) => (
        <button
          key={palette.id}
          type="button"
          className={`seasonal-control-btn ${activePalette === palette.id ? "is-active" : ""}`}
          onClick={() => onSelectPalette(palette.id)}
        >
          {palette.label}
        </button>
      ))}
    </div>
  );
}
