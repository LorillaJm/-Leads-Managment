#!/bin/bash
# Script to initialize PostgreSQL database for production

echo "🔧 Setting up PostgreSQL database..."

# Remove SQLite-specific files
rm -f prisma/dev.db
rm -f prisma/dev.db-journal

# Remove old migrations (SQLite specific)
rm -rf prisma/migrations

# Create new migration for PostgreSQL
echo "📦 Creating PostgreSQL migration..."
npx prisma migrate deploy --schema=prisma/schema.prisma || npx prisma db push --schema=prisma/schema.prisma

echo "✅ PostgreSQL setup complete!"
