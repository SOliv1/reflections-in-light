import React from "react";

export default function BirthdayStageExperience({ lightingPresets, onSelectLighting }) {
  return (
    <section className="birthday-stage-card">
      <div className="birthday-stage-eyebrow">13 July</div>
      <h3 className="birthday-stage-title">Your Own Stage of Light</h3>
      <p className="birthday-stage-copy">
        Tonight the hush before the curtain belongs to you. This page is a small
        theatre in the cosmos: a place to practice your own light, to return to
        your voice, and to remember that the stage does not vanish just because it
        is quiet for a while.
      </p>
      <p className="birthday-stage-copy">
        May this year meet you gently, encourage you bravely, and remind you
        that your artistry is still alive, still luminous, still waiting to be
        called forward.
      </p>

      <div className="birthday-stage-directions">
        <h4>How to use your Stage of Light</h4>
        <p>
          Begin by choosing a lighting cue below. Let the colour of the page set
          the emotional temperature, as though you were stepping into rehearsal
          beneath a single waiting spotlight.
        </p>
        <p>
          Upload images whenever a moment, costume, expression, or fragment of
          atmosphere feels worth keeping. Think of this space as a private stage
          notebook made of light.
        </p>
        <p>
          Save a mood when you want to mark the feeling of the scene: tender,
          searching, brave, quiet, radiant. Come back whenever you need a place
          to practice presence, gather inspiration, or remember that your light
          does not need permission to shine.
        </p>
      </div>

      <div className="birthday-stage-lights">
        {lightingPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`birthday-light-chip birthday-light-${preset.id}`}
            onClick={() => onSelectLighting(preset.id)}
          >
            <span>{preset.label}</span>
            <small>{preset.description}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
