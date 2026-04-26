import { fetchFromApi } from "../api";

export async function getWeatherCondition(lat, lon) {
  try {
    const res = await fetchFromApi(`/api/weather?lat=${lat}&lon=${lon}`);

    if (!res.ok) {
      console.warn(`Weather API request failed with status ${res.status}.`);
      return "unknown";
    }

    const data = await res.json();

    if (!data || !data.weather || !Array.isArray(data.weather) || !data.weather[0]) {
      console.warn("Weather API returned unexpected data:", data);
      return "unknown";
    }

    return data.weather[0].main;
  } catch (err) {
    console.warn("Weather API error:", err);
    return "unknown";
  }
}
