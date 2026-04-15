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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling
app.use(errorHandler);

// Start server with database connection check
const dbHealthCheck = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connection established");
    return true;
  } catch (error) {
    console.error("⚠️ Database connection failed:", error.message);
    console.warn("\nℹ️ Running in OFFLINE MODE - Database required for full functionality");
    console.warn("\n📝 To fix:");
    console.warn("  1. Start PostgreSQL service");
    console.warn("  2. Create database: psql -U postgres");
    console.warn("     CREATE DATABASE unbeatable_games;");
    console.warn("     CREATE USER gameuser WITH PASSWORD 'gamepass123';");
    console.warn("     GRANT ALL PRIVILEGES ON DATABASE unbeatable_games TO gameuser;");
    console.warn("  3. Run migrations: npm run migrate");
    console.warn("  4. Restart backend\n");

    // In development, allow starting without DB for testing
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Starting in development mode without database...\n");
      return true;
    }
    return false;
  }
};

dbHealthCheck().then(connected => {
  if (!connected && process.env.NODE_ENV === "production") {
    console.error("❌ Cannot start production server without database connection");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🎮 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 CORS origin: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  });
});

export default app;
