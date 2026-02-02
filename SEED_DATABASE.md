# 🌱 Seed Database Guide

## Wait for Deployment

First, make sure the latest deployment is complete:
1. Go to Render dashboard: https://dashboard.render.com
2. Check that your API service shows **"Live"** (green dot)
3. Wait until the latest deployment finishes (about 2-3 minutes)

---

## Seed the Database

Once deployment is complete, run this command in PowerShell:

```powershell
Invoke-RestMethod -Uri "https://lead-management-api-0e31.onrender.com/api/v1/seed/seed" -Method Post -ContentType "application/json"
```

You should see:
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "admin": {
    "email": "bydiloilo@gmail.com",
    "fullName": "Admin User",
    "credentials": {
      "email": "bydiloilo@gmail.com",
      "password": "admin123"
    }
  }
}
```

---

## Test Login

After seeding, test the login:

```powershell
$body = '{"email":"bydiloilo@gmail.com","password":"admin123"}'
Invoke-RestMethod -Uri "https://lead-management-api-0e31.onrender.com/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json"
```

You should get a response with:
- User data (id, email, fullName, role)
- Access token
- Refresh token

---

## Update Frontend

Once login works, update your Vercel frontend:

1. Go to Vercel dashboard: https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_URL`
5. Edit and set to: `https://lead-management-api-0e31.onrender.com`
   - ⚠️ NO trailing slash!
6. Save
7. Go to **Deployments** → Redeploy latest

---

## Test Complete Application

1. Visit your Vercel URL
2. You should see the login page (not deployment info)
3. Login with:
   - Email: `bydiloilo@gmail.com`
   - Password: `admin123`
4. Dashboard should load with all features working!

---

## 🎉 Done!

Your full-stack application is now fully deployed and working!
