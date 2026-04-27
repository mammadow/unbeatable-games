CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rating INT DEFAULT 1000,
  total_games INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_rating ON users(rating DESC);

-- Game Records table
CREATE TABLE IF NOT EXISTS game_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_type VARCHAR(50) NOT NULL,
  result VARCHAR(20) NOT NULL,
  duration_seconds INT DEFAULT 0,
  ai_difficulty INT DEFAULT 1,
  user_score INT DEFAULT 0,
  ai_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for game_records
CREATE INDEX IF NOT EXISTS idx_game_records_user_game ON game_records(user_id, game_type);
CREATE INDEX IF NOT EXISTS idx_game_records_created ON game_records(created_at DESC);

-- Leaderboards table - ONE ROW PER USER
CREATE TABLE IF NOT EXISTS leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tictactoe_rating INT DEFAULT 1000,
  tictactoe_wins INT DEFAULT 0,
  num_target_rating INT DEFAULT 1000,
  num_target_wins INT DEFAULT 0,
  connectfour_rating INT DEFAULT 1000,
  connectfour_wins INT DEFAULT 0,
  memory_rating INT DEFAULT 1000,
  memory_wins INT DEFAULT 0,
  rps_rating INT DEFAULT 1000,
  rps_wins INT DEFAULT 0,
  reversi_rating INT DEFAULT 1000,
  reversi_wins INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add new game columns to existing tables (safe to run multiple times)
ALTER TABLE leaderboards ADD COLUMN IF NOT EXISTS memory_rating INT DEFAULT 1000;
ALTER TABLE leaderboards ADD COLUMN IF NOT EXISTS memory_wins INT DEFAULT 0;
ALTER TABLE leaderboards ADD COLUMN IF NOT EXISTS rps_rating INT DEFAULT 1000;
ALTER TABLE leaderboards ADD COLUMN IF NOT EXISTS rps_wins INT DEFAULT 0;
ALTER TABLE leaderboards ADD COLUMN IF NOT EXISTS reversi_rating INT DEFAULT 1000;
ALTER TABLE leaderboards ADD COLUMN IF NOT EXISTS reversi_wins INT DEFAULT 0;

-- Create indexes for leaderboards
CREATE INDEX IF NOT EXISTS idx_leaderboards_tictactoe ON leaderboards(tictactoe_rating DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_num_target ON leaderboards(num_target_rating DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_connectfour ON leaderboards(connectfour_rating DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_memory ON leaderboards(memory_rating DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_rps ON leaderboards(rps_rating DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_reversi ON leaderboards(reversi_rating DESC);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id),
  game_type VARCHAR(50),
  data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at DESC);
