<div align="center">

# ⚡ Unbeatable Games Platform

### *AI-powered mini-games you cannot beat*

[![Build](https://img.shields.io/github/actions/workflow/status/mammadow/unbeatable-games/test-and-deploy.yml?branch=master&style=for-the-badge&label=CI)](https://github.com/mammadow/unbeatable-games/actions)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

<br />

**🎯 Perfect AI** · **⚡ Instant Response** · **🏆 Leaderboards** · **💾 Save Stats** · **📖 Interactive Tutorials**

<br />

[Quick Start](#-quick-start) · [Games](#-games) · [API](#-api-endpoints) · [SRS](#-software-requirements-specification) · [Deploy](#-deployment)

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
- Interactive tutorials with step-by-step guided walkthroughs for each game
- In-game tips panel with rules, strategy hints, and AI algorithm explanations
- JWT authentication — Email/Password & Guest login
- Auto-save game results to database
- Personal stats, game history, and win rates
- Global & per-game leaderboards with rankings
- Redesigned split-layout auth screen with password strength indicator
- Enhanced homepage with hero section, feature cards, and how-it-works guide
- Casino-style dark UI with neon animations and glassmorphism effects
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
│   │   ├── screens/        # AuthScreen (split-layout login/register)
│   │   ├── context/        # AuthContext (JWT state)
│   │   ├── components/     # GameTips, TutorialOverlay
│   │   ├── hooks/          # useTutorial (tutorial state machine)
│   │   ├── data/           # gameTipsData, tutorialScripts
│   │   ├── api/            # API client with retry logic
│   │   └── App.jsx         # Game hub with hero, features, how-it-works
│   └── vite.config.js
│
├── backend/
│   ├── routes/             # auth, games, leaderboard
│   ├── middleware/         # JWT auth, error handler
│   ├── config/             # PostgreSQL pool
│   ├── migrations/         # SQL schema
│   └── server.js
│
├── docs/                   # Capstone context and assignment document
└── .github/workflows/      # CI build, health check, and deployment workflow
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

## 📖 Interactive Tutorials

Each game includes a guided tutorial mode accessible via a "Tutorial" button:

- **Step-by-step walkthrough** with highlighted moves and explanations of optimal strategy
- **Scripted AI responses** so the tutorial progresses predictably
- **Pulsing gold highlights** show exactly which move to make
- **Non-target elements are dimmed** to focus attention on the correct action
- **Step counter** tracks progress through each tutorial
- **Game state resets** cleanly when entering or exiting tutorial mode
- **No stats saved** during tutorials to keep your record clean

| Game | Tutorial Focus |
|------|----------------|
| Tic Tac Toe | Center control, corner strategy, fork creation |
| Number Target | Multiples-of-11 pattern, response formula (11 - X) |
| Connect Four | Center column dominance, horizontal line building |
| Memory Match | Exploration phase, memory recall, matching known pairs |
| Rock Paper Scissors | Move variation, pattern avoidance, AI adaptation |
| Reversi | Center control, territory expansion, outflanking |

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
| Frontend bundle | < 100 KB gzipped | ~63 KB |
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

## 📋 Software Requirements Specification

### 1. Introduction

#### 1.1 Purpose
This Software Requirements Specification (SRS) defines the required behavior, interfaces, data, constraints, and quality attributes for the **Unbeatable Games Platform**. The document is intended for the capstone team, instructor/evaluator, future maintainers, and anyone deploying or testing the application.

#### 1.2 Project Scope
The system is a full-stack web platform where authenticated or guest users play six strategic mini-games against AI opponents. The frontend provides the game hub, gameplay screens, interactive tutorials, in-game tips with algorithm explanations, authentication screens, animations, and API communication. The backend provides authentication, JWT-protected game result recording, profile statistics, leaderboards, database access, health checks, and production deployment readiness.

#### 1.3 Product Objectives
- Demonstrate practical use of algorithms and data structures through playable games.
- Provide AI opponents that are optimal, near-optimal, or adaptive depending on the game.
- Offer interactive tutorials that teach players the strategy and logic behind each game.
- Expose AI algorithm details through in-game tips panels for educational transparency.
- Persist user identities, scores, game history, ratings, and leaderboard rankings.
- Support local development and production deployment with clear environment configuration.
- Present the project as a complete capstone artifact with source code, documentation, CI, and deployment configuration.

#### 1.4 Capstone Requirement Alignment
The included capstone assignment requires a real software prototype with clear algorithmic depth, justified data structures, testing, performance analysis, and a structured final presentation/report. This project aligns with the approved **Game AI** topic category by using minimax, alpha-beta pruning, heuristic evaluation, game-tree search, board matrices, arrays, maps, sets, indexed database tables, and ranked leaderboard queries.

| Assignment Requirement | Platform Coverage |
|------------------------|-------------------|
| Algorithmic depth | Minimax, alpha-beta pruning, Nim-style target strategy, pattern detection, heuristic evaluation |
| Data-structure selection | Arrays and matrices for game states, maps/sets for memory tracking, PostgreSQL tables/indexes for persistence |
| Working prototype | Six playable browser games with interactive tutorials plus backend persistence and authentication |
| Testing | Frontend build checks, backend syntax checks, database health checks, migration checks |
| Performance analysis | README documents expected API, AI, bundle, and load-time targets |
| Presentation/report readiness | README contains project overview, algorithms, architecture, deployment, and full SRS |

#### 1.5 Definitions
| Term | Meaning |
|------|---------|
| AI | Computer-controlled opponent implemented in the frontend game logic |
| JWT | JSON Web Token used for authenticated API requests |
| Elo-style rating | Simple rating model where wins increase rating and losses reduce rating |
| Guest user | Automatically generated temporary account with a unique username and email |
| Game record | One completed game result saved to PostgreSQL |
| Leaderboard | Ranked list of users globally or by a specific game |
| Tutorial mode | Guided walkthrough with scripted moves and AI responses for learning |
| Tips panel | Collapsible in-game panel showing rules, strategy hints, and AI algorithm details |

### 2. Overall Description

#### 2.1 Product Perspective
The platform is organized as a separated frontend and backend:

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| Frontend | React 18 + Vite | Authentication UI, game hub, six playable games, interactive tutorials, tips panels, client-side AI, API calls |
| Backend | Node.js + Express | REST API, JWT auth, validation, result persistence, leaderboards |
| Database | PostgreSQL | Users, game records, leaderboard ratings, analytics events |
| CI/CD | GitHub Actions | Build checks, backend health checks, optional Vercel/Railway deployment |

#### 2.2 User Classes
| User Class | Description | Main Needs |
|------------|-------------|------------|
| Guest player | User who wants immediate access without registration | Start quickly, play games, learn via tutorials, record temporary stats |
| Registered player | User with username, email, and password | Persistent identity, saved history, leaderboard progress, strategy learning |
| Developer | Team member maintaining the project | Local setup, migrations, tests, clear source organization |
| Evaluator | Instructor or reviewer | Understand requirements, verify implementation, run/deploy project |

#### 2.3 Operating Environment
- Modern desktop or mobile browser with JavaScript enabled.
- Node.js 20+ for frontend and backend development.
- PostgreSQL 14+ recommended for local and production database use.
- Frontend default local URL: `http://localhost:5173`.
- Backend default local URL: `http://localhost:5000`.
- Production target: Vercel for frontend and Railway for backend/PostgreSQL.

#### 2.4 Design and Implementation Constraints
- The frontend must remain browser-based and cross-platform.
- The backend must read secrets and deployment configuration from environment variables.
- Database queries must use parameterized SQL values for user-controlled data.
- Protected API routes must require a valid JWT.
- Game AI should execute quickly enough to keep gameplay interactive.
- Tutorial scripts must use valid game moves that produce correct board states.
- Generated build files and dependencies must not be treated as primary source code.

#### 2.5 Assumptions and Dependencies
- PostgreSQL is available before running migrations or protected backend tests.
- `DATABASE_URL` and `JWT_SECRET` are required for backend startup.
- `VITE_API_URL` should point to the backend API base in deployed frontend environments.
- Guest users are stored as normal users with generated identifiers.
- Game result saving happens after a completed game; gameplay itself runs in the browser.
- Tutorial mode skips game result saving to avoid polluting user statistics.

### 3. System Features and Functional Requirements

#### 3.1 Authentication and Session Management
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-AUTH-1 | The system shall allow a new user to register with username, email, and password. | High | Implemented |
| FR-AUTH-2 | The system shall reject registration when required fields are missing. | High | Implemented |
| FR-AUTH-3 | The system shall reject duplicate username or email registration. | High | Implemented |
| FR-AUTH-4 | The system shall hash registered passwords with bcrypt before storage. | High | Implemented |
| FR-AUTH-5 | The system shall allow an existing user to log in with email and password. | High | Implemented |
| FR-AUTH-6 | The system shall reject login for unknown users or invalid passwords. | High | Implemented |
| FR-AUTH-7 | The system shall allow users to continue as a guest without manually entering account details. | High | Implemented |
| FR-AUTH-8 | The system shall issue a JWT after successful registration, login, or guest login. | High | Implemented |
| FR-AUTH-9 | The frontend shall persist the JWT in local storage and restore the session on reload. | Medium | Implemented |
| FR-AUTH-10 | The frontend shall clear local session state when the user signs out. | Medium | Implemented |
| FR-AUTH-11 | The authentication screen shall use a split layout with branding panel and form panel. | Medium | Implemented |
| FR-AUTH-12 | The registration form shall display a real-time password strength indicator. | Low | Implemented |
| FR-AUTH-13 | The login and register forms shall provide a password visibility toggle. | Low | Implemented |

#### 3.2 Game Hub
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-HUB-1 | The system shall display a home screen after authentication. | High | Implemented |
| FR-HUB-2 | The home screen shall show all six available games with title, icon, algorithm, difficulty, and description. | High | Implemented |
| FR-HUB-3 | The user shall be able to launch each game from the home screen. | High | Implemented |
| FR-HUB-4 | Each game screen shall provide a way to return to the home screen. | High | Implemented |
| FR-HUB-5 | The UI shall identify the signed-in user and provide a sign-out action. | Medium | Implemented |
| FR-HUB-6 | The home screen shall include a hero section with platform statistics and a call-to-action. | Medium | Implemented |
| FR-HUB-7 | The home screen shall include a features section explaining the AI capabilities. | Low | Implemented |
| FR-HUB-8 | The home screen shall include a how-it-works section with step-by-step instructions. | Low | Implemented |

#### 3.3 Tic Tac Toe
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-TTT-1 | The system shall provide a 3x3 Tic Tac Toe board. | High | Implemented |
| FR-TTT-2 | The user shall play as `X`; the AI shall play as `O`. | High | Implemented |
| FR-TTT-3 | The AI shall choose moves using minimax with alpha-beta pruning. | High | Implemented |
| FR-TTT-4 | The system shall detect wins, draws, and winning lines. | High | Implemented |
| FR-TTT-5 | The system shall save the game result after completion. | High | Implemented |
| FR-TTT-6 | The user shall be able to reset and play again after the result. | Medium | Implemented |

#### 3.4 Number Target
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-NT-1 | The system shall provide a number target game with a running total from 0 to 100. | High | Implemented |
| FR-NT-2 | The user shall be able to add a number from 1 to 10 on their turn. | High | Implemented |
| FR-NT-3 | The AI shall use target-position game theory based on `(100 - current) % 11`. | High | Implemented |
| FR-NT-4 | The system shall prevent moves that exceed 100. | High | Implemented |
| FR-NT-5 | The first side to reach 100 shall win. | High | Implemented |
| FR-NT-6 | The system shall save the result and duration after completion. | High | Implemented |

#### 3.5 Connect Four
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-C4-1 | The system shall provide a 6-row by 7-column Connect Four board. | High | Implemented |
| FR-C4-2 | The user shall play yellow discs and the AI shall play red discs. | High | Implemented |
| FR-C4-3 | The system shall place discs in the lowest available row of the selected column. | High | Implemented |
| FR-C4-4 | The system shall detect horizontal, vertical, and diagonal four-in-a-row wins. | High | Implemented |
| FR-C4-5 | The AI shall use depth-6 minimax with alpha-beta pruning and heuristic board evaluation. | High | Implemented |
| FR-C4-6 | The board shall visually indicate playable columns during the user's turn. | Medium | Implemented |
| FR-C4-7 | The system shall save win, loss, or draw results after completion. | High | Implemented |

#### 3.6 Memory Match
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-MM-1 | The system shall provide a 16-card memory game with 8 symbol pairs. | High | Implemented |
| FR-MM-2 | The user and AI shall take turns flipping two cards. | High | Implemented |
| FR-MM-3 | Matching pairs shall remain visible and increase the side's score. | High | Implemented |
| FR-MM-4 | The AI shall remember every card it has seen and every card revealed by the player. | High | Implemented |
| FR-MM-5 | The AI shall choose a known matching pair when one is available. | High | Implemented |
| FR-MM-6 | The winner shall be the side with more pairs when all cards are matched. | High | Implemented |
| FR-MM-7 | The system shall save final scores and result after completion. | High | Implemented |

#### 3.7 Rock Paper Scissors
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-RPS-1 | The system shall provide Rock Paper Scissors with rock, paper, and scissors options. | High | Implemented |
| FR-RPS-2 | The game shall run for 7 rounds. | High | Implemented |
| FR-RPS-3 | The system shall score each round as win, loss, or draw. | High | Implemented |
| FR-RPS-4 | The AI shall choose randomly until it has enough player history. | Medium | Implemented |
| FR-RPS-5 | After at least 3 rounds, the AI shall counter the player's most frequent and recent moves. | High | Implemented |
| FR-RPS-6 | The system shall display round history and final result. | Medium | Implemented |
| FR-RPS-7 | The system shall save final scores and result after completion. | High | Implemented |

#### 3.8 Reversi
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-REV-1 | The system shall provide a 6x6 Reversi board. | High | Implemented |
| FR-REV-2 | The user shall play black and the AI shall play white. | High | Implemented |
| FR-REV-3 | The system shall show legal moves for the current player. | High | Implemented |
| FR-REV-4 | A legal move shall flip opponent discs in all valid directions. | High | Implemented |
| FR-REV-5 | The AI shall use depth-4 minimax with alpha-beta pruning and positional weights. | High | Implemented |
| FR-REV-6 | Turns shall pass automatically when a player has no legal moves. | High | Implemented |
| FR-REV-7 | The winner shall be determined by final disc count. | High | Implemented |
| FR-REV-8 | The system shall save final piece counts and result after completion. | High | Implemented |

#### 3.9 Interactive Tutorials
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-TUT-1 | Each game shall provide a "Tutorial" button to enter guided walkthrough mode. | High | Implemented |
| FR-TUT-2 | Tutorial mode shall highlight the target move with a pulsing visual indicator. | High | Implemented |
| FR-TUT-3 | Non-target interactive elements shall be dimmed and non-clickable during tutorial mode. | High | Implemented |
| FR-TUT-4 | Each tutorial step shall display explanatory text describing the strategy behind the move. | High | Implemented |
| FR-TUT-5 | The tutorial shall use scripted AI responses instead of the real AI algorithm. | High | Implemented |
| FR-TUT-6 | The tutorial shall display a step counter showing current progress. | Medium | Implemented |
| FR-TUT-7 | The system shall not save game results during tutorial mode. | High | Implemented |
| FR-TUT-8 | The user shall be able to exit the tutorial at any time, resetting the game to normal mode. | Medium | Implemented |
| FR-TUT-9 | Tutorial scripts shall use only valid game moves that produce correct board states. | High | Implemented |
| FR-TUT-10 | A "Tutorial Complete" message shall appear after the final step with an option to finish. | Medium | Implemented |

#### 3.10 In-Game Tips and Algorithm Information
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-TIPS-1 | Each game shall provide a collapsible tips panel accessible via a "?" button. | High | Implemented |
| FR-TIPS-2 | The tips panel shall display the game objective. | High | Implemented |
| FR-TIPS-3 | The tips panel shall display the game rules. | High | Implemented |
| FR-TIPS-4 | The tips panel shall display strategy tips for the player. | High | Implemented |
| FR-TIPS-5 | The tips panel shall display the AI algorithm name and a plain-language description of how it works. | High | Implemented |
| FR-TIPS-6 | The tips panel shall expand and collapse with a smooth animation. | Low | Implemented |

#### 3.11 Game Records, Profiles, and Statistics
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-STATS-1 | The system shall save completed game records with user, game type, result, duration, user score, and AI score. | High | Implemented |
| FR-STATS-2 | The backend shall validate result values as `win`, `loss`, or `draw`. | High | Implemented |
| FR-STATS-3 | The backend shall validate game types before writing records. | High | Implemented |
| FR-STATS-4 | The system shall update total games, wins, losses, draws, and rating after each saved result. | High | Implemented |
| FR-STATS-5 | The system shall provide per-game win/loss/draw statistics for the authenticated user. | Medium | Implemented |
| FR-STATS-6 | The system shall provide recent game history for the authenticated user. | Medium | Implemented |
| FR-STATS-7 | The system shall provide profile information including rating and win rate. | Medium | Implemented |

#### 3.12 Leaderboards
| ID | Requirement | Priority | Implementation Status |
|----|-------------|----------|-----------------------|
| FR-LB-1 | The system shall provide a global leaderboard ranked by overall user rating. | High | Implemented |
| FR-LB-2 | The system shall provide per-game leaderboards ranked by game-specific rating. | High | Implemented |
| FR-LB-3 | The system shall provide the authenticated user's rank for a selected game. | Medium | Implemented |
| FR-LB-4 | Leaderboard requests shall support a limit parameter. | Medium | Implemented |
| FR-LB-5 | Game-specific leaderboard SQL columns shall be selected from a safe server-side map. | High | Implemented |

### 4. External Interface Requirements

#### 4.1 User Interface Requirements
- The UI shall use a dark, casino-style visual theme with neon-style accent colors and glassmorphism effects.
- The authentication screen shall use a split layout with a branding panel (left) and form panel (right), with a password strength indicator and visibility toggle.
- The home screen shall include a hero section with animated particles, platform statistics, game cards with difficulty badges, feature highlights, and a how-it-works guide.
- Each game screen shall show current status, scores, turns, results, reset controls, a tips panel ("?" button), and a tutorial button.
- Buttons shall visually indicate disabled, loading, and interactive states.
- Tutorial mode shall highlight target moves with a pulsing gold glow and dim non-target elements.
- The layout shall be responsive for desktop and mobile browser sizes.
- The frontend shall show understandable errors for backend or database connectivity failures.

#### 4.2 API Interface Requirements
| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| `POST` | `/api/auth/register` | No | Register user and return JWT |
| `POST` | `/api/auth/login` | No | Authenticate user and return JWT |
| `POST` | `/api/auth/guest` | No | Create guest user and return JWT |
| `POST` | `/api/games/record` | Yes | Save completed game result |
| `GET` | `/api/games/stats/:gameType` | Yes | Get user stats for a game |
| `GET` | `/api/games/history` | Yes | Get recent user game history |
| `GET` | `/api/games/profile` | Yes | Get authenticated user profile |
| `GET` | `/api/leaderboard` | No | Get global leaderboard |
| `GET` | `/api/leaderboard/:gameType` | No | Get per-game leaderboard |
| `GET` | `/api/leaderboard/:gameType/rank` | Yes | Get authenticated user's game rank |
| `GET` | `/health` | No | Verify API and database health |

#### 4.3 Database Requirements
| Table | Required Fields / Purpose |
|-------|---------------------------|
| `users` | UUID identity, username, email, password hash, overall rating, total games, wins, losses, draws, timestamps |
| `game_records` | Individual results linked to users, game type, result, duration, AI difficulty, scores, timestamp |
| `leaderboards` | One row per user with rating and win totals for each supported game |
| `analytics` | Optional event tracking with event type, user, game, JSON data, timestamp |

#### 4.4 Configuration Requirements
| Variable | Required By | Purpose |
|----------|-------------|---------|
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `JWT_SECRET` | Backend | JWT signing and verification secret |
| `NODE_ENV` | Backend | Development, test, or production behavior |
| `FRONTEND_URL` | Backend | Allowed CORS origin |
| `PORT` | Backend | Server port, defaults to `5000` |
| `VITE_API_URL` | Frontend | API base URL, defaults to `http://localhost:5000/api` |

### 5. Non-Functional Requirements

| ID | Requirement | Target / Rule | Implementation Status |
|----|-------------|---------------|-----------------------|
| NFR-PERF-1 | Frontend production bundle should stay lightweight. | Less than 100 KB gzipped target | Implemented (~63 KB gzipped) |
| NFR-PERF-2 | API responses should be fast for ordinary requests. | Less than 100 ms target under normal load | Implemented target documented |
| NFR-PERF-3 | AI decisions should feel interactive. | Less than 500 ms target for visible AI turns | Implemented with short turn delays |
| NFR-SEC-1 | Passwords shall never be stored in plain text for registered users. | bcryptjs with 10 rounds | Implemented |
| NFR-SEC-2 | Authenticated API routes shall require JWT verification. | Bearer token in `Authorization` header | Implemented |
| NFR-SEC-3 | JWTs shall expire automatically. | 30-day expiry | Implemented |
| NFR-SEC-4 | SQL injection risk shall be minimized. | Parameterized queries and safe column maps | Implemented |
| NFR-SEC-5 | CORS shall be restricted to a configured frontend origin. | `FRONTEND_URL` or local default | Implemented |
| NFR-REL-1 | The frontend API client shall retry transient network failures. | 3 attempts with increasing delay | Implemented |
| NFR-REL-2 | The backend shall expose health status for deployment checks. | `/health` endpoint verifies database | Implemented |
| NFR-REL-3 | Database migrations shall be repeatable. | `CREATE IF NOT EXISTS` and safe column additions | Implemented |
| NFR-MAINT-1 | Source shall be separated by frontend, backend, routes, middleware, migrations, and game modules. | Clear directory boundaries | Implemented |
| NFR-MAINT-2 | Tutorial scripts and game tips shall be stored in dedicated data modules, separate from game logic. | Data files in `src/data/` | Implemented |
| NFR-COMP-1 | The application shall run on common operating systems that support Node.js and PostgreSQL. | Windows/macOS/Linux compatible scripts | Implemented |
| NFR-DEPLOY-1 | The project shall support automated build and deployment checks. | GitHub Actions workflow | Implemented |
| NFR-UX-1 | Tutorial mode shall provide a guided, distraction-free learning experience. | Highlighted moves, dimmed elements, step-by-step text | Implemented |

### 6. Data Validation and Business Rules

| ID | Rule |
|----|------|
| BR-1 | Valid game result values are `win`, `loss`, and `draw`. |
| BR-2 | Valid game types are `tictactoe`, `number-target`, `connect-four`, `memory-match`, `rps`, and `reversi`. |
| BR-3 | A win increases overall user rating by 32. |
| BR-4 | A loss decreases overall user rating by 16, with a minimum of 0. |
| BR-5 | Draws increase total game count and draw count but do not change overall rating. |
| BR-6 | Per-game leaderboard rating increases by 32 on wins and decreases by 16 otherwise, with a minimum of 0. |
| BR-7 | Each registered or guest user must have exactly one leaderboard row. |
| BR-8 | Game records must belong to an authenticated user. |
| BR-9 | Guest usernames and emails must be generated uniquely from UUID values. |
| BR-10 | Tutorial mode shall not create game records or modify user statistics. |
| BR-11 | Tutorial scripts shall only reference valid game moves for their respective game. |

### 7. Acceptance Criteria

| ID | Acceptance Criterion |
|----|---------------------|
| AC-1 | A new registered user can sign up, receive a token, enter the game hub, play a game, and have the result saved. |
| AC-2 | A guest user can start without manual credentials and play the same games as a registered user. |
| AC-3 | Reloading the page with a valid stored JWT restores the authenticated session. |
| AC-4 | Each of the six games can be launched from the hub and completed without a page refresh. |
| AC-5 | A completed game creates a row in `game_records` and updates user totals. |
| AC-6 | Global and per-game leaderboards return ranked data from PostgreSQL. |
| AC-7 | Protected endpoints reject missing, invalid, or expired tokens with `401`. |
| AC-8 | The frontend production build completes successfully with `npm run build`. |
| AC-9 | Backend migrations run successfully against PostgreSQL with `npm run migrate`. |
| AC-10 | Backend health checks pass when PostgreSQL and required tables are available. |
| AC-11 | Each game's tutorial can be started, followed step-by-step, and completed or exited without errors. |
| AC-12 | Each game's tips panel can be opened and displays objective, rules, strategy tips, and AI algorithm information. |
| AC-13 | No game results are saved to the database during tutorial mode. |

### 8. Verification Plan

| Area | Verification Method |
|------|---------------------|
| Frontend build | Run `cd frontend && npm run build` |
| Backend syntax | Run Node syntax checks or GitHub Actions lint job |
| Database schema | Run `cd backend && npm run migrate` |
| Backend health | Run `cd backend && npm test` with PostgreSQL configured |
| Authentication | Manually test register, login, guest login, logout, session restore |
| Game flow | Complete each game and confirm saved records |
| Tutorial flow | Start tutorial in each game, follow all steps, verify completion message, exit and verify game resets |
| Tips panel | Open tips panel in each game, verify all sections display correctly including AI algorithm |
| Leaderboards | Query global and per-game leaderboard endpoints after saved games |
| Deployment | Use configured GitHub Actions, Vercel, Railway, and environment variables |

### 9. Requirement Traceability

| Source Area | SRS Coverage |
|-------------|--------------|
| `frontend/src/screens/AuthScreen.jsx` | Authentication UI requirements (FR-AUTH-1 to FR-AUTH-13) |
| `frontend/src/context/AuthContext.jsx` | Session persistence and logout requirements |
| `frontend/src/api/client.js` | API client, token, retry, and error behavior |
| `frontend/src/App.jsx` | Game hub requirements (FR-HUB-1 to FR-HUB-8) |
| `frontend/src/games/*.jsx` | Six game-specific functional requirements and tutorial integration |
| `frontend/src/components/GameTips.jsx` | Tips panel requirements (FR-TIPS-1 to FR-TIPS-6) |
| `frontend/src/components/TutorialOverlay.jsx` | Tutorial overlay UI (FR-TUT-2 to FR-TUT-10) |
| `frontend/src/hooks/useTutorial.js` | Tutorial state machine logic |
| `frontend/src/data/tutorialScripts.js` | Tutorial step definitions (FR-TUT-4, FR-TUT-5, FR-TUT-9) |
| `frontend/src/data/gameTipsData.js` | Game tips and algorithm data (FR-TIPS-2 to FR-TIPS-5) |
| `backend/routes/auth.js` | Registration, login, guest user, JWT issuing |
| `backend/routes/games.js` | Game record, profile, stats, history, rating updates |
| `backend/routes/leaderboard.js` | Global and per-game leaderboard requirements |
| `backend/migrations/001_initial.sql` | Database schema requirements |
| `.github/workflows/test-and-deploy.yml` | Build, test, and deployment requirements |

### 10. Risks and Limitations

| Risk / Limitation | Impact | Mitigation |
|-------------------|--------|------------|
| AI logic runs client-side | Users can inspect or alter local gameplay logic | Acceptable for capstone/demo scope; backend validates saved result shape only |
| Guest users are persisted indefinitely | Database can accumulate temporary accounts | Add cleanup policy in future release |
| Simple rating model | Ratings are easy to understand but not full Elo | Documented as Elo-style; can be expanded later |
| Limited automated frontend tests | UI regressions may require manual checks | Add Vitest/Playwright tests as future work |
| Tutorial scripts are static | Cannot adapt to rule changes without manual script updates | Scripts are data-driven and separated from game logic for easy maintenance |

### 11. Future Enhancements

- Add dashboard screens that expose profile, history, and leaderboard data directly in the UI.
- Add admin analytics views using the `analytics` table.
- Add automated component tests and browser end-to-end tests for all games.
- Add rate limiting and stronger request validation for production hardening.
- Add password reset and email verification for registered accounts.
- Add cleanup or expiration rules for guest accounts.
- Move authoritative game result validation to the backend for competitive production use.
- Add accessibility audits for keyboard navigation, focus order, and screen reader labels.
- Add adaptive tutorial difficulty that adjusts to the player's skill level.
- Add multiplayer support for player-vs-player games.

---

**⚡ Six games. Six algorithms. Zero chance of winning.**
