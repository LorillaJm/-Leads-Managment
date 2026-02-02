# Database Setup Guide

## Quick Start: Get a Free PostgreSQL Database

Your app currently uses SQLite (`file:./dev.db`) but needs PostgreSQL for production deployment.

### Option 1: Neon (Recommended - Fastest Setup)

**Why Neon?**
- ✅ Free tier with 0.5GB storage
- ✅ Serverless PostgreSQL (perfect for Vercel)
- ✅ No credit card required
- ✅ Instant setup

**Steps:**
1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" (use GitHub for fastest signup)
3. Create a new project:
   - Name: `lead-management`
   - Region: Choose closest to you
4. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
5. Update your `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```
6. Run migrations:
   ```bash
   cd apps/api
   npx prisma db push
   npm run db:seed
   ```

### Option 2: Supabase (Includes Auth & Storage)

**Why Supabase?**
- ✅ Free tier with 500MB storage
- ✅ Includes authentication, storage, and more
- ✅ Great dashboard and tools

**Steps:**
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Wait for database to initialize (~2 minutes)
4. Go to **Project Settings** → **Database**
5. Scroll to **Connection string** → **Connection pooling** (important for serverless!)
6. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password
7. Update your `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres"
   ```
8. Run migrations:
   ```bash
   cd apps/api
   npx prisma db push
   npm run db:seed
   ```

### Option 3: Render (Includes Free Hosting)

**Why Render?**
- ✅ Free PostgreSQL database
- ✅ Can also host your API on Render (easier than Vercel for Express)
- ✅ 90 days free, then $7/month

**Steps:**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New** → **PostgreSQL**
4. Configure:
   - Name: `lead-management-db`
   - Database: `lead_management`
   - User: `lead_user`
   - Region: Choose closest
   - Plan: **Free**
5. Click **Create Database**
6. Copy the **External Database URL** (not Internal)
7. Update your `.env` file:
   ```env
   DATABASE_URL="postgresql://lead_user:xxx@dpg-xxx.oregon-postgres.render.com/lead_management"
   ```
8. Run migrations:
   ```bash
   cd apps/api
   npx prisma db push
   npm run db:seed
   ```

### Option 4: Local PostgreSQL (Development Only)

**For local development:**

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install with default settings (remember the password!)
3. Open pgAdmin or command line
4. Create database:
   ```sql
   CREATE DATABASE lead_management;
   ```
5. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:your-password@localhost:5432/lead_management?schema=public"
   ```
6. Run migrations:
   ```bash
   cd apps/api
   npx prisma db push
   npm run db:seed
   ```

**Using Docker (All platforms):**
```bash
# Start PostgreSQL in Docker
docker run --name postgres-lead-mgmt -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=lead_management -p 5432:5432 -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lead_management?schema=public"

# Run migrations
cd apps/api
npx prisma db push
npm run db:seed
```

## After Setting Up Database

### 1. Test Connection
```bash
cd apps/api
npx prisma db push
```

If successful, you'll see:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

### 2. Seed Database
```bash
npm run db:seed
```

This creates:
- Admin user: `admin@example.com` / `Admin123!`
- Sample sales consultants
- Sample leads and activities

### 3. Start Development Server
```bash
# From root directory
npm run dev
```

### 4. For Vercel Deployment

After setting up your database:

1. Copy your `DATABASE_URL`
2. Go to Vercel project → **Settings** → **Environment Variables**
3. Add:
   - Key: `DATABASE_URL`
   - Value: Your PostgreSQL connection string
   - Environment: Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your project

## Troubleshooting

### Error: "Can't reach database server"
- Check if your IP is whitelisted (Neon/Supabase usually allow all IPs)
- Verify the connection string is correct
- Check if database is running

### Error: "SSL connection required"
- Add `?sslmode=require` to the end of your connection string
- Example: `postgresql://user:pass@host/db?sslmode=require`

### Error: "Password authentication failed"
- Double-check your password in the connection string
- Make sure there are no special characters that need URL encoding
- Use `%40` for `@`, `%23` for `#`, etc.

### Error: "Database does not exist"
- Create the database first in your PostgreSQL provider
- Or use the default database name provided by your host

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?[parameters]
```

Example:
```
postgresql://myuser:mypassword@localhost:5432/lead_management?schema=public&sslmode=require
```

## Security Notes

⚠️ **Never commit your `.env` file to Git!**

- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template
- Each developer should have their own `.env` file
- Use different databases for development and production

## Need Help?

If you're stuck:
1. Check the error message carefully
2. Verify your connection string format
3. Test connection using a database client (pgAdmin, DBeaver, etc.)
4. Check your database provider's documentation

## Recommended: Neon for Vercel

If deploying to Vercel, I strongly recommend **Neon** because:
- Serverless-native (no connection pooling issues)
- Free tier is generous
- Automatic scaling
- Built for serverless platforms like Vercel
