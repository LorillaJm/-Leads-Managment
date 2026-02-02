# 🚀 Deploy Backend to Render.com - Step by Step Guide

## Prerequisites
- GitHub account with your repository
- Render.com account (free - sign up at https://render.com)

---

## Step 1: Create a PostgreSQL Database on Render

### 1.1 Go to Render Dashboard
1. Visit https://render.com and sign in
2. Click **"New +"** button in the top right
3. Select **"PostgreSQL"**

### 1.2 Configure Database
Fill in the following:
- **Name**: `lead-management-db`
- **Database**: `lead_management` (or leave default)
- **User**: `lead_user` (or leave default)
- **Region**: Choose closest to you (e.g., Oregon)
- **PostgreSQL Version**: 16 (latest)
- **Plan**: **Free** (select the free tier)

### 1.3 Create Database
1. Click **"Create Database"**
2. Wait 2-3 minutes for database to be created
3. Once ready, you'll see the database dashboard

### 1.4 Copy Connection String
1. On the database page, scroll down to **"Connections"**
2. Find **"Internal Database URL"** (this is important!)
3. Click the **copy icon** to copy the full connection string
4. It looks like: `postgresql://user:password@hostname/database`
5. **Save this somewhere safe** - you'll need it in Step 3

---

## Step 2: Create Web Service for API

### 2.1 Create New Web Service
1. Go back to Render Dashboard
2. Click **"New +"** button
3. Select **"Web Service"**

### 2.2 Connect GitHub Repository
1. Click **"Connect account"** if not connected
2. Select **"GitHub"**
3. Authorize Render to access your repositories
4. Find and select: **`LorillaJm/-Leads-Managment`**
5. Click **"Connect"**

### 2.3 Configure Web Service
Fill in these settings:

**Basic Settings:**
- **Name**: `lead-management-api`
- **Region**: Same as your database (e.g., Oregon)
- **Branch**: `main`
- **Root Directory**: `apps/api` ⚠️ **IMPORTANT!**
- **Runtime**: `Node`
- **Build Command**: (Copy exactly, no extra spaces)
  ```
  npm install && npx prisma generate && npm run build
  ```
  ⚠️ **IMPORTANT**: If you see "bash" before the command, delete it!
- **Start Command**: 
  ```
  npm start
  ```

**Instance Type:**
- Select **"Free"** plan

### 2.4 Scroll Down - Don't Click Create Yet!
We need to add environment variables first.

---

## Step 3: Add Environment Variables

### 3.1 In the Environment Variables Section
Click **"Add Environment Variable"** and add these one by one:

#### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Paste the Internal Database URL you copied in Step 1.4
- Example: `postgresql://user:password@hostname/database`

#### Variable 2: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: Generate a random string (32+ characters)
- You can use: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
- Or run in terminal: `openssl rand -base64 32`

#### Variable 3: JWT_REFRESH_SECRET
- **Key**: `JWT_REFRESH_SECRET`
- **Value**: Generate another different random string
- Use the same method as above

#### Variable 4: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`

#### Variable 5: PORT
- **Key**: `PORT`
- **Value**: `10000`

### 3.2 Verify All Variables
Make sure you have all 5 environment variables:
- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ JWT_REFRESH_SECRET
- ✅ NODE_ENV
- ✅ PORT

---

## Step 4: Deploy!

### 4.1 Create Web Service
1. Scroll to the bottom
2. Click **"Create Web Service"**
3. Render will start building your API

### 4.2 Wait for Build
- This takes 5-10 minutes
- You'll see logs in real-time
- Watch for:
  - ✅ Installing dependencies
  - ✅ Generating Prisma client
  - ✅ Building TypeScript
  - ✅ Starting server

### 4.3 Check Build Status
- If successful: You'll see **"Live"** with a green dot
- If failed: Check the logs for errors (see Troubleshooting below)

---

## Step 5: Run Database Migrations

### 5.1 Open Shell
1. On your web service page, click **"Shell"** tab (top right)
2. Click **"Launch Shell"**
3. Wait for terminal to open

### 5.2 Run Migrations
In the shell, run:
```bash
npx prisma migrate deploy
```

Wait for migrations to complete. You should see:
```
✔ Migrations applied successfully
```

### 5.3 Seed Database
Still in the shell, run:
```bash
npm run db:seed
```

You should see:
```
✅ Database seeded successfully
Admin user: bydiloilo@gmail.com / admin123
```

### 5.4 Close Shell
Click the X to close the shell.

---

## Step 6: Test Your API

### 6.1 Get Your API URL
1. On your web service page, look for the URL at the top
2. It looks like: `https://lead-management-api.onrender.com`
3. Copy this URL

### 6.2 Test Health Endpoint
1. Open a new browser tab
2. Go to: `https://your-api-url.onrender.com/api/v1/health`
3. You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-02-01T..."
}
```

### 6.3 Test Login Endpoint
Use a tool like Postman or curl:
```bash
curl -X POST https://your-api-url.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bydiloilo@gmail.com","password":"admin123"}'
```

You should get a response with user data and tokens.

---

## Step 7: Update Frontend on Vercel

### 7.1 Go to Vercel Dashboard
1. Visit https://vercel.com
2. Go to your project
3. Click **"Settings"**

### 7.2 Update Environment Variable
1. Click **"Environment Variables"**
2. Find `VITE_API_URL`
3. Click **"Edit"**
4. Change value to: `https://your-api-url.onrender.com`
   - Example: `https://lead-management-api.onrender.com`
   - ⚠️ **NO trailing slash!**
   - ⚠️ **NO /api/v1 at the end!**
5. Click **"Save"**

### 7.3 Redeploy Frontend
1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## Step 8: Test Complete Application

### 8.1 Visit Your Frontend
1. Go to your Vercel URL: `https://your-project.vercel.app`
2. You should now see the login page (not the deployment info page)

### 8.2 Login
- Email: `bydiloilo@gmail.com`
- Password: `admin123`

### 8.3 Test Features
- ✅ Dashboard loads with data
- ✅ Can create/view leads
- ✅ Can manage users (if admin)
- ✅ All features working!

---

## 🎉 Congratulations!

Your full-stack application is now deployed:
- ✅ Frontend on Vercel
- ✅ Backend API on Render
- ✅ Database on Render PostgreSQL

**Your URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-api-url.onrender.com`

---

## 📊 Important Notes

### Free Tier Limitations
- **Render Free Tier**: API will spin down after 15 minutes of inactivity
- **First request after sleep**: Takes 30-60 seconds to wake up
- **Database**: 90 days free, then $7/month
- **Upgrade to paid**: $7/month for always-on API

### CORS Configuration
The API is already configured to accept requests from any origin in production. If you need to restrict it:
1. Edit `apps/api/src/index.ts`
2. Update the CORS configuration
3. Redeploy

### Database Backups
- Render automatically backs up your database
- Free tier: 7 days retention
- Paid tier: 30 days retention

---

## 🔧 Troubleshooting

### Build Failed
**Check logs for:**
- Missing dependencies: Run `npm install` locally first
- TypeScript errors: Run `npm run build` locally
- Prisma errors: Check `schema.prisma` file
- **"bash npm" error**: Remove "bash" from build command

**Common fixes:**
- Make sure Root Directory is set to `apps/api`
- Verify all environment variables are set
- Check that DATABASE_URL is the Internal URL (not External)
- **Build command should NOT have "bash" prefix**
- Build command: `npm install && npx prisma generate && npm run build`

### API Not Responding
1. Check service status (should be "Live")
2. Check logs for errors
3. Verify DATABASE_URL is correct
4. Try restarting the service

### Database Connection Failed
1. Make sure you used **Internal Database URL**
2. Check database is running (green dot)
3. Verify DATABASE_URL format: `postgresql://user:pass@host/db`

### Migrations Failed
1. Make sure database is empty or compatible
2. Try: `npx prisma migrate reset` (⚠️ deletes all data)
3. Then: `npx prisma migrate deploy`

### Frontend Can't Connect
1. Verify VITE_API_URL has no trailing slash
2. Check API is responding at `/api/v1/health`
3. Check browser console for CORS errors
4. Verify API URL is correct in Vercel

---

## 🆘 Need Help?

1. **Check Render Logs**: Web Service → Logs tab
2. **Check Database**: PostgreSQL → Logs tab
3. **Test API Directly**: Use Postman or curl
4. **Check Frontend Console**: Browser DevTools → Console

---

## 📈 Next Steps

### Optional Improvements
1. **Custom Domain**: Add your own domain in Render
2. **Monitoring**: Set up health checks and alerts
3. **Upgrade Plan**: For always-on API ($7/month)
4. **SSL Certificate**: Automatically provided by Render
5. **CI/CD**: Auto-deploy on git push (already configured!)

### Security Recommendations
1. Change default admin password after first login
2. Rotate JWT secrets periodically
3. Enable 2FA for Render account
4. Review and restrict CORS if needed
5. Set up database backups

---

**Deployment Complete! 🚀**

Your Lead Management System is now live and ready to use!
