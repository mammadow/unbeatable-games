import express from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/database.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Helper to calculate Elo-style rating change
function calculateRatingChange(won) {
  return won ? 32 : -16; // Simple rating system
}

// POST /api/games/record
router.post("/record", verifyToken, async (req, res) => {
  try {
    const { gameType, result, durationSeconds, userScore, aiScore } = req.body;
    const userId = req.user.id;

    // Validation
    if (!gameType || !result) {
      return res.status(400).json({ error: "Missing gameType or result" });
    }

    if (!["win", "loss", "draw"].includes(result)) {
      return res.status(400).json({ error: "Invalid result value" });
    }

    const validGames = ["tictactoe", "number-target", "connect-four"];
    if (!validGames.includes(gameType)) {
      return res.status(400).json({ error: "Invalid game type" });
    }

    const recordId = uuidv4();

    // Insert game record
    await pool.query(
      `INSERT INTO game_records (id, user_id, game_type, result, duration_seconds, user_score, ai_score)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [recordId, userId, gameType, result, durationSeconds || 0, userScore || 0, aiScore || 0]
    );

    // Update user stats
    if (result === "win") {
      await pool.query(
        "UPDATE users SET total_games = total_games + 1, wins = wins + 1, rating = rating + 32 WHERE id = $1",
        [userId]
      );
    } else if (result === "loss") {
      await pool.query(
        "UPDATE users SET total_games = total_games + 1, losses = losses + 1, rating = GREATEST(rating - 16, 0) WHERE id = $1",
        [userId]
      );
    } else {
      await pool.query(
        "UPDATE users SET total_games = total_games + 1, draws = draws + 1 WHERE id = $1",
        [userId]
      );
    }

    // Update leaderboard record
    const columnMap = {
      tictactoe: { rating: "tictactoe_rating", wins: "tictactoe_wins" },
      "number-target": { rating: "num_target_rating", wins: "num_target_wins" },
      "connect-four": { rating: "connectfour_rating", wins: "connectfour_wins" },
    };

    const columns = columnMap[gameType];
    if (columns && result === "win") {
      await pool.query(
        `UPDATE leaderboards
         SET ${columns.rating} = ${columns.rating} + 32,
             ${columns.wins} = ${columns.wins} + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1`,
        [userId]
      );
    } else if (columns) {
      await pool.query(
        `UPDATE leaderboards
         SET ${columns.rating} = GREATEST(${columns.rating} - 16, 0),
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1`,
        [userId]
      );
    }

    res.json({ message: "Game recorded successfully", recordId });
  } catch (error) {
    console.error("Game record error:", error);
    res.status(500).json({ error: "Failed to record game" });
  }
});

// GET /api/games/stats/:gameType
router.get("/stats/:gameType", verifyToken, async (req, res) => {
  try {
    const { gameType } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT game_type, result, COUNT(*) as count
       FROM game_records
       WHERE user_id = $1 AND game_type = $2
       GROUP BY game_type, result`,
      [userId, gameType]
    );

    const stats = { gameType, total: 0, wins: 0, losses: 0, draws: 0 };

    result.rows.forEach((row) => {
      stats.total += row.count;
      stats[row.result] = row.count;
    });

    stats.winRate = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(2) : 0;

    res.json(stats);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET /api/games/history
router.get("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit) || 50, 500); // Max 500

    const result = await pool.query(
      `SELECT id, game_type, result, duration_seconds, user_score, ai_score, created_at
       FROM game_records
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// GET /api/games/profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, username, email, total_games, wins, losses, draws, rating,
              created_at, last_login
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const winRate = user.total_games > 0 ? ((user.wins / user.total_games) * 100).toFixed(2) : 0;

    res.json({ ...user, winRate });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;
