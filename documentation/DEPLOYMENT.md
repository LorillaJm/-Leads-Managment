# Deployment Guide

## Overview

This guide covers deploying the Lead Management System to production using modern cloud platforms.

## Recommended Stack

- **Frontend**: Vercel
- **Backend**: Render or Railway
- **Database**: Neon (PostgreSQL) or Supabase
- **File Storage**: AWS S3 or Cloudflare R2 (if needed)
- **Monitoring**: Sentry + Vercel Analytics

## Prerequisites

- Git repository (GitHub/GitLab)
- Domain name (optional but recommended)
- Credit card for cloud services
- SSL certificate (provided by platforms)

---

## Part 1: Database Setup

### Option A: Neon (Recommended)

**Why Neon?**
- Serverless PostgreSQL
- Automatic scaling
- Generous free tier
- Instant branching
- Built-in connection pooling

**Setup Steps**:

1. **Create Account**
   - Go to https://neon.tech
   - Sign up with GitHub

2. **Create Project**
   ```
   Project name: lead-management-prod
   Region: Choose closest to your users
   PostgreSQL version: 15
   ```

3. **Get Connection String**
   ```
   Dashboard → Connection Details → Connection string
   
   Format:
   postgresql://user:password@host/database?sslmode=require
   ```

4. **Configure Database**
   ```bash
   # Set DATABASE_URL in your environment
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

### Option B: Supabase

**Why Supabase?**
- PostgreSQL + additional features
- Built-in auth (alternative to JWT)
- Real-time subscriptions
- Storage included
- Generous free tier

**Setup Steps**:

1. **Create Account**
   - Go to https://supabase.com
   - Sign up with GitHub

2. **Create Project**
   ```
   Project name: lead-management
   Database password: [strong password]
   Region: Choose closest to your users
   ```

3. **Get Connection String**
   ```
   Settings → Database → Connection string
   
   Use "Connection pooling" for serverless:
   postgresql://postgres:[password]@[host]:6543/postgres
   ```

4. **Configure Database**
   ```bash
   DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres"
   ```

---

## Part 2: Backend Deployment

### Option A: Render (Recommended)

**Why Render?**
- Easy deployment from Git
- Automatic HTTPS
- Free tier available
- Built-in health checks
- Zero-downtime deploys

**Setup Steps**:

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   ```
   Dashboard → New → Web Service
   Connect repository: your-repo
   Name: lead-management-api
   Region: Choose closest to users
   Branch: main
   Root Directory: apps/api
   Runtime: Node
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=[from Neon/Supabase]
   JWT_SECRET=[generate 32+ char random string]
   JWT_REFRESH_SECRET=[generate 32+ char random string]
   FRONTEND_URL=https://your-domain.vercel.app
   ```

4. **Generate Secrets**
   ```bash
   # Generate random secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Health Check**
   ```
   Health Check Path: /api/v1/health
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your API URL: https://lead-management-api.onrender.com

7. **Run Migrations**
   ```bash
   # In Render Shell (Dashboard → Shell)
   npx prisma db push
   npm run seed
   ```

### Option B: Railway

**Why Railway?**
- Simple deployment
- Generous free tier
- Built-in PostgreSQL
- Automatic HTTPS
- Great DX

**Setup Steps**:

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create Project**
   ```
   New Project → Deploy from GitHub repo
   Select repository
   ```

3. **Configure Service**
   ```
   Root Directory: apps/api
   Build Command: npm install && npx prisma generate
   Start Command: npm start
   Watch Paths: apps/api/**
   ```

4. **Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=[generate secret]
   JWT_REFRESH_SECRET=[generate secret]
   FRONTEND_URL=https://your-domain.vercel.app
   ```

5. **Add PostgreSQL**
   ```
   New → Database → PostgreSQL
   Railway will auto-inject DATABASE_URL
   ```

6. **Deploy**
   - Railway auto-deploys on push
   - Get URL from Settings → Domains

---

## Part 3: Frontend Deployment

### Vercel (Recommended)

**Why Vercel?**
- Built for Next.js/React
- Automatic HTTPS
- Global CDN
- Preview deployments
- Generous free tier
- Zero configuration

**Setup Steps**:

1. **Create Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   ```
   Dashboard → Add New → Project
   Import Git Repository: your-repo
   ```

3. **Configure Build**
   ```
   Framework Preset: Vite
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**
   ```
   VITE_API_URL=https://lead-management-api.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get URL: https://your-project.vercel.app

6. **Custom Domain** (Optional)
   ```
   Project Settings → Domains
   Add domain: app.yourdomain.com
   
   DNS Configuration:
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```

7. **Update Backend CORS**
   ```
   # In Render/Railway environment variables
   FRONTEND_URL=https://app.yourdomain.com
   ```

---

## Part 4: Database Migration

### Migrate from SQLite to PostgreSQL

1. **Update Prisma Schema**
   ```prisma
   // apps/api/prisma/schema.prisma
   datasource db {
     provider = "postgresql"  // Changed from sqlite
     url      = env("DATABASE_URL")
   }
   ```

2. **Generate Migration**
   ```bash
   cd apps/api
   npx prisma migrate dev --name init
   ```

3. **Push to Production**
   ```bash
   # This runs automatically on Render/Railway
   npx prisma db push
   ```

4. **Seed Production Data**
   ```bash
   # In Render Shell or Railway CLI
   npm run seed
   ```

### Data Migration (if needed)

```bash
# Export from SQLite
sqlite3 apps/api/prisma/dev.db .dump > data.sql

# Convert to PostgreSQL format (manual editing needed)
# Import to PostgreSQL
psql $DATABASE_URL < data_converted.sql
```

---

## Part 5: Environment Configuration

### Production Environment Variables

**Backend (.env.production)**:
```bash
# Environment
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# JWT Secrets (generate with: openssl rand -hex 32)
JWT_SECRET=your-production-secret-min-32-chars
JWT_REFRESH_SECRET=your-production-refresh-secret

# Frontend URL (for CORS)
FRONTEND_URL=https://app.yourdomain.com,https://your-project.vercel.app

# Optional: Sentry
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Optional: Email (for notifications)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Frontend (.env.production)**:
```bash
VITE_API_URL=https://api.yourdomain.com
```

### Security Checklist

- [ ] All secrets are unique (not from .env.example)
- [ ] JWT secrets are 32+ characters
- [ ] DATABASE_URL uses SSL (sslmode=require)
- [ ] FRONTEND_URL matches actual domain
- [ ] No secrets committed to Git
- [ ] Environment variables set in platform dashboards

---

## Part 6: DNS Configuration

### Custom Domain Setup

**For Frontend (Vercel)**:
```
Type: CNAME
Name: app (or @)
Value: cname.vercel-dns.com
TTL: Auto
```

**For Backend (Render)**:
```
Type: CNAME
Name: api
Value: your-service.onrender.com
TTL: Auto
```

**SSL Certificates**:
- Automatically provided by Vercel/Render
- Let's Encrypt certificates
- Auto-renewal

---

## Part 7: Monitoring Setup

### Sentry (Error Tracking)

1. **Create Account**
   - Go to https://sentry.io
   - Sign up

2. **Create Project**
   ```
   Platform: Node.js (backend)
   Platform: React (frontend)
   ```

3. **Install SDK**
   ```bash
   # Backend
   npm install @sentry/node -w apps/api
   
   # Frontend
   npm install @sentry/react -w apps/web
   ```

4. **Configure Backend**
   ```typescript
   // apps/api/src/index.ts
   import * as Sentry from '@sentry/node';
   
   if (process.env.SENTRY_DSN) {
     Sentry.init({
       dsn: process.env.SENTRY_DSN,
       environment: process.env.NODE_ENV,
       tracesSampleRate: 1.0,
     });
   }
   ```

5. **Configure Frontend**
   ```typescript
   // apps/web/src/main.tsx
   import * as Sentry from '@sentry/react';
   
   if (import.meta.env.VITE_SENTRY_DSN) {
     Sentry.init({
       dsn: import.meta.env.VITE_SENTRY_DSN,
       environment: import.meta.env.MODE,
       integrations: [new Sentry.BrowserTracing()],
       tracesSampleRate: 1.0,
     });
   }
   ```

### Vercel Analytics

1. **Enable in Dashboard**
   ```
   Project Settings → Analytics → Enable
   ```

2. **Install Package**
   ```bash
   npm install @vercel/analytics -w apps/web
   ```

3. **Add to App**
   ```typescript
   // apps/web/src/App.tsx
   import { Analytics } from '@vercel/analytics/react';
   
   function App() {
     return (
       <>
         <YourApp />
         <Analytics />
       </>
     );
   }
   ```

---

## Part 8: CI/CD Pipeline

### GitHub Actions (Optional)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        run: echo "Vercel auto-deploys on push"
      - name: Deploy to Render
        run: echo "Render auto-deploys on push"
```

---

## Part 9: Post-Deployment

### Verification Checklist

- [ ] Frontend loads correctly
- [ ] API health check responds
- [ ] Login works
- [ ] Database connection successful
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Custom domain working
- [ ] Error tracking active
- [ ] Backups configured
- [ ] Monitoring alerts set up

### Smoke Tests

```bash
# Health check
curl https://api.yourdomain.com/api/v1/health

# Login test
curl -X POST https://api.yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@leadflow.com","password":"password123"}'

# Frontend test
curl https://app.yourdomain.com
```

### Performance Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test API endpoint
ab -n 1000 -c 10 https://api.yourdomain.com/api/v1/health

# Expected: < 200ms response time
```

---

## Part 10: Maintenance

### Regular Tasks

**Daily**:
- Monitor error rates (Sentry)
- Check API response times
- Review failed requests

**Weekly**:
- Review security alerts
- Check database size
- Update dependencies

**Monthly**:
- Review costs
- Backup verification
- Performance optimization
- Security audit

### Scaling

**Database**:
- Neon: Auto-scales
- Supabase: Upgrade plan
- Monitor connection pool

**Backend**:
- Render: Increase instance size
- Railway: Upgrade plan
- Add horizontal scaling

**Frontend**:
- Vercel: Auto-scales (CDN)
- No action needed

---

## Cost Estimates

### Free Tier (Development/Small Teams)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Neon | Free | 0.5 GB storage, 1 project |
| Render | Free | 750 hours/month, sleeps after 15min |
| Vercel | Free | 100 GB bandwidth, unlimited sites |
| **Total** | **$0/month** | Good for < 1000 users |

### Paid Tier (Production)

| Service | Plan | Cost |
|---------|------|------|
| Neon | Pro | $19/month |
| Render | Starter | $7/month |
| Vercel | Pro | $20/month |
| Sentry | Team | $26/month |
| Domain | .com | $12/year |
| **Total** | | **~$75/month** |

---

## Troubleshooting

### Common Issues

**"Cannot connect to database"**:
- Check DATABASE_URL format
- Verify SSL mode (sslmode=require)
- Check firewall rules
- Verify credentials

**"CORS error"**:
- Check FRONTEND_URL in backend
- Verify origin in CORS config
- Check credentials: true

**"Build failed"**:
- Check Node version (18+)
- Verify build command
- Check dependencies
- Review build logs

**"502 Bad Gateway"**:
- Check backend is running
- Verify health check endpoint
- Check environment variables
- Review application logs

### Support Resources

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Neon**: https://neon.tech/docs
- **Supabase**: https://supabase.com/docs

---

## Rollback Procedure

### Quick Rollback

**Vercel**:
```
Deployments → Previous deployment → Promote to Production
```

**Render**:
```
Dashboard → Manual Deploy → Select previous commit
```

**Database**:
```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

---

## Security Hardening

### Production Checklist

- [ ] Change all default passwords
- [ ] Enable 2FA on all accounts
- [ ] Restrict database access to backend IP
- [ ] Enable audit logging
- [ ] Set up monitoring alerts
- [ ] Configure rate limiting
- [ ] Enable HTTPS only
- [ ] Set security headers
- [ ] Regular security scans
- [ ] Backup strategy implemented

---

## Next Steps

1. **Deploy to staging first**
2. **Test thoroughly**
3. **Deploy to production**
4. **Monitor for 24 hours**
5. **Optimize based on metrics**
6. **Document any issues**
7. **Train team on deployment process**

---

**Last Updated**: 2024-01-01  
**Maintained By**: DevOps Team
