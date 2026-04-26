// server/routes/randomImage.js
import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const folder = req.query.folder;

  if (!folder) {
    return res.status(400).json({ error: "Missing folder parameter" });
  }

  try {
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by("public_id", "desc")
      .max_results(200)
      .execute();

    if (!result.resources || result.resources.length === 0) {
      return res.status(404).json({ error: "No images found" });
    }

    const random =
      result.resources[Math.floor(Math.random() * result.resources.length)];

    const url = cloudinary.url(random.public_id, {
      secure: true,
      fetch_format: "auto",
      quality: "auto",
    });

    res.json({ url });
  } catch (err) {
    console.error("Cloudinary Search API error:", err);
    res.status(500).json({ error: "Cloudinary search failed" });
  }
});

export default router;
