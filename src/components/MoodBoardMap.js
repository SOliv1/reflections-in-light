import {
  CURATED_MOOD_SWATCHES,
  SEASONAL_PALETTES,
  WEATHER_TO_MOOD_ENTRIES
} from "../data/moodBoardMap";

export default function MoodBoardMap() {
  return (
    <div className="mini-orb-map-section">
      <p className="mini-orb-subtitle">Mood board map</p>
      <p className="mini-orb-map-copy">
        A single reference for seasonal light, curated mood colours, and the live weather engine.
      </p>

      <div className="mini-orb-season-map">
        {SEASONAL_PALETTES.map((palette) => (
          <article key={palette.id} className="mood-board-card">
            <div className="mood-board-card-header">
              <span>{palette.label}</span>
              <span className="mood-board-card-key">{palette.id}</span>
            </div>
            <div className="mood-board-chip-grid">
              <span
                className="mood-board-chip"
                style={{ background: palette.controlGradient }}
              >
                control
              </span>
              <span
                className="mood-board-chip"
                style={{
                  background: `linear-gradient(135deg, ${palette.weatherPanel.ambientTint}, ${palette.weatherPanel.panelGlass})`,
                  borderColor: palette.weatherPanel.panelStroke
                }}
              >
                panel
              </span>
              <span
                className="mood-board-chip"
                style={{
                  background: `linear-gradient(135deg, ${palette.portal.glowOuter}, ${palette.portal.glowInner})`
                }}
              >
                portal
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mini-orb-map-block">
        <p className="mini-orb-subtitle">Curated mood colours</p>
        <div className="mood-board-chip-grid mood-board-chip-grid--moods">
          {CURATED_MOOD_SWATCHES.map((mood) => (
            <span
              key={mood.id}
              className="mood-board-chip mood-board-chip--mood"
              style={{ background: mood.controlGradient }}
            >
              <span
                className="mood-board-chip-dot"
                aria-hidden="true"
                style={{ background: mood.accentGradient }}
              />
              <span>{mood.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mini-orb-map-block">
        <p className="mini-orb-subtitle">Weather to mood engine</p>
        <div className="mood-board-engine-list">
          {WEATHER_TO_MOOD_ENTRIES.map(({ weather, mood }) => (
            <div key={weather} className="mood-board-engine-row">
              <span className="mood-board-engine-weather">{weather}</span>
              <span className="mood-board-engine-arrow">→</span>
              <span className="mood-board-engine-mood">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
