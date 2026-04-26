import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";
import dayRoutes from "./routes/days.js";
import { connectToMongo, getDbStatus } from "./db.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "https://reflections-in-light.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API running");
});

app.get("/health", async (_req, res) => {
  try {
    await connectToMongo();
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
  res.json({
    app: "ok",
    db: dbStatus.state,
    dbError: dbStatus.error,
    timestamp: new Date().toISOString(),
  });
});

app.use("/upload", uploadRoutes);
app.use("/days", dayRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);

  try {
    await connectToMongo();
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
});
