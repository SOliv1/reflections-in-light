// logoSeasonal.js
import springSeasonal from "./assets/logos/springSeasonalLogo.png";




// temporary fallbacks until other images exist
const summerSeasonal = springSeasonal;
const autumnSeasonal = springSeasonal;
const winterSeasonal = springSeasonal;

// 1. Detect season
export function getSeason() {
  const month = new Date().getMonth() + 1;

  if (month === 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "autumn";
}

// 2. Map seasons to local assets
const seasonalLogos = {
  spring: springSeasonal,
  summer: summerSeasonal,
  autumn: autumnSeasonal,
  winter: winterSeasonal,
};

// 3. Return the correct seasonal logo
export function getSeasonalLogo() {
  const season = getSeason();
  return seasonalLogos[season];
}

// 4. Optional: fallback to your classic Mood orb
export function getActiveLogo({ useSeasonal = true, fallbackLogo }) {
  if (!useSeasonal) return fallbackLogo;
  return getSeasonalLogo();
}

// 5. Tint logic (now correct)
export function getSeasonalTint() {
  const season = getSeason();
  return seasonalLogos[season];
}

export const activeTint = getSeasonalTint();
