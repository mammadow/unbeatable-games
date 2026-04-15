import express from "express";
import pool from "../config/database.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Map gameType to safe column names (prevent SQL injection)
function getLeaderboardColumn(gameType) {
  const columnMap = {
    tictactoe: { rating: "tictactoe_rating", wins: "tictactoe_wins" },
    "number-target": { rating: "num_target_rating", wins: "num_target_wins" },
    "connect-four": { rating: "connectfour_rating", wins: "connectfour_wins" },
    "memory-match": { rating: "memory_rating", wins: "memory_wins" },
    rps: { rating: "rps_rating", wins: "rps_wins" },
    reversi: { rating: "reversi_rating", wins: "reversi_wins" },
  };
  return columnMap[gameType] || null;
}

// GET /api/leaderboard/global - MUST BE BEFORE /:gameType
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const result = await pool.query(
      `SELECT
        u.id,
        u.username,
        u.rating,
        u.total_games,
        u.wins,
        u.losses,
        u.draws,
        ROW_NUMBER() OVER (ORDER BY u.rating DESC) as rank
      FROM users u
      WHERE u.rating > 0
      ORDER BY u.rating DESC
      LIMIT $1`,
      [limit]
    );

    res.json({
      leaderboard: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Global leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch global leaderboard" });
  }
});

// GET /api/leaderboard/:gameType/rank/:userId - More specific route
router.get("/:gameType/rank", verifyToken, async (req, res) => {
  try {
    const { gameType } = req.params;
    const userId = req.user.id;

    const columns = getLeaderboardColumn(gameType);
    if (!columns) {
      return res.status(400).json({ error: "Invalid game type" });
    }

    const result = await pool.query(
      `SELECT
        u.id,
        u.username,
        l.${columns.rating} as rating,
        l.${columns.wins} as wins,
        (SELECT COUNT(*) FROM leaderboards l2
         WHERE l2.${columns.rating} > l.${columns.rating}) + 1 as rank
      FROM users u
      LEFT JOIN leaderboards l ON u.id = l.user_id
      WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("User rank error:", error);
    res.status(500).json({ error: "Failed to fetch user rank" });
  }
});

// GET /api/leaderboard/:gameType - Generic leaderboard for a game
router.get("/:gameType", async (req, res) => {
  try {
    const { gameType } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const columns = getLeaderboardColumn(gameType);
    if (!columns) {
      return res.status(400).json({ error: "Invalid game type" });
    }

    const result = await pool.query(
      `SELECT
        u.id,
        u.username,
        l.${columns.rating} as game_rating,
        l.${columns.wins} as wins,
        ROW_NUMBER() OVER (ORDER BY l.${columns.rating} DESC) as rank
      FROM users u
      LEFT JOIN leaderboards l ON u.id = l.user_id
      ORDER BY l.${columns.rating} DESC NULLS LAST
      LIMIT $1`,
      [limit]
    );

    res.json({
      gameType,
      leaderboard: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
