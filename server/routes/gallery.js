import express from "express";
import {
  deleteGalleryItemByPhotoUrl,
  getAllGalleryItems
} from "../models/Gallery.js";
import { getDb } from "../db.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const items = await getAllGalleryItems(db);
    const { season, mood } = req.query;

    const filteredItems = items.filter((item) => {
      // Backward compatibility: older uploads may not have a season stored yet.
      const matchesSeason = season ? item.season === season || !item.season : true;
      const matchesMood = mood ? item.mood === mood : true;
      return matchesSeason && matchesMood;
    });

    res.json(filteredItems);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.status(500).json({ error: "Failed to fetch gallery items" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ error: "photoUrl is required" });
    }

    const db = getDb();
    const result = await deleteGalleryItemByPhotoUrl(db, photoUrl);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Photo not found" });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

export default router;
