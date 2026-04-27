import express from "express";

const router = express.Router();

router.get("/weather", async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.error("Missing OPENWEATHER_API_KEY environment variable");
      return res.status(500).json({
        error: "Missing OPENWEATHER_API_KEY environment variable on server",
        coord: { lat: 52.09, lon: -1.95 },
        weather: [{ main: "Unknown", description: "API key not configured" }]
      });
    }

    const lat = req.query.lat || 52.09;   // Evesham latitude (fallback)
    const lon = req.query.lon || -1.95;   // Evesham longitude (fallback)

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`OpenWeather API error: ${response.status} ${response.statusText}`);
      const errorData = await response.json();
      return res.status(response.status).json({
        error: `OpenWeather API error: ${errorData.message || response.statusText}`,
        weather: [{ main: "Unknown", description: "Weather service error" }]
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Weather API error:", err.message);
    res.status(500).json({
      error: `Failed to fetch weather: ${err.message}`,
      weather: [{ main: "Unknown", description: err.message }]
    });
  }
});

export default router;