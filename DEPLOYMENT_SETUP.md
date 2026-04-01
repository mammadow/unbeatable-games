# 🚀 Production Deployment Guide

Complete step-by-step guide for deploying Unbeatable Games Platform to production.

## Table of Contents
1. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Database Setup (Neon/AWS RDS)](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account: https://vercel.com
- GitHub repository connected
- Node.js 18+

### Step 1: Prepare Frontend

```bash
# Ensure build works locally
npm run build

# Check dist output exists
ls dist/
```

### Step 2: Deploy to Vercel

**Option A: CLI (Recommended)**
```bash
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod
```

**Option B: GitHub Integration**
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Framework: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click Deploy

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-domain.com/api
```

### Step 4: Verify Frontend

```
https://your-project.vercel.app
```

Expected: Login screen loads, no console errors

---

## Backend Deployment (Railway)

### Prerequisites
- Railway account: https://railway.app
- GitHub repository connected
- Backend code hosted on GitHub

### Step 1: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "GitHub Repo"
4. Authorize GitHub and select your repository
5. Railway auto-detects Node.js backend

### Step 2: Add PostgreSQL Database

1. In Railway project, click "Add"
2. Select "PostgreSQL"
3. Railway creates database automatically
4. Note the `DATABASE_URL`

### Step 3: Configure Environment Variables

In Railway Dashboard → Project → Variables:

```
DATABASE_URL=postgres://...  (auto-filled)
JWT_SECRET=your_super_secret_production_key_min_32_chars
NODE_ENV=production
FRONTEND_URL=https://your-project.vercel.app
PORT=5000
```

**Important:** Use a strong, random JWT_SECRET (min 32 characters)

Generate secure key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Deploy

Railway auto-deploys on `git push` to main/master branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin master
```

Monitor deployment in Railway Dashboard → Deployments

### Step 5: Verify Backend

```bash
curl https://your-backend-domain.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00Z",
  "database": "connected"
}
```

---

## Database Setup

### Option A: Neon (Recommended - Free Tier)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy `DATABASE_URL`
5. Paste into Railway environment variables

Benefits:
- Free tier: 3 projects, 1 GB storage
- Automatic backups
- Connection pooling included
- Point-in-time recovery

### Option B: AWS RDS

1. Go to AWS console → RDS
2. Create database (PostgreSQL 12+)
3. Enable public accessibility
4. Create security group allowing port 5432
5. Get connection string:
```
postgresql://username:password@hostname:5432/dbname
```

6. Set `DATABASE_URL` in Railway

### Option C: Railway PostgreSQL (Included)

Railway auto-creates PostgreSQL when you select it. Uses managed backups and is included in Railway pricing.

**Recommended for:** Small-to-medium projects

---

## Environment Configuration

### Required Variables

**Frontend (.env in Vercel):**
```
VITE_API_URL=https://your-backend.railway.app/api
```

**Backend (in Railway):**
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=<min_32_char_random_string>
NODE_ENV=production
FRONTEND_URL=https://your-project.vercel.app
PORT=5000
```

### Generate Secrets

```bash
# JWT Secret (min 32 chars, URL-safe)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Database Password (strong password)
openssl rand -base64 32
```

---

## Post-Deployment Verification

### Test Frontend
```bash
# Open in browser
https://your-project.vercel.app

# Expected:
1. Login screen loads
2. No console errors (F12)
3. Can click guest login
4. Game selection screen appears
```

### Test Backend
```bash
# Health check
curl https://your-backend.railway.app/api/health

# Expected 200 response with "database": "connected"
```

### Test Full Flow
1. Frontend loads ✅
2. Click "Continue as Guest"
3. Select "Tic Tac Toe"
4. Play one game
5. Should see "Saving..." then "Play Again"
6. Leaderboard should update

### Check Logs

**Vercel Frontend:**
- Dashboard → Deployment → Logs → Runtime
- Check for any errors during game play

**Railway Backend:**
- Dashboard → Logs → View logs
- Should show `✅ Server running on port 5000`
- Should show `✅ Database connection established`

---

## CI/CD Pipeline

GitHub Actions automatically:
1. ✅ Runs tests on every push
2. ✅ Builds frontend and backend
3. ✅ Deploys to Vercel & Railway on master branch

### Monitor Pipeline

1. Go to GitHub repo → Actions
2. View workflow runs
3. Check status badges in README

### Manual Deployment

If auto-deploy fails:

**Frontend:**
```bash
vercel --prod --token $VERCEL_TOKEN
```

**Backend:**
```bash
git push origin master
# Railway auto-deploys
```

---

## Performance Monitoring

### Frontend (Vercel Analytics)

Dashboard → Analytics:
- Page load time
- Core Web Vitals
- Traffic patterns

### Backend (Railway Metrics)

Dashboard → Metrics:
- Memory usage
- CPU usage
- Network I/O
- Database connections

### Set up Alerts

1. Railway → Settings → Notifications
2. Enable email alerts for:
   - Build failures
   - Deployment failures
   - Memory threshold

---

## Scaling Considerations

### Frontend
- Vercel: Auto-scales (no config needed)
- CDN caching: Images, CSS cached globally
- No action required

### Backend
- Railway: Can upgrade instance size if needed
- Enable auto-scaling in Railway settings
- Monitor CPU/memory usage
- Database: Scale PostgreSQL if needed

### Database
- Monitor query performance in logs
- Add indexes if needed (already included)
- Set up automated backups (Neon/RDS)
- Plan for growth: 1GB every 3-6 months

---

## Security Checklist

- [ ] JWT_SECRET is >32 chars, unique, never committed
- [ ] CORS origin is set to production domain only
- [ ] HTTPS enabled everywhere (Vercel/Railway handle this)
- [ ] Database credentials never in code
- [ ] .env files in .gitignore
- [ ] Sensitive logs not printed in production
- [ ] Rate limiting enabled on API (optional)
- [ ] SQL injection prevented (parameterized queries ✅)

---

## Rollback Procedure

### Frontend (Vercel)

1. Go to Deployments
2. Find previous successful deployment
3. Click "..." → Promote to Production

### Backend (Railway)

1. Go to Deployments
2. Select previous deployment
3. Click "..." → Promote to Production

Or revert GitHub commit and push again.

---

## Monitoring & Maintenance

### Daily Checks (first week)
- [ ] Frontend loads without errors
- [ ] Backend health check passes
- [ ] Games save correctly
- [ ] Leaderboard updates
- [ ] No crash logs

### Weekly Checks
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Review database growth
- [ ] Test all game flows

### Monthly Maintenance
- [ ] Update dependencies
- [ ] Review security updates
- [ ] Optimize slow queries
- [ ] Clean up old logs/data

---

## Troubleshooting

### Frontend Won't Load

**Error: Cannot connect to API**
- Verify `VITE_API_URL` in Vercel environment
- Check backend is running
- Check CORS origin matches frontend URL

**Error: Blank page**
- Check browser DevTools Console (F12)
- Verify build succeeded in Vercel Deployments
- Clear browser cache

### Backend Won't Start

**Error: Database connection refused**
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Run migrations manually

**Error: Port already in use**
- Railway handles port assignment
- Check logs for actual error

### Game Recording Fails

**Error: 502 Bad Gateway**
- Check backend logs for errors
- Verify database connection
- Check API request format

### Leaderboard Empty

**Cause: No games recorded yet**
- Play a few games as guest
- Wait 30 seconds for cache to clear
- Refresh browser

---

## DNS & Custom Domain

### Vercel Custom Domain
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records (instructions provided)
4. Wait for SSL certificate (< 5 min)

### Railway Backend Domain
1. Railway → Project → Settings → Domain
2. Railway provides auto-generated domain
3. Or connect custom domain via DNS

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **Environment Variables**: See `.env.example` files

---

## Success Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database connected
- [ ] Environment variables configured
- [ ] Health check passes
- [ ] Guest login works
- [ ] Games record correctly
- [ ] Leaderboard updates
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Monitoring & alerts set up

🎉 **Production Deployment Complete!**

