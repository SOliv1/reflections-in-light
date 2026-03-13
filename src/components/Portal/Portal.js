import "./Portal.css";

export function Portal({ dayIndex, season, mood, cueText, type }) {
  // 1. Build the base day class (1–7)
  const dayClass = dayIndex ? `portal--day-${dayIndex}` : "";

  // 2. Build the seasonal tint class
  const seasonClass = season ? `portal--season-${season}` : "";

  // 3. Build the mood override class
  const moodClass = mood ? `portal--mood-${mood}` : "";

  // 4. Pulse speed logic
  const pulseClass =
    mood === "calm"
      ? "portal--pulse-slow"
      : mood === "reflective"
      ? "portal--pulse-medium"
      : "portal--pulse-fast";

  // 4b. Portal type (mood or seasonal)
  const typeClass = type ? `portal--${type}` : "";

  // 4c. Glow only for mood portal
  const glowClass = type === "mood" ? "portal--glow" : "";

  // 5. Combine all classes
  const classes = [
    "portal",
    typeClass,
    dayClass,
    seasonClass,
    moodClass,
    pulseClass,
    glowClass
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="portal__core">
        <div className="portal__crescent"></div>
        <div className="portal__shimmer"></div>
      </div>

      {cueText && (
        <div className="portal__cue">
          {cueText}
        </div>
      )}
    </div>
  );
}

export default Portal;
