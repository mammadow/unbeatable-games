# 🧪 Backend Database Setup & Testing

Quick setup untuk local development database:

## Option 1: PostgreSQL Local

### Windows
```bash
# Install PostgreSQL from: https://www.postgresql.org/download/windows/

# Start PostgreSQL (Services app)
# Or use PostgreSQL app from Start menu

# Connect to postgres
psql -U postgres

# Create database and user
CREATE DATABASE unbeatable_games;
CREATE USER gameuser WITH PASSWORD 'gamepass123';
GRANT ALL PRIVILEGES ON DATABASE unbeatable_games TO gameuser;
\q
```

### macOS
```bash
# Install: brew install postgresql@15
brew services start postgresql@15

# Connect
psql postgres

# Create database
CREATE DATABASE unbeatable_games;
CREATE USER gameuser WITH PASSWORD 'gamepass123';
GRANT ALL PRIVILEGES ON DATABASE unbeatable_games TO gameuser;
\q
```

### Linux (Ubuntu/Debian)
```bash
sudo systemctl start postgresql
sudo -u postgres psql

# In PostgreSQL:
CREATE DATABASE unbeatable_games;
CREATE USER gameuser WITH PASSWORD 'gamepass123';
GRANT ALL PRIVILEGES ON DATABASE unbeatable_games TO gameuser;
\q
```

## Step 2: Configure Backend

```bash
cd backend

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://gameuser:gamepass123@localhost:5432/unbeatable_games
DB_HOST=localhost
DB_PORT=5432
DB_USER=gameuser
DB_PASS=gamepass123
DB_NAME=unbeatable_games
JWT_SECRET=your-secret-key-min-32-chars-change-this-in-production-1234567890-
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF
```

## Step 3: Run Migrations

```bash
cd backend
npm install
npm run migrate
```

**Output should be:**
```
✅ Database connection established
✅ Migrations completed
```

## Step 4: Start Services

### Terminal 1 (Backend)
```bash
cd backend
npm run dev
# Output: ✅ Server running on port 5000
```

### Terminal 2 (Frontend)
```bash
npm run dev
# Output: Local: http://localhost:5173
```

## Step 5: Test Guest Login

1. Open http://localhost:5173
2. Click "Continue as Guest"
3. Should see game home screen ✅

## 🐛 Troubleshooting

### "Guest login failed"
```
❌ Check points:
1. Backend running? (Terminal shows: ✅ Server running on port 5000)
2. Database running? (Check Services or brew services list)
3. .env configured? (Copy .env.example to .env)
4. API URL correct? (Frontend .env has VITE_API_URL=http://localhost:5000/api)
```

### "Database connection failed"
```
1. Start PostgreSQL service
2. Check CONNECTION in .env:
   - USER: gameuser (not postgres)
   - PASSWORD: gamepass123
   - DATABASE: unbeatable_games
   - HOST: localhost
   - PORT: 5432
3. Run: npm run migrate
```

### "Port 5000 already in use"
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill it
kill -9 <PID>
```

### Network Error in Frontend
```
1. Backend running on :5000?
2. Frontend .env has: VITE_API_URL=http://localhost:5000/api
3. Clear browser cache: Ctrl+Shift+Delete
4. Check CORS: Backend has: FRONTEND_URL=http://localhost:5173
```

## ✅ Full Stack Test

Run this to verify everything:

```bash
# 1. Check PostgreSQL
psql -U gameuser -d unbeatable_games -c "SELECT 1;"
# Output: 1 row

# 2. Check backend startup
cd backend && npm run dev &
sleep 2

# 3. Check health endpoint
curl http://localhost:5000/api/health
# Output: {"status":"OK","database":"connected",...}

# 4. Test guest login
curl -X POST http://localhost:5000/api/auth/guest \
  -H "Content-Type: application/json" \
  -d '{}'
# Output: {"user":{"id":"...","username":"Guest_..."},"token":"..."}

# 5. Test with valid token
TOKEN="<token-from-above>"
curl http://localhost:5000/api/games/profile \
  -H "Authorization: Bearer $TOKEN"
# Output: {"...game stats..."}
```

## 🔗 Files to Check

- `.env` — Database connection (must exist)
- `backend/package.json` — Dependencies installed
- `backend/server.js` — Server config
- `src/api/client.js` — API URL config

All should work after setup! 🚀
