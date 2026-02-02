import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runStartupTasks() {
  console.log('🔧 Running startup tasks...');

  try {
    // Run Prisma db push (creates tables if they don't exist)
    console.log('📦 Setting up database schema...');
    const { stdout: pushOutput, stderr: pushError } = await execAsync('npx prisma db push --accept-data-loss');
    
    if (pushError && !pushError.includes('warnings')) {
      console.error('⚠️  Database setup warnings:', pushError);
    }
    console.log('✅ Database schema ready');
    if (pushOutput) console.log(pushOutput);

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
