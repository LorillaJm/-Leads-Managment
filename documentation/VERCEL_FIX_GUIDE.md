# Vercel Deployment Fix Guide

## What Was Fixed

The API was crashing because:
1. **Startup tasks** - The app was trying to run database migrations on every request (not suitable for serverless)
2. **Incorrect Vercel config** - The `vercel.json` wasn't properly configured for Express API
3. **Missing serverless export** - The Express app wasn't exported for Vercel's serverless functions

## Changes Made

### 1. Updated `apps/api/src/index.ts`
- Skips startup tasks (migrations/seeding) in production
- Exports the Express app for Vercel serverless
- Only runs migrations locally during development

### 2. Updated `vercel.json`
- Configured to use `@vercel/node` builder
- Routes all requests to the Express API
- Sets production environment

## Next Steps for Vercel Deployment

### Option 1: Redeploy on Vercel (Recommended)

Since your code is now pushed to GitHub, Vercel should automatically redeploy. Wait a few minutes and check your deployment.

### Option 2: Manual Database Setup

**IMPORTANT:** Your database needs to be set up before the API will work. You have two options:

#### A. Use Vercel Postgres (Recommended)
1. Go to your Vercel project dashboard
2. Click on "Storage" tab
3. Create a new Postgres database
4. Vercel will automatically add the `DATABASE_URL` environment variable
5. Run migrations manually:
   ```bash
   # Install Vercel CLI if you haven't
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link your project
   vercel link
   
   # Run migrations
   vercel env pull .env.local
   npx prisma db push
   ```

#### B. Use External Database (Neon, Supabase, etc.)
1. Create a PostgreSQL database on your preferred provider
2. Get the connection string
3. Add it to Vercel environment variables:
   - Go to Project Settings → Environment Variables
   - Add `DATABASE_URL` with your connection string
4. Redeploy the project

### Option 3: Use Render Instead (Alternative)

If Vercel continues to have issues, consider using Render which is better suited for Express APIs:

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Use these settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** `apps/api`
5. Add environment variables (DATABASE_URL, JWT_SECRET, etc.)
6. Deploy

## Environment Variables Needed

Make sure these are set in Vercel:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3001
```

## Testing After Deployment

Once deployed, test these endpoints:

1. **Health Check:**
   ```
   GET https://your-api.vercel.app/api/v1/health
   ```

2. **Login:**
   ```
   POST https://your-api.vercel.app/api/v1/auth/login
   ```

## Common Issues

### Issue: "FUNCTION_INVOCATION_FAILED"
- **Cause:** Missing environment variables or database not accessible
- **Fix:** Check Vercel logs and ensure DATABASE_URL is set

### Issue: "Database connection failed"
- **Cause:** Database not created or connection string incorrect
- **Fix:** Verify DATABASE_URL and ensure database is accessible from Vercel

### Issue: "Prisma Client not generated"
- **Cause:** Build process didn't generate Prisma client
- **Fix:** Add `prisma generate` to your build command

## Recommended: Update package.json

Add this to `apps/api/package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && tsc",
    "vercel-build": "prisma generate && tsc"
  }
}
```

This ensures Prisma client is generated during Vercel builds.
