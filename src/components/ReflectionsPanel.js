export default function ReflectionsPanel({ weatherMood, season }) {
  const reflections = {
    clear: "In the clarity of today’s light, notice one small thing that feels true.",
    rain: "Let the soft rhythm of the rain remind you that renewal often begins quietly.",
    snow: "In the hush of snowfall, allow yourself a moment of stillness.",
    storm: "Even in unsettled skies, there is a centre within you that remains calm.",
    clouds: "Clouds drift, moods shift — nothing stays fixed, and that is a gentle mercy.",
  };

  const seasonalNotes = {
    spring: "Spring invites you to soften, to open, to begin again.",
    summer: "Summer asks you to expand, to breathe deeply, to glow.",
    autumn: "Autumn reminds you to release what has grown heavy.",
    winter: "Winter offers rest, reflection, and quiet restoration.",
  };

  const moodText = reflections[weatherMood] || reflections.clear;
  const seasonText = seasonalNotes[season] || "";

  return (
    <div className="reflections-panel">
      <p className="reflection-line">{moodText}</p>
      <p className="reflection-season">{seasonText}</p>
    </div>
  );
}
