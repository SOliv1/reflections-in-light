// logoSeasonal.js
// A soft, atmospheric seasonal logo selector for Reflections
import springSeasonal from "./assets/springSeasonal.png";

// temporary fallbacks until other images exist
const winterSeasonal = springSeasonal;
const summerSeasonal = springSeasonal;
const autumnSeasonal = springSeasonal;


// 1. Detect season
export function getSeason() {
  const month = new Date().getMonth() + 1;

  if (month === 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "autumn";
}

// 2. Map seasons to your Cloudinary assets
const seasonalLogos = {
  spring: "https://res.cloudinary.com/.../reflections_spring.png",
  summer: "https://res.cloudinary.com/.../reflections_summer.png",
  autumn: "https://res.cloudinary.com/.../reflections_autumn.png",
  winter: "https://res.cloudinary.com/.../reflections_winter.png",
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

export const activeTint = getSeasonalTint()
export function getSeasonalTint() {
  const month = new Date().getMonth() + 1;
  if (month <= 2 || month === 12) return winterSeasonal;
  if (month <= 5) return springSeasonal;
  if (month <= 8) return summerSeasonal;
  return autumnSeasonal;
}



