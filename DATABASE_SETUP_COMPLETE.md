# ✅ Database Setup Complete!

## What Was Done

1. ✅ **Fixed local `.env` files** - Updated both root and `apps/api/.env` to use PostgreSQL
2. ✅ **Connected to Neon database** - Using your Neon PostgreSQL database
3. ✅ **Ran migrations** - Database schema is created and in sync
4. ✅ **Seeded database** - Initial data loaded with admin and sample users

## Your Database Connection

**Provider:** Neon (PostgreSQL)  
**Database:** neondb  
**Region:** ap-southeast-1 (Singapore)  
**Connection:** Pooled connection (optimized for serverless)

## Login Credentials

### Admin Account
- **Email:** `bydiloilo@gmail.com`
- **Password:** `admin123`
- **Role:** ADMIN (full access)

### Sales Consultant Accounts
- **Email:** `john.doe@byd.com`
- **Email:** `jane.smith@byd.com`
- **Email:** `mike.johnson@byd.com`
- **Password:** `Password123!` (all accounts)
- **Role:** SC (Sales Consultant)
- **Note:** Will be prompted to change password on first login

## Next Steps

### 1. Test Locally

Your API server should be running. Test it:

**Health Check:**
```bash
curl http://localhost:3001/api/v1/health
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bydiloilo@gmail.com","password":"admin123"}'
```

Or open in browser: http://localhost:3001/api/v1/health

### 2. Start Frontend

Open a new terminal:
```bash
cd apps/web
npm run dev
```

Then open: http://localhost:5173

Login with admin credentials above.

### 3. Deploy to Vercel

Now that your database is set up, you need to add the connection string to Vercel:

#### Step 1: Add Environment Variable to Vercel
1. Go to: https://vercel.com/dashboard
2. Select your project: `leads-management-api-vtx7`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://neondb_owner:npg_gkuHBNFXU06a@ep-mute-lake-a11520dt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
   - **Environments:** Select all three (Production, Preview, Development)
6. Click **Save**

#### Step 2: Add Other Required Variables
Also add these if not already present:
- **JWT_SECRET:** `your-super-secret-jwt-key-change-in-production`
- **NODE_ENV:** `production`

#### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"Redeploy"** button
4. Wait for deployment to complete (~2 minutes)

#### Step 4: Test Your Deployed API
```bash
# Health check
curl https://leads-managment-api-vtx7.vercel.app/api/v1/health

# Login
curl -X POST https://leads-managment-api-vtx7.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bydiloilo@gmail.com","password":"admin123"}'
```

## Database Management

### View Your Data
Go to Neon Console: https://console.neon.tech
- View tables
- Run SQL queries
- Monitor usage
- Manage backups

### Run Migrations (if you make schema changes)
```bash
cd apps/api
npx prisma db push
```

### Reset Database (if needed)
```bash
cd apps/api
npx prisma db push --force-reset
npm run db:seed
```

### Backup Database
Neon provides automatic backups. You can also export:
1. Go to Neon Console
2. Select your project
3. Go to "Backups" section
4. Create manual backup or restore from automatic backups

## Troubleshooting

### "Can't reach database server"
- Check your internet connection
- Verify Neon database is running (check Neon console)
- Check if connection string is correct

### "Authentication failed"
- Verify the password in the connection string
- Check if the connection string was copied correctly

### "Too many connections"
- You're using pooled connection, so this shouldn't happen
- If it does, check Neon console for connection limits
- Free tier has connection limits

### API returns "Route not found"
- Make sure you're accessing `/api/v1/` endpoints
- Example: `/api/v1/health` not just `/health`

## Important Files

- **Root `.env`** - Main environment variables
- **`apps/api/.env`** - API-specific environment variables (overrides root)
- **`apps/api/prisma/schema.prisma`** - Database schema
- **`apps/api/src/seed.ts`** - Database seeding script

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to Git (already in `.gitignore`)
- Change `JWT_SECRET` in production
- Use strong passwords for production admin accounts
- The current admin password (`admin123`) should be changed after first login

## What's Next?

1. ✅ Database is set up and running
2. ✅ Local development is ready
3. 🔄 Add `DATABASE_URL` to Vercel environment variables
4. 🔄 Redeploy to Vercel
5. 🔄 Test deployed API
6. 🔄 Update frontend to use deployed API URL

## Need Help?

- **Neon Documentation:** https://neon.tech/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **Vercel Documentation:** https://vercel.com/docs

Your database is now fully configured and ready to use! 🎉
