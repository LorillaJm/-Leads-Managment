# Netlify Deployment Guide - Frontend Only

## Step-by-Step Instructions

### Step 1: Sign Up / Log In to Netlify

1. Go to https://app.netlify.com
2. Sign up or log in (you can use GitHub account)

### Step 2: Import Your Project

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub account
4. Select your repository: **`LorillaJm/-Leads-Managment`**

### Step 3: Configure Build Settings

Netlify will auto-detect the `netlify.toml` file, but verify these settings:

- **Branch to deploy**: `main`
- **Build command**: (should auto-fill from netlify.toml)
  ```
  npm install && npm run build -w @lead-management/shared && npm run build -w @lead-management/web
  ```
- **Publish directory**: `apps/web/dist`
- **Base directory**: `/` (leave empty or root)

### Step 4: Add Environment Variables

1. Click **"Show advanced"** or go to **Site settings** → **Environment variables** after deployment
2. Add this variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `http://localhost:3001` (change this after deploying backend)

### Step 5: Deploy

1. Click **"Deploy site"**
2. Wait 3-5 minutes for the build to complete
3. You'll get a URL like: `https://random-name-123456.netlify.app`

### Step 6: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the instructions to configure your domain

---

## After Frontend Deployment

### Update API URL

Once you deploy your backend (see below), update the environment variable:

1. Go to **Site settings** → **Environment variables**
2. Edit `VITE_API_URL`
3. Change to your backend URL: `https://your-api.onrender.com`
4. Click **"Trigger deploy"** to rebuild with new variable

---

## Deploy Backend to Render.com

Since Netlify is for static sites, deploy your API to Render:

### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `leads-management-db`
   - **Database**: `leads_db`
   - **User**: `leads_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. **Copy the Internal Database URL** (starts with `postgresql://`)

### Step 2: Deploy Backend API

1. Click **"New +"** → **"Web Service"**
2. Connect GitHub: `LorillaJm/-Leads-Managment`
3. Configure:
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

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<paste-your-database-url>
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
   FRONTEND_URL=https://your-netlify-site.netlify.app
   ```

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for deployment
7. **Copy your API URL**: `https://leads-management-api.onrender.com`

### Step 3: Update Frontend Environment Variable

1. Go back to Netlify
2. **Site settings** → **Environment variables**
3. Update `VITE_API_URL` to your Render API URL
4. Click **"Trigger deploy"**

### Step 4: Update Backend CORS

1. Go to Render dashboard
2. Open `leads-management-api` service
3. **Environment** tab
4. Update `FRONTEND_URL` to your Netlify URL
5. Save (will trigger redeploy)

---

## Test Your Deployment

1. Visit your Netlify URL
2. Login with:
   - Email: `bydiloilo@gmail.com`
   - Password: `admin123`
3. Test all features

---

## Troubleshooting

### Build Fails on Netlify
- Check build logs in Netlify dashboard
- Verify `netlify.toml` is in repository root
- Ensure all dependencies are in `package.json`

### Frontend Can't Connect to API
- Check browser console (F12) for errors
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is running on Render

### API Returns 500 Error
- Check Render logs
- Verify `DATABASE_URL` is correct
- Ensure migrations ran successfully

---

## Important URLs

Save these after deployment:

- **Frontend (Netlify)**: `https://your-site.netlify.app`
- **Backend (Render)**: `https://leads-management-api.onrender.com`
- **Health Check**: `https://leads-management-api.onrender.com/api/v1/health`

---

## Cost

- **Netlify (Frontend)**: Free
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Continuous deployment
  
- **Render (Backend + Database)**: Free
  - API sleeps after 15 min inactivity
  - Database: 90 days free, then $7/month

**Total**: $0 for 90 days, then $7/month

---

## Quick Commands

### Redeploy Frontend
```bash
git add .
git commit -m "Update frontend"
git push
```
Netlify will auto-deploy on push to main branch.

### View Logs
- **Netlify**: Site → Deploys → Click deployment → View logs
- **Render**: Service → Logs tab

### Rollback
- **Netlify**: Deploys → Click old deployment → "Publish deploy"
- **Render**: Not available on free tier

---

## Next Steps

1. ✅ Deploy frontend to Netlify
2. ✅ Deploy backend to Render
3. ✅ Connect them with environment variables
4. Change default passwords
5. Update JWT secrets
6. Configure custom domain (optional)
7. Set up monitoring

---

## Support

If issues occur:
1. Check Netlify build logs
2. Check Render service logs
3. Check browser console (F12)
4. Verify all environment variables
5. Test API health endpoint directly
