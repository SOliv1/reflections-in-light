import { getDb } from "../db.js";
import { getAllGalleryItems } from "../models/Gallery.js";
import weatherToMood from "./weatherToMood.js";

export default async function fetchPhotosByWeather(weather) {
  const mood = weatherToMood[weather] || "natural";

  const db = getDb();
  const items = await getAllGalleryItems(db);

  const moodItems = items.filter(item => item.mood === mood);
  const sourceItems = moodItems.length > 0 ? moodItems : items;

  if (sourceItems.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * sourceItems.length);
  return sourceItems[randomIndex].photoUrl;
}
