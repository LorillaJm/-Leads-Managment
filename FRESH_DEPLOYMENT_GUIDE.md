# Fresh Deployment Guide - Start from Scratch

## Overview
- **Frontend (Vercel)**: React app at `apps/web`
- **Backend (Render.com)**: Node.js API at `apps/api`
- **Database (Render.com)**: PostgreSQL

---

## Part 1: Deploy Backend API to Render.com

### Step 1: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `leads-management-db`
   - **Database**: `leads_db`
   - **User**: `leads_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgresql://`)
   - Save this - you'll need it in the next step

### Step 2: Deploy Backend API to Render

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `LorillaJm/-Leads-Managment`
3. Configure the service:
   - **Name**: `leads-management-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `apps/api`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```
     npm install && npm run build && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**: 
     ```
     npm start
     ```
   - **Plan**: Free

4. **Environment Variables** - Click "Advanced" and add these:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-too
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. **Copy your API URL**: `https://leads-management-api.onrender.com`

### Step 3: Test Your API

Once deployed, test the health endpoint:
```
https://leads-management-api.onrender.com/api/v1/health
```

You should see:
```json
{
  "success": true,
  "message": "API is healthy",
  "database": "connected"
}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Delete Old Vercel Project

1. Go to https://vercel.com/dashboard
2. Find `leads-management-api` project
3. Settings → Delete Project

### Step 2: Create New Vercel Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `LorillaJm/-Leads-Managment`
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `apps/web` ← IMPORTANT!
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** - Add this:
   ```
   VITE_API_URL=https://leads-management-api.onrender.com
   ```
   (Use the URL from Part 1, Step 2)

5. Click **"Deploy"**
6. Wait for deployment (2-3 minutes)
7. **Copy your frontend URL**: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Open your `leads-management-api` service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to your actual Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Save changes (this will trigger a redeploy)

---

## Part 3: Seed Database

### Option A: Using Render Shell (Recommended)

1. In Render dashboard, open your `leads-management-api` service
2. Click **"Shell"** tab
3. Run:
   ```bash
   npm run db:seed
   ```

### Option B: Using Local Machine

1. Update your local `.env` file with production database URL:
   ```
   DATABASE_URL=<production-database-url-from-render>
   ```
2. Run:
   ```bash
   cd apps/api
   npm run db:seed
   ```

---

## Part 4: Test Everything

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Login with**:
   - Email: `bydiloilo@gmail.com`
   - Password: `admin123`
3. **Test features**:
   - Dashboard loads
   - Leads page works
   - Activities page works
   - User management works

---

## Troubleshooting

### API Returns 500 Error
- Check Render logs: Service → Logs tab
- Verify DATABASE_URL is correct
- Ensure migrations ran successfully

### Frontend Can't Connect to API
- Check browser console for CORS errors
- Verify VITE_API_URL in Vercel environment variables
- Ensure FRONTEND_URL is set correctly in Render

### Database Connection Failed
- Verify DATABASE_URL format
- Check database is running in Render
- Ensure you're using the **Internal Database URL**

### Build Fails
- Check build logs in Render/Vercel
- Verify all dependencies are in package.json
- Ensure Node version compatibility

---

## Important URLs to Save

After deployment, save these:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://leads-management-api.onrender.com`
- **Database**: (Internal URL in Render)
- **Health Check**: `https://leads-management-api.onrender.com/api/v1/health`

---

## Cost

- **Render (API + Database)**: Free tier
  - API sleeps after 15 min of inactivity (wakes up in ~30 seconds)
  - Database: 90 days free, then $7/month
- **Vercel (Frontend)**: Free tier
  - Unlimited bandwidth
  - Automatic HTTPS

**Total**: $0 for first 90 days, then $7/month

---

## Next Steps

1. Change default passwords
2. Update JWT secrets to strong random values
3. Configure custom domain (optional)
4. Set up monitoring/alerts
5. Enable automated backups

---

## Support

If you encounter issues:
1. Check Render logs (Service → Logs)
2. Check Vercel deployment logs
3. Check browser console (F12)
4. Verify all environment variables are set correctly
