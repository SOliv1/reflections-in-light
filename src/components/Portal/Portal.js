import "./Portal.css";

export function Portal({ dayIndex, season, mood, cueText }) {
  // 1. Build the base day class (1–7)
  const dayClass = dayIndex
    ? `portal--day-${dayIndex}`
    : "";

  // 2. Build the seasonal tint class
  const seasonClass = season
    ? `portal--season-${season}`
    : "";

  // 3. Build the mood override class
  const moodClass = mood
    ? `portal--mood-${mood}`
    : "";

  // 4. Pulse speed logic (optional, cinematic)
  const pulseClass =
    mood === "calm"
      ? "portal--pulse-slow"
      : mood === "reflective"
      ? "portal--pulse-medium"
      : "portal--pulse-fast";

  // 5. Combine all classes
  const classes = [
    "portal",
    dayClass,
    seasonClass,
    moodClass,
    pulseClass,
    "portal--glow"
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