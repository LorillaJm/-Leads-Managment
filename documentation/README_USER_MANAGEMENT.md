# 🎯 Admin User Management Module

> **Production-grade user management system with real database persistence, secure authentication, and Apple-inspired UI**

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [Security](#security)
- [Screenshots](#screenshots)
- [API Reference](#api-reference)
- [Support](#support)

## 🌟 Overview

The Admin User Management module is a complete, production-ready system for managing user accounts in a business application. It provides administrators with full control over user creation, editing, password management, and access control.

### Key Highlights

✅ **Real Database** - PostgreSQL with proper schema and indexes  
✅ **Secure by Design** - bcrypt hashing, JWT tokens, RBAC enforcement  
✅ **Beautiful UI** - Apple-inspired design with glassmorphism  
✅ **Fully Responsive** - Works on desktop, tablet, and mobile  
✅ **Production Ready** - Rate limiting, validation, error handling  
✅ **Well Documented** - Complete guides and verification checklists  

## 🚀 Features

### For Administrators

- **User Management**
  - Create new users with temporary passwords
  - Edit user details (name, position, role, photo)
  - Reset user passwords securely
  - Enable/disable user accounts
  - View last login dates

- **Search & Filter**
  - Search by name, email, or position
  - Filter by role (ADMIN/SC)
  - Filter by status (ACTIVE/DISABLED)
  - Pagination support

- **Security**
  - Force password change on first login
  - Secure password generator
  - Copy-to-clipboard functionality
  - Disabled users cannot login

### For the System

- **Authentication**
  - JWT access tokens (15 min expiry)
  - JWT refresh tokens (7 day expiry)
  - HTTP-only cookies
  - Automatic token refresh

- **Authorization**
  - Role-based access control (RBAC)
  - Admin-only endpoints
  - Status-based authentication
  - Backend enforcement

- **Data Integrity**
  - Email uniqueness validation
  - Password strength requirements
  - Input validation with Zod
  - SQL injection prevention

## ⚡ Quick Start

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### Installation (5 minutes)

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE lead_management;"

# 2. Configure environment
copy .env.example .env
# Edit .env with your PostgreSQL credentials

# 3. Install dependencies
npm install
npm run shared:build

# 4. Run migration
npm run db:migrate -w apps/api
# Enter migration name: "add_user_management"

# 5. Seed database
npm run db:seed -w apps/api

# 6. Start servers
npm run api:dev    # Terminal 1
npm run web:dev    # Terminal 2
```

### First Login

1. Open http://localhost:5173
2. Login with:
   - Email: `admin@byd.com`
   - Password: `Admin123!`
3. Click "Users" in sidebar
4. Start managing users! 🎉

## 📚 Documentation

### Setup Guides

- **[Quick Start Guide](QUICK_START_USER_MANAGEMENT.md)** - Get up and running in 5 minutes
- **[Complete Setup Guide](ADMIN_USER_MANAGEMENT_SETUP.md)** - Detailed instructions with verification
- **[Run Commands](RUN_COMMANDS.md)** - Copy-paste ready commands

### Technical Documentation

- **[Architecture Diagram](ARCHITECTURE_DIAGRAM.md)** - System architecture and data flows
- **[File Changes](ADMIN_USER_MANAGEMENT_FILES.md)** - Complete list of modified/new files
- **[Visual Showcase](VISUAL_FEATURE_SHOWCASE.md)** - UI/UX design system
- **[Implementation Complete](IMPLEMENTATION_COMPLETE.md)** - Deliverables checklist

## 🛠️ Technology Stack

### Backend

- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt (12 rounds)
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Data Fetching:** TanStack Query
- **Table:** TanStack Table
- **Forms:** React Hook Form + Zod
- **Styling:** Tailwind CSS
- **Components:** Radix UI
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 🔐 Security

### Password Security

- ✅ bcrypt hashing with 12 rounds
- ✅ Never stored in plain text
- ✅ Never returned in API responses
- ✅ Minimum 8 characters required
- ✅ Force change on first login

### Authentication

- ✅ JWT access tokens (15 min)
- ✅ JWT refresh tokens (7 days)
- ✅ HTTP-only cookies
- ✅ Automatic token refresh
- ✅ Status-based blocking

### Authorization

- ✅ Role-based access control (RBAC)
- ✅ Admin-only endpoints
- ✅ Backend enforcement
- ✅ Frontend guards (UX)

### Input Validation

- ✅ Zod schemas on all endpoints
- ✅ Email format validation
- ✅ SQL injection prevention (Prisma)
- ✅ XSS prevention (Helmet)

### Rate Limiting

- ✅ 10 requests per 15 minutes
- ✅ Applied to sensitive operations
- ✅ Per-IP tracking
- ✅ Prevents brute force

## 📸 Screenshots

### Users List Page
```
┌─────────────────────────────────────────────────────────────┐
│  User Management                        [+ Create User]     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🔍 Search...          [All Roles ▼]  [All Status ▼]   ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │ User          Position      Role    Status   Actions   ││
│  │ 👤 Admin      IT Manager    ADMIN   Active   ⋯         ││
│  │ 👤 John Doe   Senior SC     SC      Active   ⋯         ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Create User Dialog
```
┌─────────────────────────────────────────────────────────────┐
│  Create New User                                      ✕     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Email: user@byd.com                                     ││
│  │ Full Name: John Doe                                     ││
│  │ Position: Sales Consultant                              ││
│  │ Role: [Sales Consultant ▼]                              ││
│  │ Password: ••••••••••  [Generate]  👁                    ││
│  │ ☑ Force password change on first login                 ││
│  └─────────────────────────────────────────────────────────┘│
│  [Cancel]  [Create User]                                    │
└─────────────────────────────────────────────────────────────┘
```

## 📡 API Reference

### Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/v1/users` | ✅ | ADMIN | List users with filters |
| POST | `/api/v1/users` | ✅ | ADMIN | Create new user |
| PATCH | `/api/v1/users/:id` | ✅ | ADMIN | Update user |
| POST | `/api/v1/users/:id/reset-password` | ✅ | ADMIN | Reset password |
| PATCH | `/api/v1/users/:id/status` | ✅ | ADMIN | Update status |
| GET | `/api/v1/users/sales-consultants` | ✅ | All | List active SCs |

### Example Request

```bash
# Create User
curl -X POST http://localhost:3001/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@byd.com",
    "fullName": "New User",
    "position": "Sales Consultant",
    "role": "SC",
    "temporaryPassword": "TempPass123!",
    "forcePasswordChange": true
  }'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "newuser@byd.com",
      "fullName": "New User",
      "position": "Sales Consultant",
      "role": "SC",
      "status": "ACTIVE",
      "forcePasswordChange": true,
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  },
  "message": "User created successfully"
}
```

## 🧪 Testing

### Manual Testing

Follow the comprehensive verification checklist in [ADMIN_USER_MANAGEMENT_SETUP.md](ADMIN_USER_MANAGEMENT_SETUP.md#verification-checklist)

### Quick Verification

```bash
# 1. Check database
psql -U postgres -d lead_management -c "SELECT COUNT(*) FROM users;"

# 2. Test API
curl http://localhost:3001/api/v1/health

# 3. Test login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@byd.com","password":"Admin123!"}'
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
# Windows:
net start postgresql-x64-14

# Verify connection
psql -U postgres -d lead_management -c "SELECT 1;"
```

**Port Already in Use**
```bash
# Find and kill process
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Migration Failed**
```bash
# Reset database
psql -U postgres -c "DROP DATABASE lead_management;"
psql -U postgres -c "CREATE DATABASE lead_management;"
npm run db:migrate -w apps/api
```

See [ADMIN_USER_MANAGEMENT_SETUP.md](ADMIN_USER_MANAGEMENT_SETUP.md#troubleshooting) for more solutions.

## 📞 Support

### Documentation

- Setup issues? → [Complete Setup Guide](ADMIN_USER_MANAGEMENT_SETUP.md)
- Need commands? → [Run Commands](RUN_COMMANDS.md)
- Want to understand architecture? → [Architecture Diagram](ARCHITECTURE_DIAGRAM.md)

### Verification

- Complete the [Verification Checklist](ADMIN_USER_MANAGEMENT_SETUP.md#verification-checklist)
- Check [Implementation Complete](IMPLEMENTATION_COMPLETE.md) for deliverables

## 🎯 What's Next?

After setting up user management, you can:

1. ✅ Customize user roles and permissions
2. ✅ Add user profile photo upload
3. ✅ Implement email notifications
4. ✅ Add 2FA support
5. ✅ Create audit logs viewer
6. ✅ Add bulk user operations
7. ✅ Implement user activity tracking

## 🏆 Quality Assurance

This module is:

- ✅ **Production-Ready** - No mock data, all real
- ✅ **Secure** - Industry best practices
- ✅ **Tested** - Comprehensive verification
- ✅ **Documented** - Complete guides
- ✅ **Maintainable** - Clean architecture
- ✅ **Scalable** - Proper indexing and pagination

## 📄 License

This module is part of the Lead Management System.

## 🙏 Acknowledgments

Built with:
- React, Express, PostgreSQL, Prisma
- TanStack Query, TanStack Table
- Tailwind CSS, Radix UI, Framer Motion
- And many other amazing open-source projects

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** February 1, 2026  

**Ready to manage users like a pro! 🚀**
