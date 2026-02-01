# 🚀 Start Servers - Quick Guide

## ✅ All Errors Fixed!

All TypeScript compilation errors have been resolved. The API should now start successfully.

## 📝 How to Start

### Option 1: Manual Start (Recommended)

**Terminal 1 - API Server:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Web Server:**
```bash
cd apps/web
npm run dev
```

### Option 2: From Root

**Terminal 1 - API:**
```bash
npm run api:dev
```

**Terminal 2 - Web:**
```bash
npm run web:dev
```

## ✅ What Was Fixed

1. ✅ Updated all `UserRole.MANAGEMENT` → `UserRole.ADMIN`
2. ✅ Updated all `UserRole.SALES_CONSULTANT` → `UserRole.SC`
3. ✅ Updated all `firstName`/`lastName` → `fullName` in user selections
4. ✅ Fixed API client to filter out undefined query params
5. ✅ Fixed Users page to only pass defined values

## 🔐 Login Credentials

**Admin Account:**
- Email: `bydiloilo@gmail.com`
- Password: `admin123`

**Sales Consultant Accounts:**
- Email: `john.doe@byd.com`
- Password: `Password123!`

## 🎯 Expected Output

**API Server (Terminal 1):**
```
🚀 Server running on port 3001
📊 Health check: http://localhost:3001/api/v1/health
🔒 Environment: development
```

**Web Server (Terminal 2):**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 🌐 Access the Application

Once both servers are running:
1. Open: http://localhost:5173
2. Login with your admin credentials
3. You're ready to go! 🎉

## 🐛 If You Still Get Errors

1. **Kill all node processes:**
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Clear node_modules and reinstall:**
   ```bash
   rm -rf node_modules apps/*/node_modules
   npm install
   npm run shared:build
   ```

3. **Restart servers**

---

**Status:** ✅ Ready to Start
**Last Updated:** February 1, 2026
