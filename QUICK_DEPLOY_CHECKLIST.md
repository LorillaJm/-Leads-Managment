# ⚡ Quick Deploy Checklist

## 📋 Before You Start
- [ ] GitHub repository pushed
- [ ] Render.com account created (free)
- [ ] 15-20 minutes available

---

## 🗄️ Step 1: Create Database (5 min)
1. Go to https://render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Name: `lead-management-db`
4. Plan: **Free**
5. Click **"Create Database"**
6. **Copy Internal Database URL** (save it!)

---

## 🚀 Step 2: Create API Service (10 min)
1. Click **"New +"** → **"Web Service"**
2. Connect GitHub: `LorillaJm/-Leads-Managment`
3. Configure:
   - Name: `lead-management-api`
   - Root Directory: **`apps/api`** ⚠️
   - Build: `npm install && npx prisma generate && npm run build`
   - Start: `npm start`
   - Plan: **Free**

4. Add Environment Variables:
   ```
   DATABASE_URL = [paste from Step 1]
   JWT_SECRET = [random 32+ chars]
   JWT_REFRESH_SECRET = [random 32+ chars]
   NODE_ENV = production
   PORT = 10000
   ```

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for build

---

## 🔧 Step 3: Setup Database (2 min)
1. Click **"Shell"** tab → **"Launch Shell"**
2. Run:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
3. Close shell

---

## ✅ Step 4: Test API (1 min)
Visit: `https://your-api-url.onrender.com/api/v1/health`

Should see: `{"status":"ok"}`

---

## 🌐 Step 5: Update Frontend (2 min)
1. Go to Vercel dashboard
2. Settings → Environment Variables
3. Edit `VITE_API_URL`:
   ```
   https://your-api-url.onrender.com
   ```
4. Deployments → Redeploy

---

## 🎉 Done!
Visit your Vercel URL and login:
- Email: `bydiloilo@gmail.com`
- Password: `admin123`

---

## 🆘 Quick Troubleshooting

**Build Failed?**
- Check Root Directory is `apps/api`
- Verify all 5 environment variables

**Can't Connect?**
- Use **Internal** Database URL (not External)
- Check API is "Live" (green dot)

**Frontend Still Shows Info Page?**
- Verify VITE_API_URL has no trailing slash
- Redeploy frontend after changing env var

---

## 📚 Full Guide
See `RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions.
