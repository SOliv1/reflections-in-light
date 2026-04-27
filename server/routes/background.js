import express from "express";
import fetchPhotosByWeather from "../utils/fetchPhotosByWeather.js";


const router = express.Router();

router.get("/", async (req, res) => {
  const { weather } = req.query;
  const imageUrl = await fetchPhotosByWeather(weather);
  res.json({ imageUrl });
});

export default router;
