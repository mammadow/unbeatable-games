<div align="center">

# ⚡ Unbeatable Games Platform

### *AI-powered mini-games you cannot beat*

[![Build](https://img.shields.io/github/actions/workflow/status/mammadow/unbeatable-games/test-and-deploy.yml?branch=master&style=for-the-badge&label=CI)](https://github.com/mammadow/unbeatable-games/actions)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

<br />

**🎯 Perfect AI** · **⚡ Instant Response** · **🏆 Leaderboards** · **💾 Save Stats**

<br />

[Quick Start](#-quick-start) · [Games](#-games) · [API](#-api-endpoints) · [Deploy](#-deployment)

---

</div>

## 🎮 Games

| Game | Algorithm | Difficulty |
|------|-----------|------------|
| **Tic Tac Toe** | Minimax + Alpha-Beta Pruning | Perfect — Unbeatable |
| **Number Target** | Game Theory (Nim) | Perfect — Unbeatable |
| **Connect Four** | Minimax Depth-6 | Very Hard |
| **Memory Match** | Perfect Photographic Memory | Unbeatable |
| **Rock Paper Scissors** | Pattern Detection | Adaptive |
| **Reversi** | Minimax + Positional Weights | Very Hard |

## ✨ Features

- 6 AI-powered games with distinct algorithms
- JWT authentication — Email/Password & Guest login
- Auto-save game results to database
- Personal stats, game history, and win rates
- Global & per-game leaderboards with rankings
- Casino-style dark UI with neon animations
- CI/CD via GitHub Actions → Vercel + Railway

## 🚀 Quick Start

### Requirements
- Node.js 20+
- PostgreSQL 14+

### 1. Clone
```bash
git clone https://github.com/mammadow/unbeatable-games.git
cd unbeatable-games
```

### 2. Setup Database
```bash
psql -U postgres
CREATE DATABASE unbeatable_games;
CREATE USER gameuser WITH PASSWORD 'gamepass123';
GRANT ALL PRIVILEGES ON DATABASE unbeatable_games TO gameuser;
```

### 3. Backend
```bash
cd backend
cp .env.example .env   # edit DATABASE_URL, JWT_SECRET
npm install
npm run migrate
npm run dev            # http://localhost:5000
```

### 4. Frontend
```bash
cd frontend
cp .env.example .env.local   # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                  # http://localhost:5173
```

## 🏗️ Project Structure

```
unbeatable-games/
├── frontend/
│   ├── src/
│   │   ├── games/          # TicTacToe, NumberTarget, ConnectFour,
│   │   │                   # MemoryMatch, RockPaperScissors, Reversi
│   │   ├── screens/        # AuthScreen
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── api/            # API client with retry logic
│   │   └── App.jsx
│   └── vite.config.js
│
└── backend/
    ├── routes/             # auth, games, leaderboard
    ├── middleware/         # JWT auth, error handler
    ├── config/             # PostgreSQL pool
    ├── migrations/         # SQL schema
    └── server.js
```

## 🔌 API Endpoints

```
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/guest

POST  /api/games/record
GET   /api/games/stats/:gameType
GET   /api/games/history
GET   /api/games/profile

GET   /api/leaderboard
GET   /api/leaderboard/:gameType
GET   /api/leaderboard/:gameType/rank

GET   /health
```

## 🧠 AI Algorithms

### Tic Tac Toe — Minimax + Alpha-Beta
Full game tree search with pruning. Explores every possible outcome and always picks the optimal move. Never loses.

### Number Target — Nim Game Theory
Forces the opponent into losing positions using `(100 - current) % 11 === 0`. One mathematical formula, zero chance of winning.

### Connect Four — Minimax Depth-6
Looks 6 moves ahead with heuristic board evaluation and center-column move ordering. Extremely hard to beat.

### Memory Match — Perfect Memory
Records every card seen by either player. Always picks a known matching pair when available, never forgets.

### Rock Paper Scissors — Pattern Detection
Tracks move frequency over the full game and recent history. Counters your most-used move after round 3.

### Reversi — Minimax + Positional Weights
Depth-4 minimax on a 6×6 board with a positional weight table that values corners (100pts) and punishes edge traps.

## 📊 Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Accounts, ratings, win/loss/draw totals |
| `game_records` | Individual game results with scores & duration |
| `leaderboards` | One row per user, ratings for all 6 games |
| `analytics` | Optional event tracking |

## 🔐 Security

- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens with 30-day expiry
- Parameterized queries (no SQL injection)
- CORS restricted to configured frontend URL
- Input validation on all endpoints

## 📈 Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Frontend bundle | < 100 KB gzipped | ~55 KB |
| API response | < 100 ms | ~50 ms |
| AI response | < 500 ms | 300–450 ms |
| Load time | < 2 s | < 2 s |

## 🚢 Deployment

**Frontend → Vercel**
```bash
# Set in Vercel dashboard:
VITE_API_URL=https://your-backend.railway.app/api
```

**Backend → Railway**
```bash
# Set in Railway dashboard:
DATABASE_URL=postgresql://...   # linked automatically from Postgres service
JWT_SECRET=<32+ char secret>
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

**Start command (Railway):**
```
npm run migrate && npm start
```

GitHub Actions automatically deploys on every push to `master` when `VERCEL_TOKEN` and `RAILWAY_TOKEN` secrets are configured.

## 📋 Software Requirements

### Functional Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| FR1 | User registration & login | ✅ |
| FR2 | Guest login (no account needed) | ✅ |
| FR3 | Tic Tac Toe vs Minimax AI | ✅ |
| FR4 | Number Target vs Nim AI | ✅ |
| FR5 | Connect Four vs Minimax AI | ✅ |
| FR6 | Memory Match vs perfect memory AI | ✅ |
| FR7 | Rock Paper Scissors vs pattern AI | ✅ |
| FR8 | Reversi vs positional AI | ✅ |
| FR9 | Auto-save game results | ✅ |
| FR10 | Personal stats & game history | ✅ |
| FR11 | Global & per-game leaderboards | ✅ |
| FR12 | JWT persistence across sessions | ✅ |

### Non-Functional Requirements

| ID | Requirement | Target | Status |
|----|-------------|--------|--------|
| NFR1 | API response time | < 100 ms | ✅ ~50 ms |
| NFR2 | AI response time | < 500 ms | ✅ 300–450 ms |
| NFR3 | Bundle size | < 100 KB gzipped | ✅ ~55 KB |
| NFR4 | Retry logic | 3 attempts + backoff | ✅ |
| NFR5 | Token expiry | 30 days | ✅ |
| NFR6 | Password hashing | bcryptjs 10 rounds | ✅ |
| NFR7 | SQL injection prevention | Parameterized queries | ✅ |
| NFR8 | CORS protection | Origin-based | ✅ |

---

**⚡ Six games. Six algorithms. Zero chance of winning.**
