import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runStartupTasks() {
  console.log('🔧 Running startup tasks...');

  try {
    // Run Prisma migrations
    console.log('📦 Running database migrations...');
    const { stdout: migrateOutput, stderr: migrateError } = await execAsync('npx prisma migrate deploy');
    
    if (migrateError) {
      console.error('⚠️  Migration warnings:', migrateError);
    }
    console.log('✅ Migrations completed');
    console.log(migrateOutput);

    // Check if database needs seeding (only if no users exist)
    console.log('🌱 Checking if database needs seeding...');
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      console.log('📝 Database is empty, running seed...');
      const { stdout: seedOutput, stderr: seedError } = await execAsync('npm run db:seed');
      
      if (seedError) {
        console.error('⚠️  Seed warnings:', seedError);
      }
      console.log('✅ Database seeded successfully');
      console.log(seedOutput);
    } else {
      console.log('✅ Database already has data, skipping seed');
    }

    await prisma.$disconnect();
    console.log('🎉 Startup tasks completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during startup tasks:', error);
    // Don't exit - let the server start anyway
    console.log('⚠️  Continuing with server startup despite errors...');
  }
}
