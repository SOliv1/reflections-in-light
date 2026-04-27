// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDb, getDbStatus } from "./db.js";
import { startPushScheduler } from "./services/pushScheduler.js";

// ------------------------------------------------------------
// Load environment variables FIRST
// ------------------------------------------------------------
dotenv.config();

// ------------------------------------------------------------
// Create Express app
// ------------------------------------------------------------
const app = express();

// ------------------------------------------------------------
// CORS CONFIG
// ------------------------------------------------------------
const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost",
  "http://localhost:3000",
  "https://reflections-in-light.onrender.com",
];

function isAllowedOrigin(origin) {
  if (!origin) return true;

  const allowedLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;
  if (allowedLocal.test(origin)) {
    return true;
  }

  if (allowedLocal.test(origin)) return true;

  if (configuredOrigins.includes(origin) || defaultOrigins.includes(origin)) {
    return true;
  }

  if (/^https:\/\/.+\.netlify\.app$/i.test(origin)) return true;
  if (/^https:\/\/.+\.onrender\.com$/i.test(origin)) return true;

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ------------------------------------------------------------
// ROUTE IMPORTS (must come BEFORE app.use())
// ------------------------------------------------------------
import galleryRoutes from "./routes/gallery.js";
import backgroundRoutes from "./routes/background.js";
import daysRoutes from "./routes/days.js";
import uploadRoute from "./routes/upload.js";
import weatherRoutes from "./routes/weather.js";
import randomImageRoute from "./routes/randomImage.js";
import pushRoutes from "./routes/push.js";

// ------------------------------------------------------------
// BASIC ROUTES
// ------------------------------------------------------------
app.get("/", (_req, res) => {
  res.send("API running");
});

app.get("/health", async (_req, res) => {
  try {
    await connectToDb();
  } catch (error) {
    const dbStatus = getDbStatus();
    return res.status(503).json({
      app: "ok",
      db: dbStatus.state,
      dbError: dbStatus.error || error.message,
      timestamp: new Date().toISOString(),
    });
  }

  const dbStatus = getDbStatus();
  return res.json({
    app: "ok",
    db: dbStatus.state,
    dbError: dbStatus.error,
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------
app.use("/api/gallery", galleryRoutes);
app.use("/api/background", backgroundRoutes);
app.use("/days", daysRoutes);
app.use("/upload", uploadRoute);
app.use("/api", weatherRoutes);
app.use("/random-image", randomImageRoute); // <-- Cloudinary randomizer
app.use("/api/push", pushRoutes);

// ------------------------------------------------------------
// START SERVER AFTER DB CONNECTS
// ------------------------------------------------------------
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  try {
    await connectToDb();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }

  startPushScheduler();
});
