import express from "express";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/database.js";
import { generateToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const id = uuidv4();

    // Create user
    const result = await pool.query(
      "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, username, email",
      [id, username, email, hashedPassword]
    );

    // Create leaderboard entry
    await pool.query(
      "INSERT INTO leaderboards (user_id) VALUES ($1)",
      [id]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.username);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const result = await pool.query(
      "SELECT id, username, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcryptjs.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Update last login
    await pool.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
      [user.id]
    );

    const token = generateToken(user.id, user.username);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/guest (anonymous login)
router.post("/guest", async (req, res) => {
  try {
    const id = uuidv4();
    // Use UUID for unique guest identifier to prevent collision
    const guestShortId = id.substring(0, 8);
    const guestUsername = `Guest_${guestShortId}`;
    const guestEmail = `guest_${id}@unbeatable.local`;

    // Insert user
    const userResult = await pool.query(
      "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, username, email",
      [id, guestUsername, guestEmail, "no_password"]
    );

    // Insert leaderboard entry
    await pool.query(
      "INSERT INTO leaderboards (user_id) VALUES ($1)",
      [id]
    );

    const user = userResult.rows[0];
    const token = generateToken(id, guestUsername);

    res.status(201).json({
      message: "Guest login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Guest login error:", error.message);

    // Check for unique constraint violation
    if (error.code === "23505") {
      return res.status(409).json({ error: "Guest user already exists" });
    }

    res.status(500).json({ error: "Guest login failed" });
  }
});

export default router;
