# Vercel Deployment Guide

## Frontend Deployment (Vercel)

The frontend React app can be deployed to Vercel.

### Configuration

The `vercel.json` file is already configured with:
- Build command: `cd apps/web && npm install && npm run build`
- Output directory: `apps/web/dist`
- Install command: `npm install --prefix apps/web`

### Steps to Deploy

1. **Push to GitHub** (Already done ✅)
   ```bash
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository: `LorillaJm/-Leads-Managment`

3. **Configure Project Settings**
   - Framework Preset: `Other`
   - Root Directory: Leave as `.` (root)
   - Build Command: `cd apps/web && npm install && npm run build`
   - Output Directory: `apps/web/dist`
   - Install Command: `npm install --prefix apps/web`

4. **Environment Variables**
   Add the following environment variable:
   ```
   VITE_API_URL=https://your-api-url.com/api/v1
   ```
   
   **Note:** You'll need to deploy the API separately (see Backend Deployment below)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your frontend will be live at `https://your-project.vercel.app`

## Backend Deployment (Separate Service)

The backend API needs to be deployed separately. Options:

### Option 1: Railway.app (Recommended)
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select the `apps/api` directory
4. Add environment variables:
   ```
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   PORT=3001
   NODE_ENV=production
   ```
5. Deploy

### Option 2: Render.com
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Root Directory: `apps/api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables (same as above)
6. Deploy

### Option 3: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create your-api-name`
3. Set buildpacks:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```
4. Add environment variables:
   ```bash
   heroku config:set DATABASE_URL=your-database-url
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
   heroku config:set NODE_ENV=production
   ```
5. Deploy:
   ```bash
   git subtree push --prefix apps/api heroku main
   ```

## Database Setup

For production, you'll need a PostgreSQL database. Options:

### Option 1: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Use this as your `DATABASE_URL`

### Option 2: Railway PostgreSQL
1. In your Railway project, add PostgreSQL plugin
2. Copy the connection string
3. Use as `DATABASE_URL`

### Option 3: Neon (Serverless PostgreSQL)
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Get connection string
4. Use as `DATABASE_URL`

## Post-Deployment Steps

1. **Update Frontend Environment Variable**
   - In Vercel, update `VITE_API_URL` to your deployed API URL
   - Redeploy frontend

2. **Run Database Migrations**
   ```bash
   # SSH into your API server or run locally with production DB
   npx prisma migrate deploy
   ```

3. **Seed Database**
   ```bash
   npx prisma db seed
   ```

4. **Test the Application**
   - Visit your Vercel URL
   - Login with: bydiloilo@gmail.com / admin123
   - Test all features

## Troubleshooting

### Build Fails on Vercel
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` configuration

### API Connection Issues
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in API
- Ensure API is deployed and running

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database is accessible from API server
- Ensure SSL is configured if required

## Architecture

```
┌─────────────────┐
│   Vercel        │
│   (Frontend)    │
│   React + Vite  │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Railway/      │
│   Render        │
│   (Backend API) │
│   Node.js       │
└────────┬────────┘
         │
         │ PostgreSQL
         │
┌────────▼────────┐
│   Supabase/     │
│   Railway       │
│   (Database)    │
│   PostgreSQL    │
└─────────────────┘
```

## Cost Estimate

- **Vercel (Frontend)**: Free tier (Hobby plan)
- **Railway (Backend)**: ~$5/month (with database)
- **Supabase (Database)**: Free tier available
- **Total**: $0-5/month for small projects

## Support

For issues, check:
- Vercel deployment logs
- API server logs
- Database connection status
- Browser console for frontend errors
