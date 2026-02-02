# 🚀 Quick Start: Get Your Database Running in 5 Minutes

## Fastest Option: Neon (No Credit Card Required)

### Step 1: Create Neon Account (1 minute)
1. Go to: https://neon.tech
2. Click **"Sign up"**
3. Choose **"Continue with GitHub"** (fastest)

### Step 2: Create Database (1 minute)
1. After login, click **"Create a project"**
2. Settings:
   - **Name:** `lead-management`
   - **Region:** Choose closest to you (e.g., US East, Europe, Asia)
   - **Postgres version:** 15 (default)
3. Click **"Create project"**

### Step 3: Get Connection String (30 seconds)
1. You'll see a connection string like:
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
2. Click the **"Copy"** button

### Step 4: Update Your .env File (1 minute)
1. Open `.env` file in your project root
2. Replace the `DATABASE_URL` line with your Neon connection string:
   ```env
   DATABASE_URL="postgresql://username:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
3. Save the file

### Step 5: Run Migrations (2 minutes)
Open your terminal and run:

```bash
cd apps/api
npx prisma db push
```

You should see:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

### Step 6: Seed Database (1 minute)
```bash
npm run db:seed
```

You should see:
```
✅ Database seeded successfully!
```

### Step 7: Test Your API
```bash
# From root directory
npm run dev
```

Open browser to: http://localhost:3001/api/v1/health

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Default Login Credentials

After seeding, you can login with:
- **Email:** `admin@example.com`
- **Password:** `Admin123!`

## For Vercel Deployment

1. Copy your Neon connection string
2. Go to Vercel: https://vercel.com/dashboard
3. Select your project → **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Your Neon connection string
   - **Environments:** Check all (Production, Preview, Development)
5. Click **Save**
6. Go to **Deployments** → Click **"Redeploy"** on latest deployment

## Troubleshooting

### "Can't reach database server"
- Check your internet connection
- Verify the connection string is copied correctly (no extra spaces)

### "Password authentication failed"
- Make sure you copied the entire connection string including the password
- The password is embedded in the URL after the username

### "Prisma command not found"
```bash
npm install
```

### Still having issues?
Check the full guide: **SETUP_DATABASE.md**

## What's Next?

✅ Database is set up  
✅ Tables are created  
✅ Sample data is loaded  
✅ API is running  

Now you can:
1. Start the frontend: `cd apps/web && npm run dev`
2. Login with admin credentials
3. Test the application
4. Deploy to Vercel (see VERCEL_DEPLOYMENT_IMPORTANT.md)

## Alternative: Use Supabase

If you prefer Supabase (includes auth, storage, etc.):

1. Go to: https://supabase.com
2. Create project (takes ~2 minutes to initialize)
3. Go to **Settings** → **Database** → **Connection string** → **Connection pooling**
4. Copy the string (replace `[YOUR-PASSWORD]` with your actual password)
5. Update `.env` with the connection string
6. Run `npx prisma db push` and `npm run db:seed`

---

**Need help?** Check SETUP_DATABASE.md for detailed instructions and more options.
