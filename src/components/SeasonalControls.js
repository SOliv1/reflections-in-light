const PALETTES = [
  { id: "winter", label: "Winter Light" },
  { id: "spring", label: "Spring Glass" },
  { id: "summer", label: "Summer Gold" },
  { id: "autumn", label: "Autumn Ember" }
];

export default function SeasonalControls({ activePalette, onSelectPalette }) {
  return (
    <div className="seasonal-controls" role="group" aria-label="Seasonal colour controls">
      {PALETTES.map((palette) => (
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
