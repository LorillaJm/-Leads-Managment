# Lead Management System

A production-ready Lead Management System with Apple-inspired UI built with React, TypeScript, Node.js, and SQLite.

## Phase 1: Foundation ✅

### Current Status
- ✅ Monorepo structure with apps/web, apps/api, and packages/shared
- ✅ React + Vite + TypeScript frontend with Tailwind CSS
- ✅ Node.js + Express + TypeScript backend
- ✅ Prisma ORM with SQLite database (dev)
- ✅ Shared types and Zod schemas
- ✅ Basic layout shell with Apple-inspired glass morphism
- ✅ TanStack Query provider setup
- ✅ Health endpoint for API monitoring

## Phase 2: Authentication & RBAC ✅

### Current Status
- ✅ JWT authentication with refresh tokens (HTTP-only cookies)
- ✅ User registration, login, logout, and profile endpoints
- ✅ RBAC middleware for backend route protection
- ✅ Login form with React Hook Form + Zod validation
- ✅ Authentication context and protected routes
- ✅ User management for Management role
- ✅ Password hashing with bcryptjs
- ✅ Database seeded with demo users

### Demo Accounts
- **Management**: manager@leadflow.com / password123
- **Sales Consultant 1**: alice@leadflow.com / password123
- **Sales Consultant 2**: bob@leadflow.com / password123

### Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, SQLite (dev)
- **Auth**: JWT + refresh tokens, bcryptjs, HTTP-only cookies
- **Shared**: Zod validation schemas, TypeScript types

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Default SQLite setup works out of the box
   ```

4. Generate Prisma client and setup database:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. Build shared package:
   ```bash
   npm run build --workspace=packages/shared
   ```

6. Start development servers:
   ```bash
   npm run dev
   ```

### Development URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/v1/health

## Project Structure

```
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Node.js backend
├── packages/
│   └── shared/       # Shared types and schemas
└── package.json      # Root package.json
```

## Next Phase
Phase 3: Lead CRUD (leads list + new + edit; API CRUD; filtering/search)