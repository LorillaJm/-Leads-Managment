# Phase 2: Authentication & RBAC - Verification Guide

## ✅ Phase 2 Complete!

Both frontend and backend servers are running successfully with full authentication system.

## Quick Start

1. **Open the application**: http://localhost:5173
2. **You should see the login page** with the LeadFlow logo and login form

## Test Authentication

### Test 1: Login as Management
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: `manager@leadflow.com`
   - Password: `password123`
3. Click "Sign in"
4. ✅ You should be redirected to the dashboard
5. ✅ Header should show "John Manager" with "Management" role
6. ✅ All navigation items should be accessible

### Test 2: Login as Sales Consultant
1. Click logout button (top right)
2. Enter credentials:
   - Email: `alice@leadflow.com`
   - Password: `password123`
3. Click "Sign in"
4. ✅ You should be redirected to the dashboard
5. ✅ Header should show "Alice Johnson" with "Sales consultant" role

### Test 3: Protected Routes
1. Logout from the application
2. Try to access http://localhost:5173/leads directly
3. ✅ You should be redirected to /login
4. Login again
5. ✅ You should be able to access /leads

### Test 4: API Endpoints

Test the health endpoint:
```bash
curl http://localhost:3001/api/v1/health
```
✅ Should return: `{"success":true,"message":"API is healthy",...}`

Test login endpoint (PowerShell):
```powershell
$body = @{
    email = "manager@leadflow.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body
```
✅ Should return user data and access token

## Features Implemented

### Backend ✅
- [x] JWT authentication with 15-minute access tokens
- [x] Refresh tokens stored as HTTP-only cookies (7-day expiry)
- [x] Password hashing with bcryptjs (12 rounds)
- [x] User registration endpoint
- [x] Login endpoint with credential validation
- [x] Logout endpoint (clears cookies)
- [x] Token refresh endpoint
- [x] Get profile endpoint (authenticated)
- [x] RBAC middleware (authenticate & authorize)
- [x] User management endpoints (Management only)
- [x] Get sales consultants endpoint
- [x] Proper error handling with consistent response format
- [x] Security middleware (Helmet, CORS, Rate limiting)

### Frontend ✅
- [x] Login form with React Hook Form
- [x] Zod validation for form inputs
- [x] Authentication context (global state)
- [x] Protected routes component
- [x] Auto token refresh (every 14 minutes)
- [x] Logout functionality
- [x] User profile display in header
- [x] Role display in header
- [x] Apple-inspired glass morphism UI
- [x] Loading states
- [x] Error handling and display
- [x] Demo account credentials shown

### Database ✅
- [x] SQLite database for development
- [x] Prisma ORM with proper schema
- [x] User model with roles
- [x] Seeded with 3 demo users (1 Management, 2 Sales Consultants)
- [x] Password hashing in seed data

### Security ✅
- [x] HTTP-only cookies for refresh tokens
- [x] Secure cookie flag for production
- [x] SameSite cookie attribute
- [x] CORS configured
- [x] Helmet security headers
- [x] Rate limiting (100 requests per 15 minutes)
- [x] Input validation with Zod
- [x] Password hashing with bcryptjs
- [x] JWT token expiration
- [x] Role-based access control

## Known Issues & Notes

1. **SQLite for Development**: Using SQLite instead of PostgreSQL for easier local development. Production should use PostgreSQL.

2. **Module System**: Shared package configured as ES modules to work with both Vite (frontend) and tsx (backend).

3. **Demo Credentials**: All demo accounts use `password123` - change in production!

## Next Steps

Ready for **Phase 3: Lead CRUD**
- Leads list with TanStack Table
- Create/Edit lead forms
- Search and filtering
- Pagination
- Soft delete
- RBAC (SC sees own leads, Management sees all)

## Troubleshooting

### If login doesn't work:
1. Check browser console for errors
2. Check API server is running on port 3001
3. Check web server is running on port 5173
4. Verify database has seed data: `npm run db:seed`

### If you see module errors:
1. Rebuild shared package: `npm run build --workspace=packages/shared`
2. Restart both servers

### If servers won't start:
1. Kill any processes on ports 3001 and 5173
2. Run `npm install` again
3. Run `npm run dev`