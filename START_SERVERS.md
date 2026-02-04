# 🚀 How to Start the Servers

## Quick Start (Automated)

### Option 1: Use the Batch File (Easiest)
1. Double-click `start-dev.bat` in the root folder
2. Two command windows will open automatically
3. Wait for both servers to start (about 30 seconds)
4. Open browser to `http://localhost:5173`

---

## Manual Start (Step by Step)

### Step 1: Start Backend API

1. **Open Command Prompt or PowerShell**
2. **Navigate to API folder**:
   ```bash
   cd apps\api
   ```

3. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

4. **Start the API server**:
   ```bash
   npm run dev
   ```

5. **Wait for this message**:
   ```
   🚀 Server running on port 3001
   ```

**Keep this window open!** The API must stay running.

---

### Step 2: Start Frontend

1. **Open a NEW Command Prompt or PowerShell** (don't close the API window!)
2. **Navigate to web folder**:
   ```bash
   cd apps\web
   ```

3. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

4. **Start the frontend server**:
   ```bash
   npm run dev
   ```

5. **Wait for this message**:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ```

**Keep this window open too!**

---

### Step 3: Access the Application

1. **Open your browser**
2. **Go to**: `http://localhost:5173`
3. **You should see the login page**

---

## Default Login Credentials

**Admin Account**:
- Email: `admin@example.com` or `admin@byd.com`
- Password: `admin123`

**Sales Consultant**:
- Email: `consultant@example.com`
- Password: `consultant123`

---

## Troubleshooting

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Problem**: Backend API is not running

**Solution**:
1. Check if the API window is open and running
2. Look for "Server running on port 3001" message
3. If not running, restart the API:
   ```bash
   cd apps\api
   npm run dev
   ```

### Error: "Port 3001 is already in use"

**Problem**: Another process is using port 3001

**Solution**:
```bash
# Find the process
netstat -ano | findstr :3001

# Kill the process (replace <PID> with the number from above)
taskkill /PID <PID> /F

# Then restart the API
cd apps\api
npm run dev
```

### Error: "Port 5173 is already in use"

**Problem**: Another process is using port 5173

**Solution**:
```bash
# Find the process
netstat -ano | findstr :5173

# Kill the process (replace <PID> with the number from above)
taskkill /PID <PID> /F

# Then restart the frontend
cd apps\web
npm run dev
```

### Error: "Cannot find module" or "Module not found"

**Problem**: Dependencies not installed

**Solution**:
```bash
# In API folder
cd apps\api
npm install

# In Web folder
cd apps\web
npm install
```

### Error: "Database connection failed"

**Problem**: Database not set up or connection issue

**Solution**:
```bash
cd apps\api

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with sample data
npm run db:seed
```

### Login page shows but login fails

**Problem**: API not responding or database not set up

**Solution**:
1. Check API window for errors
2. Verify API is running on port 3001
3. Check database is set up (see above)
4. Try accessing `http://localhost:3001/api/v1/health` in browser
   - Should show: `{"status":"ok"}`

---

## Verification Checklist

Before trying to login, verify:

- [ ] Backend API window is open and shows "Server running on port 3001"
- [ ] Frontend window is open and shows "Local: http://localhost:5173/"
- [ ] Browser can access `http://localhost:5173` (shows login page)
- [ ] Browser can access `http://localhost:3001/api/v1/health` (shows `{"status":"ok"}`)
- [ ] No error messages in either terminal window
- [ ] Database is set up (ran `npm run db:push` and `npm run db:seed`)

---

## Quick Commands Reference

### Start API
```bash
cd apps\api
npm run dev
```

### Start Frontend
```bash
cd apps\web
npm run dev
```

### Setup Database
```bash
cd apps\api
npm run db:generate
npm run db:push
npm run db:seed
```

### Check API Health
Open browser: `http://localhost:3001/api/v1/health`

### Stop Servers
Press `Ctrl+C` in each terminal window

---

## Visual Guide

### What You Should See

**API Terminal**:
```
> @lead-management/api@1.0.0 dev
> tsx watch src/index.ts

🚀 Server running on port 3001
📊 Environment: development
```

**Frontend Terminal**:
```
> @lead-management/web@0.0.0 dev
> vite

  VITE v5.x.x  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Browser** (http://localhost:5173):
- Should show the login page
- No error messages in console (F12)

---

## Need More Help?

1. Check both terminal windows for error messages
2. Press F12 in browser to see console errors
3. Verify all environment variables in `.env` files
4. Try restarting both servers
5. Check [LOCAL_DEVELOPMENT_GUIDE.md](LOCAL_DEVELOPMENT_GUIDE.md) for detailed troubleshooting

---

## Success! 🎉

Once both servers are running and you can login:
- You'll see the new dashboard at `/`
- Use filters on the left to filter data
- Click table headers to sort
- Enjoy the new professional dashboard!

---

**Last Updated**: February 4, 2026
