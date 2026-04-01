# 🔧 Error Handling & Debugging Guide

## Common Errors & Solutions

### ❌ "Guest login failed"

**Screenshot:** Red error banner saying "Guest login failed"

**Root Causes:**

#### 1️⃣ Backend Not Running
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If error: "Failed to fetch"
# Solution: Start backend in another terminal
cd backend && npm run dev
```

#### 2️⃣ Database Not Connected
```bash
# Check database is running
psql -U gameuser -d unbeatable_games -c "SELECT 1;"

# If error: "connection refused"
# Solution (Windows):
Services → PostgreSQL → Start

# Solution (macOS):
brew services start postgresql@15

# Solution (Linux):
sudo systemctl start postgresql
```

#### 3️⃣ Wrong Environment Variables
```bash
# Verify .env in backend folder has correct values:
cat backend/.env

# Should show:
DATABASE_URL=postgresql://gameuser:gamepass123@localhost:5432/unbeatable_games
JWT_SECRET=your-secret-at-least-32-characters-here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### 4️⃣ API Connection Issue
```bash
# Check if frontend can reach backend:
# Open browser DevTools → Console

# Should see in Network tab:
# POST http://localhost:5000/api/auth/guest → 201 Created

# If 500 error: Backend database problem
# If 0 (CORS error): CORS configuration wrong
```

**Fix Steps:**
```bash
1. Kill all Node processes: killall node
2. Start PostgreSQL service
3. Create .env file in backend/ (copy from .env.example)
4. cd backend && npm run migrate
5. npm run dev
6. Open new terminal: npm run dev (frontend)
7. Try guest login again
```

---

### ❌ "Login failed" from regular account

**Possible Causes:**

#### Wrong Credentials
```bash
# Check user exists in database
psql -U gameuser -d unbeatable_games

SELECT username, email FROM users WHERE email='your@email.com';
```

#### Password Hashing Issue
```bash
# Backend hashes password on registration
# Make sure password is:
- At least 8 characters
- Not empty
- Same on both input fields
```

#### Database Constraint Violation
```bash
# If same email used
# Solution: Use slightly different email (tests+1@gmail.com)

# Or clear users table (dev only!)
psql -U gameuser -d unbeatable_games
DELETE FROM game_records;
DELETE FROM leaderboards;
DELETE FROM users;
```

---

### ❌ "Database connection failed"

**Solution Checklist:**

```bash
✅ Step 1: PostgreSQL Running?
# Windows: Services App → PostgreSQL Running?
# macOS: brew services list | grep postgres
# Linux: sudo systemctl status postgresql

✅ Step 2: Can Connect?
psql -U gameuser -d unbeatable_games

✅ Step 3: Environment Variables
# In backend/.env:
DATABASE_URL=postgresql://gameuser:**PASSWORD**@localhost:5432/unbeatable_games

# Replace **PASSWORD** with actual password

✅ Step 4: Migrations Run?
cd backend && npm run migrate
# Should see: ✅ Migrations completed

✅ Step 5: Port Check
# Make sure 5432 not in use
# Windows: netstat -ano | findstr :5432
# macOS/Linux: lsof -i :5432
```

---

### ❌ CORS Error - "No 'Access-Control-Allow-Origin' header"

**Browser Console Shows:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**

```bash
# 1. Check backend/.env has:
FRONTEND_URL=http://localhost:5173

# 2. Restart backend:
killall node
cd backend && npm run dev

# 3. Verify in backend server output:
🌐 CORS origin: http://localhost:5173
```

---

### ❌ "Cannot find module" Errors

```
Error: Cannot find module '@vitejs/plugin-react'
or
Cannot find module 'express'
```

**Solution:**

```bash
# Frontend
npm install --legacy-peer-deps
rm -rf node_modules
npm cache clean --force
npm install

# Backend
cd backend
npm install --legacy-peer-deps
rm -rf node_modules
npm cache clean --force
npm install
```

---

### ❌ Port Already in Use

```bash
# "Error: listen EADDRINUSE: address already in use :::5000"

# Find process
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000

# Kill it
kill -9 <PID>

# Or use different port (in backend/.env):
PORT=5001
```

---

### ❌ JWT Token Issues

```
"Invalid or expired token"
```

**Causes:**
1. Token expired (30 days)
2. JWT_SECRET changed between restarts
3. Token from different server

**Solution:**

```bash
# Clear localStorage in browser console:
localStorage.clear()

# Login again
# New token will be generated and stored

# Make sure backend/.env JWT_SECRET is consistent
# (Same SECRET must be used every restart)
```

---

### ❌ Game Recording Fails

```
"Error: Token required to save game"
```

**Means:** Guest/User token not sent to backend

**Solution:**

```bash
# Frontend already handles this - check:
# 1. User logged in? (See username on screen)
# 2. Browser Console: No AUTH errors?
# 3. Network tab: POST /games/record has Authorization header?

# If still fails:
# Clear localStorage and login again
localStorage.clear()
```

---

## 🔍 Debugging Checklist

### When Something Breaks:

```bash
1. 📋 Check Terminal Output
   - Frontend: npm run dev output
   - Backend: npm run dev output
   - Look for red ❌ errors

2. 🌐 Check Network Tab (DevTools)
   - Right-click → Inspect → Network tab
   - Trigger action (e.g., click "Continue as Guest")
   - See RED requests with Status 500/404/401?
   - Click request → Response tab (see error message)

3. 📝 Check Console Tab (DevTools)
   - Any red errors?
   - Copy full error message
   - Google it

4. 🗄️ Check Database
   psql -U gameuser -d unbeatable_games
   SELECT COUNT(*) FROM users;
   # Should show at least 1-2 guest users

5. 🔌 Check Backend Health
   curl http://localhost:5000/api/health
   # Should return: {"status":"OK",...}

6. 🚀 Restart Everything
   killall node
   cd backend && npm run migrate
   (in separate terminal) npm run dev
   (in another terminal) cd ../.. && npm run dev
```

### Advanced Debugging:

```bash
# Enable verbose logging
# In backend/.env add:
DEBUG=*

# In frontend, check localStorage:
# Console: localStorage.getItem('token')
# Should show JWT token starting with "eyJ..."

# Check API URL:
# Console: import.meta.env.VITE_API_URL
# Should show: http://localhost:5000/api
```

---

## 📞 When All Else Fails

```bash
# Full reset:

# 1. Kill everything
killall node

# 2. Clear node_modules
rm -rf node_modules backend/node_modules

# 3. Reinstall
npm install --legacy-peer-deps
cd backend && npm install --legacy-peer-deps

# 4. Reset database
psql -U gameuser -d unbeatable_games
DELETE FROM game_records;
DELETE FROM leaderboards;
DELETE FROM users;
\q

# 5. Run migrations fresh
cd backend && npm run migrate

# 6. Start fresh
npm run dev
(new terminal) cd backend && npm run dev
```

---

## ✅ All Working Indicators

When everything is correct, you should see:

**Frontend Console:**
```
✅ No red errors
✅ New user created or guest login successful
✅ Username shows on screen (e.g., "Hi, Guest_abc123!")
```

**Backend Console:**
```
✅ Server running on port 5000
✅ CORS origin: http://localhost:5173
✅ Database connection established
```

**Browser Network Tab:**
```
✅ POST /auth/guest → 201
✅ Response has "token" and "user" data
```

**Then Game Works:**
```
✅ Click a game card
✅ Play game
✅ Finish game
✅ "Game saved!" message
✅ Stats updated on leaderboard
```

---

## 🎯 Quick Fix Command

One command to fix most issues:

```bash
# Save this as fix.sh or fix.ps1

# Kill all processes
killall node

# Clean installs
rm -rf node_modules backend/node_modules
npm cache clean --force

# Reinstall
npm install --legacy-peer-deps
cd backend && npm install --legacy-peer-deps

# Run migrations
npm run migrate 2>/dev/null || true

# Start services
echo "✅ Ready! Run in two terminals:"
echo "Terminal 1: npm run dev"
echo "Terminal 2: cd backend && npm run dev"
```

Then run: `bash fix.sh` (or PowerShell equivalent)

---

**Still stuck?** Check the error in:
- backend server log
- frontend browser console
- Network tab response
- Database (psql)

99% of issues are: backend not running, database not connected, or env vars wrong! 🎯
