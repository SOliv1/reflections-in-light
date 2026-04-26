import { useState, useEffect } from "react";
import { getWeatherCondition } from "../utils/getWeatherCondition";
import { fetchFromApi } from "../api";

export default function useWeatherPhotos(enabled = true) {
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setBackgroundImage(null);
      return undefined;
    }

    async function fetchBackground() {
      async function loadBackgroundForWeather(weather) {
        const res = await fetchFromApi(
          `/api/background?weather=${encodeURIComponent(weather || "Clear")}`
        );

        if (!res.ok) {
          console.warn(`Background request failed with status ${res.status}.`);
          return;
        }

        const data = await res.json();
        setBackgroundImage(data.imageUrl || null);
      }

      async function loadFallbackBackground() {
        try {
          const res = await fetchFromApi("/api/weather");

          if (!res.ok) {
            console.warn(`Fallback weather request failed with status ${res.status}.`);
            return;
          }

          const data = await res.json();
          const weather =
            data.weather?.[0]?.description ||
            data.weather?.[0]?.main ||
            "Clear";

          await loadBackgroundForWeather(weather);
        } catch (err) {
          console.error("Weather background fallback error:", err);
        }
      }

      try {
        if (!navigator.geolocation) {
          await loadFallbackBackground();
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              const weather = await getWeatherCondition(lat, lon);
              await loadBackgroundForWeather(weather);
            } catch (err) {
              console.error("Weather background error:", err);
              await loadFallbackBackground();
            }
          },
          async (geoError) => {
            console.warn("Geolocation unavailable for weather background:", geoError);
            await loadFallbackBackground();
          },
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 300000,
          }
        );
      } catch (err) {
        console.error("Weather background error:", err);
        await loadFallbackBackground();
      }
    }

    fetchBackground();
  }, [enabled]);

  return backgroundImage;
}
