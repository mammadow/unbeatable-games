import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database.js";
import authRoutes from "./routes/auth.js";
import gameRoutes from "./routes/games.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Health check with database connection test
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as timestamp");
    res.json({
      status: "OK",
      timestamp: result.rows[0].timestamp,
      database: "connected",
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server with database connection check
const dbHealthCheck = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection established");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

dbHealthCheck().then(connected => {
  if (!connected) {
    console.error("Cannot start server without database connection");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🎮 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  });
});

export default app;
