# ⚠️ IMPORTANT: Vercel Deployment Configuration

## Current Status

Your API is now configured for Vercel serverless deployment. However, **you need to configure your Vercel project settings**.

## Required Vercel Project Settings

### 1. Root Directory
Go to your Vercel project settings and set:
- **Root Directory:** Leave as `.` (root) or blank
- **Framework Preset:** Other

### 2. Build & Development Settings
- **Build Command:** `npm install && npm run build --workspace=@lead-management/api && npm run db:generate --workspace=@lead-management/api`
- **Output Directory:** Leave blank (we're using serverless functions)
- **Install Command:** `npm install`

### 3. Environment Variables (CRITICAL!)

Add these in Vercel Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
PORT=3001
```

**Important:** Without `DATABASE_URL`, your API will crash!

## Database Options

### Option 1: Vercel Postgres (Recommended - Easiest)
1. In your Vercel project, go to the **Storage** tab
2. Click **Create Database** → **Postgres**
3. Follow the setup wizard
4. Vercel automatically adds `DATABASE_URL` to your environment variables
5. Redeploy your project

### Option 2: Neon (Free PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account and database
3. Copy the connection string
4. Add it as `DATABASE_URL` in Vercel environment variables
5. Redeploy

### Option 3: Supabase (Free PostgreSQL)
1. Go to [supabase.com](https://supabase.com)
2. Create a project
3. Go to Project Settings → Database
4. Copy the connection string (use "Connection pooling" for serverless)
5. Add it as `DATABASE_URL` in Vercel environment variables
6. Redeploy

## After Setting Up Database

### Initialize Database Schema

You need to run migrations once. Choose one method:

#### Method A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
cd apps/api
npx prisma db push

# Seed database (optional)
npm run db:seed
```

#### Method B: Using Local Connection
```bash
# Set your DATABASE_URL locally
export DATABASE_URL="your-vercel-postgres-url"

# Or on Windows
set DATABASE_URL=your-vercel-postgres-url

# Run migrations
cd apps/api
npx prisma db push

# Seed database
npm run db:seed
```

## Testing Your Deployment

Once deployed and database is set up, test these endpoints:

### 1. Health Check
```bash
curl https://your-project.vercel.app/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Login (after seeding)
```bash
curl -X POST https://your-project.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

## Common Issues & Solutions

### Issue: "FUNCTION_INVOCATION_FAILED"
**Cause:** Missing environment variables or database connection failed  
**Solution:** 
- Check Vercel logs: Project → Deployments → Click deployment → View Function Logs
- Verify `DATABASE_URL` is set correctly
- Ensure database is accessible from Vercel

### Issue: "Prisma Client not initialized"
**Cause:** Prisma client wasn't generated during build  
**Solution:** 
- Check build logs to ensure `prisma generate` ran
- Redeploy the project

### Issue: "Database connection timeout"
**Cause:** Database not accessible or wrong connection string  
**Solution:**
- If using external database, ensure it allows connections from Vercel IPs
- Use connection pooling for serverless (Supabase/Neon provide this)
- Check if database is running

### Issue: "Cannot find module"
**Cause:** Dependencies not installed correctly  
**Solution:**
- Clear Vercel build cache: Project Settings → General → Clear Build Cache
- Redeploy

## Alternative: Deploy to Render Instead

If Vercel continues to have issues, **Render is better suited for Express APIs**:

### Why Render?
- ✅ Better for traditional Node.js/Express apps
- ✅ Includes free PostgreSQL database
- ✅ No serverless limitations
- ✅ Simpler configuration

### Quick Render Setup
1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install && npm run build && npm run db:generate`
   - **Start Command:** `npm start`
5. Add environment variables
6. Deploy!

See `RENDER_DEPLOYMENT_GUIDE.md` for detailed Render instructions.

## Vercel Limitations for Express APIs

⚠️ **Important to know:**

1. **10-second timeout** - Serverless functions have a 10-second execution limit on free tier
2. **Cold starts** - First request after inactivity will be slower
3. **No persistent connections** - Database connections are created per request
4. **No background jobs** - Can't run scheduled tasks or cron jobs

If you need these features, consider using **Render** or **Railway** instead.

## Next Steps

1. ✅ Set up database (Vercel Postgres, Neon, or Supabase)
2. ✅ Add environment variables in Vercel
3. ✅ Wait for automatic redeploy
4. ✅ Run database migrations
5. ✅ Test the API endpoints
6. ✅ Update your frontend API URL to point to Vercel

## Need Help?

Check the Vercel deployment logs:
1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Deployments**
4. Click on the latest deployment
5. Check **Build Logs** and **Function Logs**

The logs will show you exactly what's failing.
