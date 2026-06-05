export const SEASONAL_PALETTES = [
  {
    id: "winter",
    label: "Winter Light",
    paletteClass: "weather-glyph-palette--winter",
    controlGradient:
      "linear-gradient(135deg, rgba(194, 226, 255, 0.42), rgba(102, 142, 224, 0.3)), rgba(255, 255, 255, 0.08)",
    weatherPanel: {
      ambientTint: "rgba(209, 224, 255, 0.36)",
      panelGlass: "rgba(242, 247, 255, 0.15)",
      panelStroke: "rgba(214, 228, 255, 0.3)"
    },
    portal: {
      rgb: "150, 185, 220",
      glowOuter: "rgba(150, 185, 220, 0.45)",
      glowInner: "rgba(150, 185, 220, 0.28)"
    }
  },
  {
    id: "spring",
    label: "Spring Glass",
    paletteClass: "weather-glyph-palette--spring",
    controlGradient:
      "linear-gradient(135deg, rgba(190, 238, 188, 0.4), rgba(107, 183, 116, 0.28)), rgba(255, 255, 255, 0.08)",
    weatherPanel: {
      ambientTint: "rgba(213, 239, 214, 0.3)",
      panelGlass: "rgba(243, 255, 245, 0.12)",
      panelStroke: "rgba(214, 242, 219, 0.26)"
    },
    portal: {
      rgb: "140, 190, 150",
      glowOuter: "rgba(140, 190, 150, 0.45)",
      glowInner: "rgba(140, 190, 150, 0.28)"
    }
  },
  {
    id: "summer",
    label: "Summer Gold",
    paletteClass: "weather-glyph-palette--summer",
    controlGradient:
      "linear-gradient(135deg, rgba(255, 226, 146, 0.44), rgba(255, 165, 78, 0.3)), rgba(255, 255, 255, 0.08)",
    weatherPanel: {
      ambientTint: "rgba(255, 223, 165, 0.38)",
      panelGlass: "rgba(255, 245, 222, 0.16)",
      panelStroke: "rgba(255, 226, 176, 0.3)"
    },
    portal: {
      rgb: "240, 185, 90",
      glowOuter: "rgba(240, 185, 90, 0.45)",
      glowInner: "rgba(240, 185, 90, 0.28)"
    }
  },
  {
    id: "autumn",
    label: "Autumn Ember",
    paletteClass: "weather-glyph-palette--autumn",
    controlGradient:
      "linear-gradient(135deg, rgba(255, 196, 149, 0.42), rgba(195, 102, 58, 0.3)), rgba(255, 255, 255, 0.08)",
    weatherPanel: {
      ambientTint: "rgba(232, 191, 161, 0.34)",
      panelGlass: "rgba(255, 239, 233, 0.14)",
      panelStroke: "rgba(240, 204, 186, 0.28)"
    },
    portal: {
      rgb: "205, 135, 75",
      glowOuter: "rgba(205, 135, 75, 0.45)",
      glowInner: "rgba(205, 135, 75, 0.28)"
    }
  }
];

export const SEASONAL_PALETTE_CLASS_MAP = Object.fromEntries(
  SEASONAL_PALETTES.map((palette) => [palette.id, palette.paletteClass])
);

export const CURATED_MOOD_SWATCHES = [
  {
    id: "calm",
    label: "Calm",
    swatchClass: "mood-swatch--calm",
    controlGradient:
      "linear-gradient(135deg, rgba(86, 163, 255, 0.4), rgba(57, 101, 186, 0.28)), rgba(255, 255, 255, 0.06)",
    accentGradient: "linear-gradient(135deg, #9fd0ff, #376dbf)"
  },
  {
    id: "joyful",
    label: "Joyful",
    swatchClass: "mood-swatch--joyful",
    controlGradient:
      "linear-gradient(135deg, rgba(255, 225, 111, 0.42), rgba(255, 148, 70, 0.3)), rgba(255, 255, 255, 0.06)",
    accentGradient: "linear-gradient(135deg, #ffe978, #ff9b3f)"
  },
  {
    id: "stormy",
    label: "Stormy",
    swatchClass: "mood-swatch--stormy",
    controlGradient:
      "linear-gradient(135deg, rgba(132, 144, 214, 0.42), rgba(55, 63, 121, 0.34)), rgba(255, 255, 255, 0.06)",
    accentGradient: "linear-gradient(135deg, #9fa8ff, #424a92)"
  },
  {
    id: "reflective",
    label: "Reflective",
    swatchClass: "mood-swatch--reflective",
    controlGradient:
      "linear-gradient(135deg, rgba(224, 229, 241, 0.36), rgba(148, 157, 189, 0.28)), rgba(255, 255, 255, 0.06)",
    accentGradient: "linear-gradient(135deg, #f0f4ff, #98a0c2)"
  },
  {
    id: "natural",
    label: "Natural",
    swatchClass: "mood-swatch--natural",
    controlGradient:
      "linear-gradient(135deg, rgba(141, 214, 159, 0.42), rgba(73, 147, 96, 0.3)), rgba(255, 255, 255, 0.06)",
    accentGradient: "linear-gradient(135deg, #b9f0b8, #4f9e61)"
  }
];

export const WEATHER_TO_MOOD_MAP = {
  Clear: "natural",
  "Few clouds": "calm",
  "Scattered clouds": "dreamy",
  "Broken clouds": "introspective",
  Overcast: "moody",
  Rain: "reflective",
  Drizzle: "reflective",
  Thunderstorm: "dramatic",
  Snow: "serene",
  Mist: "ethereal",
  Fog: "ethereal",
  Haze: "ethereal",
  Smoke: "ethereal",
  Dust: "ethereal",
  Sand: "ethereal",
  Ash: "ethereal",
  Squall: "dramatic",
  Tornado: "dramatic",
  Sunrise: "glowing",
  Sunset: "glowing"
};

export const WEATHER_TO_MOOD_ENTRIES = Object.entries(WEATHER_TO_MOOD_MAP).map(
  ([weather, mood]) => ({
    weather,
    mood
  })
);
