import express from "express";
import { getDb } from "../db.js";
import {
  addPhotoToDay,
  deletePhotoFromDay,
  getAllDays,
  getDayByDate,
  setDayMood
} from "../models/Day.js";

const router = express.Router();

router.post("/add-photo", async (req, res) => {
  try {
    const { date, photoUrl } = req.body;

    if (!date || !photoUrl) {
      return res.status(400).json({ error: "Missing date or photoUrl" });
    }

    const db = getDb();
    await addPhotoToDay(db, date, photoUrl);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Day add-photo error:", error);
    return res.status(500).json({ error: "Failed to add photo to day" });
  }
});

router.post("/set-mood", async (req, res) => {
  try {
    const { date, mood } = req.body;

    if (!date || !mood) {
      return res.status(400).json({ error: "Missing date or mood" });
    }

    const db = getDb();
    await setDayMood(db, date, mood);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Day set-mood error:", error);
    return res.status(500).json({ error: "Failed to save mood" });
  }
});

router.get("/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const db = getDb();
    const day = await getDayByDate(db, date);

    if (!day) {
      return res.json({ date, photos: [], mood: null });
    }

    return res.json(day);
  } catch (error) {
    console.error("Day fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch day" });
  }
});

router.post("/delete-photo", async (req, res) => {
  try {
    const { date, photoUrl } = req.body;

    if (!date || !photoUrl) {
      return res.status(400).json({ error: "Missing date or photoUrl" });
    }

    const db = getDb();
    await deletePhotoFromDay(db, date, photoUrl);
    const updatedDay = await getDayByDate(db, date);

    return res.json({
      ok: true,
      day: updatedDay || { date, photos: [], mood: null }
    });
  } catch (error) {
    console.error("Day delete-photo error:", error);
    return res.status(500).json({ error: "Failed to delete photo from day" });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const days = await getAllDays(db);
    return res.json(days);
  } catch (error) {
    console.error("Days fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch days" });
  }
});

export default router;
