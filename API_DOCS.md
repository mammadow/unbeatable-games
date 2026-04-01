# 🔌 API Documentation

## Base URL

**Development**: `http://localhost:5000/api`
**Production**: `https://your-domain.com/api`

## Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Store token from login/register response. Token auto-restores from localStorage on browser reload.

---

## 🔐 Authentication Endpoints

### POST /auth/register
Create new user account.

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "rating": 1000
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (400):**
```json
{
  "error": "Email already registered"
}
```

**Validation:**
- Username: 3-50 characters, unique
- Email: Valid format, unique
- Password: 6+ characters

---

### POST /auth/login
Authenticate existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "rating": 1000
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### POST /auth/guest
Create temporary guest session.

**Request:**
```json
{}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "username": "guest_1704067200000",
    "email": "guest-uuid@unbeatable.local",
    "rating": 1000
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Note:** Guest users get timestamp-based usernames and no email recovery.

---

## 🎮 Game Endpoints

### POST /games/record
Record game result after playing.

**Required Auth:** Yes

**Request:**
```json
{
  "gameType": "tictactoe",
  "result": "win",
  "durationSeconds": 45,
  "userScore": 1,
  "aiScore": 0
}
```

**Parameters:**
- `gameType`: `"tictactoe"` | `"number-target"` | `"connect-four"`
- `result`: `"win"` | `"loss"` | `"draw"`
- `durationSeconds`: Integer (0+)
- `userScore`: Integer (0+)
- `aiScore`: Integer (0+)

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "gameType": "tictactoe",
  "result": "win",
  "durationSeconds": 45,
  "userScore": 1,
  "aiScore": 0,
  "created_at": "2024-01-01T12:00:00Z"
}
```

**Rating Changes:**
- Win: +32 rating
- Loss: -16 rating
- Draw: No change

---

### GET /games/stats/:gameType
Get user statistics for specific game.

**Required Auth:** Yes

**Parameters:**
- `gameType`: `"tictactoe"` | `"number-target"` | `"connect-four"`

**Response (200):**
```json
{
  "gameType": "tictactoe",
  "wins": 5,
  "losses": 2,
  "draws": 1,
  "totalGames": 8,
  "winRate": 0.625,
  "averageDuration": 45.5
}
```

---

### GET /games/history?limit=50
Get user's recent game history.

**Required Auth:** Yes

**Query Parameters:**
- `limit`: 1-100 (default: 50)

**Response (200):**
```json
{
  "games": [
    {
      "id": "uuid",
      "gameType": "tictactoe",
      "result": "win",
      "durationSeconds": 45,
      "userScore": 1,
      "aiScore": 0,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "total": 42
}
```

---

### GET /games/profile
Get current user profile with all stats.

**Required Auth:** Yes

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "totalGames": 120,
    "totalWins": 80,
    "totalLosses": 30,
    "totalDraws": 10,
    "overallRating": 1250
  },
  "gameStats": {
    "tictactoe": {
      "rating": 1300,
      "wins": 35,
      "losses": 8,
      "draws": 2
    },
    "number-target": {
      "rating": 1250,
      "wins": 30,
      "losses": 12,
      "draws": 3
    },
    "connect-four": {
      "rating": 1200,
      "wins": 15,
      "losses": 10,
      "draws": 5
    }
  }
}
```

---

## 🏆 Leaderboard Endpoints

### GET /leaderboard
Get global leaderboard across all games.

**Query Parameters:**
- `limit`: 1-1000 (default: 50)

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "pro_player",
      "totalWins": 250,
      "totalGames": 300,
      "winRate": 0.833,
      "rating": 1850
    },
    {
      "rank": 2,
      "username": "game_master",
      "totalWins": 200,
      "totalGames": 260,
      "winRate": 0.769,
      "rating": 1750
    }
  ],
  "totalPlayers": 1250
}
```

---

### GET /leaderboard/:gameType
Get leaderboard for specific game.

**Parameters:**
- `gameType`: `"tictactoe"` | `"number-target"` | `"connect-four"`

**Query Parameters:**
- `limit`: 1-1000 (default: 50)

**Response (200):**
```json
{
  "gameType": "tictactoe",
  "leaderboard": [
    {
      "rank": 1,
      "username": "ttt_king",
      "wins": 150,
      "totalGames": 160,
      "winRate": 0.9375,
      "rating": 1900
    }
  ],
  "totalPlayers": 450
}
```

---

### GET /leaderboard/:gameType/rank
Get current user's rank in specific game.

**Required Auth:** Yes

**Parameters:**
- `gameType`: `"tictactoe"` | `"number-target"` | `"connect-four"`

**Response (200):**
```json
{
  "gameType": "tictactoe",
  "rank": 45,
  "username": "john_doe",
  "rating": 1300,
  "wins": 35,
  "totalGames": 45,
  "winRate": 0.777,
  "totalPlayers": 450
}
```

**Response (404):**
```json
{
  "error": "User has no stats in this game yet"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid game type"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Route not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error",
  "message": "Details about what went wrong"
}
```

---

## 📊 Data Types

### User
```typescript
{
  id: string (UUID)
  username: string (3-50 chars)
  email: string (valid email)
  rating: number (1000+)
  created_at: ISO8601
  updated_at: ISO8601
}
```

### GameRecord
```typescript
{
  id: string (UUID)
  user_id: string (UUID)
  gameType: "tictactoe" | "number-target" | "connect-four"
  result: "win" | "loss" | "draw"
  duration_seconds: number
  user_score: number
  ai_score: number
  created_at: ISO8601
}
```

### LeaderboardEntry
```typescript
{
  rank: number
  username: string
  wins: number
  totalGames: number
  winRate: number (0-1)
  rating: number
}
```

---

## 🔄 Rate Limiting

Current limits (production):
- Auth endpoints: 5 requests/minute per IP
- Game endpoints: 100 requests/minute per user
- Leaderboard: Unlimited (cached)

---

## 💾 Caching

- Leaderboard queries: 5 minute TTL
- User stats: 1 minute TTL
- Game history: 30 second TTL

---

## 🧪 Test Endpoints

### Health Check
```
GET /health
```

Response (Database Connected):
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00Z",
  "database": "connected"
}
```

Response (Database Error - 503):
```json
{
  "status": "ERROR",
  "message": "Database connection failed",
  "error": "connect ECONNREFUSED"
}
```

---

## 📱 Frontend Integration Examples

### Login & Store Token
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'pass' })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

### Make Authenticated Request
```javascript
const response = await fetch('http://localhost:5000/api/games/profile', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
const profile = await response.json();
```

### Record Game Result
```javascript
const response = await fetch('http://localhost:5000/api/games/record', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({
    gameType: 'tictactoe',
    result: 'win',
    durationSeconds: 45,
    userScore: 1,
    aiScore: 0
  })
});
```

---

## 🚀 Deployment Notes

See main [README.md](./README.md) for deployment instructions to Vercel and Railway.

**Environment Variables Needed:**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-frontend.com
NODE_ENV=production
PORT=5000
```

