# Admin User Management Module - Setup & Verification Guide

## 🎯 Overview

This guide provides complete instructions for setting up and verifying the production-grade Admin User Management module.

## ✅ Features Implemented

### Backend (Real Database + API)
- ✅ PostgreSQL database with enhanced User model
- ✅ Secure password hashing with bcrypt (12 rounds)
- ✅ RBAC enforcement (ADMIN/SC roles)
- ✅ User CRUD operations (Admin only)
- ✅ Password reset functionality
- ✅ User status management (ACTIVE/DISABLED)
- ✅ Force password change on first login
- ✅ Rate limiting on sensitive operations
- ✅ Comprehensive validation with Zod
- ✅ Audit logging ready
- ✅ Last login tracking

### Frontend (Apple-Inspired UI)
- ✅ Users list page with TanStack Table
- ✅ Advanced filtering (search, role, status)
- ✅ Pagination support
- ✅ Create user dialog with password generator
- ✅ Edit user dialog
- ✅ Reset password dialog with copy-to-clipboard
- ✅ Status toggle (Enable/Disable)
- ✅ Role-based navigation (Admin-only access)
- ✅ Responsive design (desktop/tablet/mobile)
- ✅ Skeleton loaders & empty states
- ✅ Framer Motion animations
- ✅ Apple-style glassmorphism design

## 📋 Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** v18+ and npm
3. **Git** (optional, for version control)

## 🚀 Setup Instructions

### Step 1: Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql

# Start PostgreSQL service
net start postgresql-x64-14
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lead_management;

# Create user (optional)
CREATE USER lead_admin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE lead_management TO lead_admin;

# Exit
\q
```

### Step 3: Configure Environment

```bash
# Copy the example env file
copy .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/lead_management?schema=public"
```

**Important:** Update the `.env` file with your actual PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lead_management?schema=public"
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters-long
```

### Step 4: Install Dependencies

```bash
# Install all dependencies (root + workspaces)
npm install

# Build shared package
npm run shared:build
```

### Step 5: Database Migration

```bash
# Generate Prisma client
npm run db:migrate -w apps/api

# When prompted, enter migration name: "add_user_management"
```

### Step 6: Seed Database

```bash
# Seed with admin and test users
npm run db:seed -w apps/api
```

**Seed Output:**
```
✅ Admin created: admin@byd.com / Admin123!
✅ SC created: john.doe@byd.com / Password123!
✅ SC created: jane.smith@byd.com / Password123!
✅ SC created: mike.johnson@byd.com / Password123!
```

### Step 7: Start Development Servers

**Terminal 1 - API Server:**
```bash
npm run api:dev
```

**Terminal 2 - Web App:**
```bash
npm run web:dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🧪 Verification Checklist

### 1. Database Verification

```bash
# Connect to database
psql -U postgres -d lead_management

# Check users table
SELECT id, email, "fullName", role, status, "forcePasswordChange" FROM users;

# Expected output: 4 users (1 ADMIN, 3 SC)
```

### 2. Backend API Verification

**Test Authentication:**
```bash
# Login as Admin
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@byd.com","password":"Admin123!"}'

# Save the accessToken from response
```

**Test User List (Admin only):**
```bash
curl http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Should return list of users with pagination
```

**Test Create User (Admin only):**
```bash
curl -X POST http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@byd.com",
    "fullName": "Test User",
    "position": "Sales Consultant",
    "role": "SC",
    "temporaryPassword": "TempPass123!",
    "forcePasswordChange": true
  }'
```

**Test Reset Password (Admin only):**
```bash
curl -X POST http://localhost:3001/api/v1/users/USER_ID/reset-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"temporaryPassword":"NewPass123!"}'
```

**Test Update Status (Admin only):**
```bash
curl -X PATCH http://localhost:3001/api/v1/users/USER_ID/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"DISABLED"}'
```

**Test SC Cannot Access (Should fail with 403):**
```bash
# Login as SC
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@byd.com","password":"Password123!"}'

# Try to access users endpoint (should fail)
curl http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer SC_ACCESS_TOKEN"

# Expected: 403 Forbidden
```

### 3. Frontend UI Verification

**Login as Admin:**
1. Navigate to http://localhost:5173
2. Login with: `admin@byd.com` / `Admin123!`
3. Verify "Users" link appears in sidebar (Admin only)

**Users List Page:**
1. Click "Users" in sidebar
2. ✅ Verify table shows all users
3. ✅ Verify search works (type "john")
4. ✅ Verify role filter works (select "SC")
5. ✅ Verify status filter works (select "ACTIVE")
6. ✅ Verify pagination appears if >10 users

**Create User:**
1. Click "Create User" button
2. Fill in form:
   - Email: `newuser@byd.com`
   - Full Name: `New User`
   - Position: `Junior Sales Consultant`
   - Role: `SC`
   - Click "Generate" for password
3. ✅ Submit form
4. ✅ Verify success toast appears
5. ✅ Verify new user appears in table
6. ✅ Check database: `SELECT * FROM users WHERE email='newuser@byd.com';`

**Edit User:**
1. Click three dots (⋯) on any user row
2. Click "Edit User"
3. Change position to "Senior Sales Consultant"
4. ✅ Submit form
5. ✅ Verify changes persist after page refresh
6. ✅ Check database for updated values

**Reset Password:**
1. Click three dots (⋯) on any user row
2. Click "Reset Password"
3. Click "Generate Secure" button
4. Click copy icon to copy password
5. ✅ Submit form
6. ✅ Verify success toast
7. ✅ Check database: `forcePasswordChange` should be `true`
8. ✅ Try logging in with new password

**Disable User:**
1. Click three dots (⋯) on any SC user row
2. Click "Disable User"
3. ✅ Verify status badge changes to "Disabled"
4. ✅ Try logging in as disabled user (should fail with 403)
5. ✅ Check database: `status` should be `DISABLED`

**Enable User:**
1. Click three dots (⋯) on disabled user
2. Click "Enable User"
3. ✅ Verify status badge changes to "Active"
4. ✅ User can now login again

**SC User Verification:**
1. Logout from admin account
2. Login as SC: `john.doe@byd.com` / `Password123!`
3. ✅ Verify "Users" link does NOT appear in sidebar
4. ✅ Try accessing `/users` directly (should redirect or show 403)

### 4. Security Verification

**Password Security:**
```bash
# Check passwords are hashed in database
psql -U postgres -d lead_management
SELECT email, "passwordHash" FROM users LIMIT 1;

# passwordHash should be bcrypt hash (starts with $2b$)
# Should NOT see plain text passwords
```

**Rate Limiting:**
```bash
# Try creating 15 users rapidly (should be rate limited after 10)
for i in {1..15}; do
  curl -X POST http://localhost:3001/api/v1/users \
    -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@byd.com\",\"fullName\":\"Test $i\",\"position\":\"SC\",\"role\":\"SC\",\"temporaryPassword\":\"Pass123!\"}"
done

# Should see "Too many requests" error after 10 requests
```

**RBAC Enforcement:**
```bash
# Verify SC cannot create users
curl -X POST http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer SC_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"hack@test.com","fullName":"Hacker","position":"Admin","role":"ADMIN","temporaryPassword":"Pass123!"}'

# Expected: 403 Forbidden
```

**Disabled User Cannot Login:**
```bash
# Disable a user via UI or API
# Then try to login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"disabled@byd.com","password":"Password123!"}'

# Expected: 403 "Account has been disabled"
```

## 🎨 UI/UX Features

### Apple-Inspired Design
- ✅ Neutral zinc/gray color palette
- ✅ Glassmorphism cards (backdrop-blur)
- ✅ Rounded corners (rounded-xl, rounded-2xl)
- ✅ Subtle shadows and borders
- ✅ Smooth transitions with Framer Motion
- ✅ Hover states on interactive elements

### Responsive Design
- ✅ Desktop: Full table with sidebar
- ✅ Tablet: Collapsible sidebar
- ✅ Mobile: Bottom navigation, stacked cards

### User Experience
- ✅ Skeleton loaders during data fetch
- ✅ Empty states with helpful messages
- ✅ Toast notifications for all actions
- ✅ Form validation with clear error messages
- ✅ Password visibility toggle
- ✅ Password generator with copy-to-clipboard
- ✅ Confirmation dialogs for destructive actions

## 📊 Database Schema

```prisma
model User {
  id                  String    @id @default(cuid())
  email               String    @unique
  passwordHash        String
  fullName            String
  position            String?
  role                String    // "ADMIN" or "SC"
  photoUrl            String?
  status              String    @default("ACTIVE")
  forcePasswordChange Boolean   @default(true)
  lastLoginAt         DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  assignedLeads Lead[]
  
  @@index([email])
  @@index([role])
  @@index([status])
}
```

## 🔐 Security Features

1. **Password Hashing:** bcrypt with 12 rounds
2. **JWT Tokens:** 15min access + 7day refresh
3. **HTTP-Only Cookies:** Refresh tokens stored securely
4. **Rate Limiting:** 10 requests per 15min on sensitive endpoints
5. **RBAC:** Role-based access control enforced on backend
6. **Input Validation:** Zod schemas on all endpoints
7. **Status Checking:** Disabled users cannot login
8. **Token Invalidation:** Disabled users' sessions terminated

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**Solution:** Ensure PostgreSQL is running and credentials in `.env` are correct.

### Migration Error
```
Error: P1001: Can't reach database server
```
**Solution:** Check DATABASE_URL format and PostgreSQL service status.

### Port Already in Use
```
Error: Port 3001 is already in use
```
**Solution:** Kill the process or change PORT in `.env`.

### Users Page Not Showing
**Solution:** Ensure you're logged in as ADMIN role. SC users cannot see this page.

### Password Reset Not Working
**Solution:** Check that bcrypt is installed: `npm list bcryptjs`

## 📝 API Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/v1/users` | ✅ | ADMIN | List users with filters |
| GET | `/api/v1/users/:id` | ✅ | Any | Get user by ID |
| POST | `/api/v1/users` | ✅ | ADMIN | Create new user |
| PATCH | `/api/v1/users/:id` | ✅ | ADMIN | Update user |
| POST | `/api/v1/users/:id/reset-password` | ✅ | ADMIN | Reset password |
| PATCH | `/api/v1/users/:id/status` | ✅ | ADMIN | Update status |
| GET | `/api/v1/users/sales-consultants` | ✅ | Any | List active SCs |

## ✅ Production Readiness Checklist

- [x] Real PostgreSQL database (not SQLite)
- [x] Secure password hashing (bcrypt)
- [x] RBAC enforcement on backend
- [x] Input validation (Zod)
- [x] Rate limiting on sensitive endpoints
- [x] Error handling and logging
- [x] Responsive UI design
- [x] Loading states and error states
- [x] Form validation with clear errors
- [x] Toast notifications
- [x] Pagination support
- [x] Search and filtering
- [x] Role-based navigation
- [x] Status management
- [x] Password reset functionality
- [x] Force password change
- [x] Last login tracking
- [x] Audit trail ready

## 🎉 Success Criteria

All features are working when:

1. ✅ Admin can create SC users with temporary passwords
2. ✅ Admin can edit user details (name, position, role)
3. ✅ Admin can reset user passwords
4. ✅ Admin can disable/enable users
5. ✅ Disabled users cannot login
6. ✅ SC users cannot access user management
7. ✅ All changes persist to database
8. ✅ UI is responsive on all devices
9. ✅ No plain text passwords in database
10. ✅ Rate limiting prevents abuse

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check browser console for frontend errors
5. Check API server logs for backend errors

---

**Module Status:** ✅ COMPLETE & PRODUCTION-READY

**Last Updated:** February 1, 2026
