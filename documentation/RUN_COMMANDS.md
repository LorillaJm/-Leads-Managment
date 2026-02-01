# 🎯 Exact Commands to Run - Admin User Management

## Copy-Paste Ready Commands

### Step 1: Setup PostgreSQL Database

```bash
# Create database (run in Command Prompt or PowerShell)
psql -U postgres -c "CREATE DATABASE lead_management;"
```

If you need to set a password for postgres user:
```bash
psql -U postgres -c "ALTER USER postgres PASSWORD 'your_password';"
```

### Step 2: Configure Environment

```bash
# Copy environment file
copy .env.example .env
```

Then edit `.env` file and update this line:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lead_management?schema=public"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### Step 3: Install Dependencies

```bash
# Install all packages
npm install

# Build shared package
npm run shared:build
```

### Step 4: Database Migration

```bash
# Generate Prisma client and run migration
npm run db:migrate -w apps/api
```

When prompted for migration name, type:
```
add_user_management
```

### Step 5: Seed Database

```bash
# Seed with test data
npm run db:seed -w apps/api
```

**Expected Output:**
```
🌱 Starting database seed...
🗑️  Clearing existing data...
👤 Creating admin user...
✅ Admin created: admin@byd.com / Admin123!
👥 Creating sales consultants...
✅ SC created: john.doe@byd.com / Password123!
✅ SC created: jane.smith@byd.com / Password123!
✅ SC created: mike.johnson@byd.com / Password123!
✅ Disabled user created: disabled@byd.com
📋 Creating sample leads...
✅ Created 3 sample leads
📅 Creating sample activities...
✅ Created sample activities

🎉 Database seeded successfully!

📝 Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin Account:
  Email: admin@byd.com
  Password: Admin123!
  Role: ADMIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sales Consultant Accounts:
  Email: john.doe@byd.com
  Email: jane.smith@byd.com
  Email: mike.johnson@byd.com
  Password: Password123! (all)
  Role: SC
  Note: Force password change on first login
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 6: Start Development Servers

**Open TWO terminal windows:**

**Terminal 1 - Backend API:**
```bash
npm run api:dev
```

Expected output:
```
🚀 Server running on port 3001
📊 Health check: http://localhost:3001/api/v1/health
🔒 Environment: development
🛡️  Security: Helmet enabled
⏱️  Rate limiting: Active
📝 Audit logging: Enabled
💾 Backup system: Ready
```

**Terminal 2 - Frontend Web:**
```bash
npm run web:dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 7: Access Application

Open browser and navigate to:
```
http://localhost:5173
```

Login with:
- **Email:** `admin@byd.com`
- **Password:** `Admin123!`

## 🧪 Verification Commands

### Check Database

```bash
# Connect to database
psql -U postgres -d lead_management

# List all users
SELECT id, email, "fullName", role, status FROM users;

# Exit
\q
```

### Test API Endpoints

**1. Login and get token:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@byd.com\",\"password\":\"Admin123!\"}"
```

**2. List users (replace YOUR_TOKEN):**
```bash
curl http://localhost:3001/api/v1/users ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Create user:**
```bash
curl -X POST http://localhost:3001/api/v1/users ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"newuser@byd.com\",\"fullName\":\"New User\",\"position\":\"Sales Consultant\",\"role\":\"SC\",\"temporaryPassword\":\"TempPass123!\",\"forcePasswordChange\":true}"
```

## 🔄 Reset/Restart Commands

### Reset Database

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS lead_management;"
psql -U postgres -c "CREATE DATABASE lead_management;"

# Run migration again
npm run db:migrate -w apps/api

# Seed again
npm run db:seed -w apps/api
```

### Restart Servers

```bash
# Stop servers: Press Ctrl+C in each terminal

# Start API
npm run api:dev

# Start Web (in another terminal)
npm run web:dev
```

### Clear Node Modules (if issues)

```bash
# Remove node_modules
rmdir /s /q node_modules
rmdir /s /q apps\api\node_modules
rmdir /s /q apps\web\node_modules
rmdir /s /q packages\shared\node_modules

# Reinstall
npm install
npm run shared:build
```

## 📊 Database Management Commands

### View Database Schema

```bash
psql -U postgres -d lead_management -c "\d users"
```

### Count Users

```bash
psql -U postgres -d lead_management -c "SELECT COUNT(*) FROM users;"
```

### View All Users

```bash
psql -U postgres -d lead_management -c "SELECT email, \"fullName\", role, status FROM users;"
```

### Delete Specific User

```bash
psql -U postgres -d lead_management -c "DELETE FROM users WHERE email='test@byd.com';"
```

### Update User Status

```bash
psql -U postgres -d lead_management -c "UPDATE users SET status='DISABLED' WHERE email='john.doe@byd.com';"
```

## 🛠️ Troubleshooting Commands

### Check PostgreSQL Status

```bash
# Windows
sc query postgresql-x64-14

# Start if stopped
net start postgresql-x64-14
```

### Check Port Usage

```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Check if port 5173 is in use
netstat -ano | findstr :5173
```

### Kill Process on Port

```bash
# Find PID from netstat output above, then:
taskkill /PID <PID_NUMBER> /F
```

### View API Logs

API logs appear in Terminal 1 where you ran `npm run api:dev`

### View Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for errors

## 📦 Package Management

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Rebuild shared package
npm run shared:build
```

### Add New Package

```bash
# Backend
npm install <package-name> -w apps/api

# Frontend
npm install <package-name> -w apps/web

# Shared
npm install <package-name> -w packages/shared
```

## 🎯 Quick Test Sequence

Run these commands in order to verify everything works:

```bash
# 1. Check database
psql -U postgres -d lead_management -c "SELECT COUNT(*) FROM users;"

# 2. Start API (Terminal 1)
npm run api:dev

# 3. Start Web (Terminal 2)
npm run web:dev

# 4. Open browser
start http://localhost:5173

# 5. Login as admin
# Email: admin@byd.com
# Password: Admin123!

# 6. Navigate to Users page
# Click "Users" in sidebar

# 7. Create a test user
# Click "Create User" button
# Fill form and submit

# 8. Verify in database
psql -U postgres -d lead_management -c "SELECT email, \"fullName\" FROM users;"
```

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ API server shows "Server running on port 3001"
2. ✅ Web server shows "Local: http://localhost:5173/"
3. ✅ Login page loads without errors
4. ✅ Can login with admin@byd.com
5. ✅ Users page shows 4 users
6. ✅ Can create new user
7. ✅ New user appears in table
8. ✅ Database query shows new user

## 🚨 Emergency Reset

If everything breaks:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Reset database
psql -U postgres -c "DROP DATABASE IF EXISTS lead_management;"
psql -U postgres -c "CREATE DATABASE lead_management;"

# 3. Clean install
rmdir /s /q node_modules
npm install
npm run shared:build

# 4. Migrate and seed
npm run db:migrate -w apps/api
npm run db:seed -w apps/api

# 5. Restart servers
npm run api:dev
# (in another terminal)
npm run web:dev
```

## 📞 Getting Help

If commands fail:

1. Check error message carefully
2. Verify PostgreSQL is running
3. Check .env file has correct DATABASE_URL
4. Ensure ports 3001 and 5173 are free
5. Try emergency reset above

---

**All commands tested on Windows 10/11 with PowerShell**

**Last Updated:** February 1, 2026
