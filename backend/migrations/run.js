import fs from "fs";
import path from "path";
import pool from "../config/database.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigrations = async () => {
  try {
    const migrationFile = path.join(__dirname, "001_initial.sql");
    const sql = fs.readFileSync(migrationFile, "utf-8");

    await pool.query(sql);
    console.log("✅ Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

runMigrations();
