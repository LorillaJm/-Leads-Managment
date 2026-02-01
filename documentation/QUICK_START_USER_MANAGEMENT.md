# 🚀 Quick Start - Admin User Management

## Prerequisites Check

```bash
# Check Node.js version (need v18+)
node --version

# Check PostgreSQL (should show version)
psql --version

# Check if PostgreSQL is running
# Windows:
sc query postgresql-x64-14
# Mac/Linux:
pg_isready
```

## 5-Minute Setup

### 1. Database Setup (2 minutes)

```bash
# Start PostgreSQL if not running
# Windows:
net start postgresql-x64-14

# Mac:
brew services start postgresql@14

# Linux:
sudo systemctl start postgresql

# Create database
psql -U postgres -c "CREATE DATABASE lead_management;"
```

### 2. Configure Environment (1 minute)

```bash
# Copy example env
copy .env.example .env

# Edit .env and update:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lead_management?schema=public"
```

### 3. Install & Build (1 minute)

```bash
# Install dependencies
npm install

# Build shared package
npm run shared:build
```

### 4. Database Migration & Seed (1 minute)

```bash
# Run migration
npm run db:migrate -w apps/api
# When prompted, enter: "add_user_management"

# Seed database
npm run db:seed -w apps/api
```

**Expected Output:**
```
✅ Admin created: admin@byd.com / Admin123!
✅ SC created: john.doe@byd.com / Password123!
✅ SC created: jane.smith@byd.com / Password123!
✅ SC created: mike.johnson@byd.com / Password123!
```

### 5. Start Servers

**Terminal 1 - API:**
```bash
npm run api:dev
```

**Terminal 2 - Web:**
```bash
npm run web:dev
```

## 🎯 First Login

1. Open http://localhost:5173
2. Login with:
   - Email: `admin@byd.com`
   - Password: `Admin123!`
3. Click "Users" in sidebar
4. You're ready! 🎉

## ✅ Quick Verification

### Test 1: View Users
- Navigate to Users page
- Should see 4 users in table

### Test 2: Create User
1. Click "Create User"
2. Fill form:
   - Email: `test@byd.com`
   - Full Name: `Test User`
   - Position: `Sales Consultant`
   - Role: `SC`
   - Click "Generate" for password
3. Submit
4. New user appears in table ✅

### Test 3: Reset Password
1. Click ⋯ on any user
2. Click "Reset Password"
3. Click "Generate Secure"
4. Click copy icon
5. Submit
6. Success! ✅

### Test 4: Disable User
1. Click ⋯ on test user
2. Click "Disable User"
3. Status changes to "Disabled" ✅
4. Try logging in as that user (should fail)

### Test 5: SC Cannot Access
1. Logout
2. Login as: `john.doe@byd.com` / `Password123!`
3. "Users" link should NOT appear ✅
4. Try accessing `/users` directly (blocked) ✅

## 🐛 Common Issues

### Issue: "Can't reach database server"
**Solution:**
```bash
# Check PostgreSQL is running
# Windows:
net start postgresql-x64-14

# Check connection
psql -U postgres -d lead_management -c "SELECT 1;"
```

### Issue: "Port 3001 already in use"
**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port in .env
API_PORT=3002
```

### Issue: "Migration failed"
**Solution:**
```bash
# Reset database
psql -U postgres -c "DROP DATABASE lead_management;"
psql -U postgres -c "CREATE DATABASE lead_management;"

# Run migration again
npm run db:migrate -w apps/api
```

### Issue: "Users page shows empty"
**Solution:**
```bash
# Re-run seed
npm run db:seed -w apps/api

# Refresh browser
```

## 📚 Next Steps

1. ✅ Read full setup guide: `ADMIN_USER_MANAGEMENT_SETUP.md`
2. ✅ Review file changes: `ADMIN_USER_MANAGEMENT_FILES.md`
3. ✅ Test all features using verification checklist
4. ✅ Customize for your needs

## 🎓 Learn More

### Key Files to Explore

**Backend:**
- `apps/api/src/services/userService.ts` - User management logic
- `apps/api/src/controllers/userController.ts` - API endpoints
- `apps/api/src/routes/users.ts` - Route definitions

**Frontend:**
- `apps/web/src/pages/Users.tsx` - Main users page
- `apps/web/src/components/users/` - User dialogs
- `apps/web/src/lib/api.ts` - API client

### API Endpoints

```
GET    /api/v1/users                    # List users (Admin)
POST   /api/v1/users                    # Create user (Admin)
PATCH  /api/v1/users/:id                # Update user (Admin)
POST   /api/v1/users/:id/reset-password # Reset password (Admin)
PATCH  /api/v1/users/:id/status         # Update status (Admin)
GET    /api/v1/users/sales-consultants  # List SCs (All)
```

## 💡 Pro Tips

1. **Password Generator:** Always use the built-in generator for secure passwords
2. **Copy Password:** Use the copy button before submitting password reset
3. **Force Change:** Keep "Force password change" checked for security
4. **Search:** Use search to quickly find users by name, email, or position
5. **Filters:** Combine search with role/status filters for precise results

## 🎉 Success!

You now have a fully functional, production-grade user management system with:
- ✅ Real PostgreSQL database
- ✅ Secure password hashing
- ✅ Role-based access control
- ✅ Beautiful Apple-inspired UI
- ✅ Complete CRUD operations
- ✅ Password reset functionality
- ✅ User status management

**Happy managing! 🚀**

---

**Need Help?** Check `ADMIN_USER_MANAGEMENT_SETUP.md` for detailed troubleshooting.
