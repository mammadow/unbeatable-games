#!/bin/bash
# ⚡ UNBEATABLE GAMES - COMPLETE SETUP SCRIPT
# Bu script tüm kurulumları otomatik olarak yapar

set -e

echo "🚀 STARTING COMPLETE SETUP..."
echo ""

# =============================================================================
# 1. FRONTEND SETUP
# =============================================================================
echo "📦 [1/5] Frontend Dependencies..."
npm install --legacy-peer-deps 2>&1 | tail -5
echo "✅ Frontend dependencies installed"
echo ""

# =============================================================================
# 2. BACKEND SETUP
# =============================================================================
echo "📦 [2/5] Backend Setup..."
cd backend

echo "   - Installing backend dependencies..."
npm install --legacy-peer-deps 2>&1 | tail -5

echo "   - Creating .env file..."
if [ ! -f ".env" ]; then
  cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:password@localhost:5432/unbeatable_games
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=unbeatable_games
PORT=5000
NODE_ENV=development
JWT_SECRET=dev_ultra_secret_key_change_in_production_12345
FRONTEND_URL=http://localhost:5173
EOF
  echo "   ✅ .env created"
else
  echo "   ℹ️  .env already exists"
fi
echo ""

# =============================================================================
# 3. DATABASE SETUP
# =============================================================================
echo "🗄️  [3/5] Database Preparation..."

# Check if PostgreSQL is running
if ! psql -U postgres -c "SELECT 1" > /dev/null 2>&1; then
  echo "   ⚠️  PostgreSQL not running. Please start PostgreSQL."
  echo "      Windows: Services → PostgreSQL → Start"
  echo "      macOS:   brew services start postgresql"
  echo "      Linux:   sudo systemctl start postgresql"
  exit 1
fi

echo "   ✅ PostgreSQL is running"

# Create database and user
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'unbeatable_games'" | grep -q 1 || \
psql -U postgres << SQL
CREATE DATABASE unbeatable_games;
CREATE USER gameuser WITH PASSWORD 'gamepass123';
ALTER ROLE gameuser SET client_encoding TO 'utf8';
ALTER ROLE gameuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE gameuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE unbeatable_games TO gameuser;
SQL

echo "   ✅ Database ready"

# Run migrations
echo "   - Running migrations..."
npm run migrate > /dev/null 2>&1
echo "   ✅ Schema created"
echo ""

# Go back to root
cd ..

# =============================================================================
# 4. FRONTEND ENV
# =============================================================================
echo "⚙️  [4/5] Frontend Environment..."
if [ ! -f ".env.local" ]; then
  cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF
  echo "   ✅ .env.local created"
else
  echo "   ℹ️  .env.local already exists"
fi
echo ""

# =============================================================================
# 5. BUILD & TEST
# =============================================================================
echo "🔨 [5/5] Build Test..."
npm run build > /dev/null 2>&1
echo "   ✅ Frontend builds successfully"
echo ""

# =============================================================================
# DONE
# =============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ SETUP COMPLETE! Ready to run."
echo ""
echo "📝 RUN COMMANDS:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   npm run dev"
echo ""
echo "   Then open: http://localhost:5173"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
