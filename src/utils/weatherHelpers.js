export function normalizeWeatherClass(condition = "unknown") {
  const value = String(condition).toLowerCase();
  if (value.includes("clear")) return "sunny";
  if (value.includes("cloud")) return "cloudy";
  if (value.includes("drizzle") || value.includes("rain")) return "rain";
  if (value.includes("snow")) return "snow";
  if (
    value.includes("mist") ||
    value.includes("fog") ||
    value.includes("haze") ||
    value.includes("smoke") ||
    value.includes("dust") ||
    value.includes("ash")
  ) return "mist";
  if (value.includes("thunder") || value.includes("storm")) return "storm";
  return "unknown";
}

export function normalizeWeatherEntry(weatherEntry = {}) {
  const main = String(weatherEntry.main || "");
  const description = String(weatherEntry.description || "");
  const icon = String(weatherEntry.icon || "");
  const combined = `${main} ${description}`.toLowerCase();
  const isDaytimeIcon = icon.endsWith("d");

  if (isDaytimeIcon && (
    combined.includes("few clouds") ||
    combined.includes("scattered clouds") ||
    combined.includes("broken clouds")
  )) return "sunny";

  if (icon.startsWith("01") || icon.startsWith("02")) return "sunny";
  if (icon.startsWith("03") || icon.startsWith("04")) return "cloudy";
  if (icon.startsWith("09") || icon.startsWith("10")) return "rain";
  if (icon.startsWith("11")) return "storm";
  if (icon.startsWith("13")) return "snow";
  if (icon.startsWith("50")) return "mist";

  return normalizeWeatherClass(combined || main);
}

export function formatLocationLabel(data) {
  const city = String(data?.name || "").trim();
  const country = String(data?.sys?.country || "").trim();
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  return "Local weather";
}
