import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '../types.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.activity.deleteMany();
  await prisma.closedDeal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'bydiloilo@gmail.com',
      passwordHash: adminPassword,
      fullName: 'System Administrator',
      position: 'IT Manager',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      photoUrl: null
    }
  });
  console.log(`✅ Admin created: ${admin.email} / admin123`);

  // Create Sales Consultants
  console.log('👥 Creating sales consultants...');
  const scPassword = await bcrypt.hash('Password123!', 12);
  
  const sc1 = await prisma.user.create({
    data: {
      email: 'john.doe@byd.com',
      passwordHash: scPassword,
      fullName: 'John Doe',
      position: 'Senior Sales Consultant',
      role: UserRole.SC,
      status: UserStatus.ACTIVE,
      forcePasswordChange: true,
      photoUrl: null
    }
  });
  console.log(`✅ SC created: ${sc1.email} / Password123!`);

  const sc2 = await prisma.user.create({
    data: {
      email: 'jane.smith@byd.com',
      passwordHash: scPassword,
      fullName: 'Jane Smith',
      position: 'Sales Consultant',
      role: UserRole.SC,
      status: UserStatus.ACTIVE,
      forcePasswordChange: true,
      photoUrl: null
    }
  });
  console.log(`✅ SC created: ${sc2.email} / Password123!`);

  const sc3 = await prisma.user.create({
    data: {
      email: 'mike.johnson@byd.com',
      passwordHash: scPassword,
      fullName: 'Mike Johnson',
      position: 'Sales Consultant',
      role: UserRole.SC,
      status: UserStatus.ACTIVE,
      forcePasswordChange: true,
      photoUrl: null
    }
  });
  console.log(`✅ SC created: ${sc3.email} / Password123!`);

  // Create a disabled user for testing
  const disabledUser = await prisma.user.create({
    data: {
      email: 'disabled@byd.com',
      passwordHash: scPassword,
      fullName: 'Disabled User',
      position: 'Former Sales Consultant',
      role: UserRole.SC,
      status: UserStatus.DISABLED,
      forcePasswordChange: false,
      photoUrl: null
    }
  });
  console.log(`✅ Disabled user created: ${disabledUser.email}`);

  // Create sample leads
  console.log('📋 Creating sample leads...');
  const lead1 = await prisma.lead.create({
    data: {
      firstName: 'Alice',
      lastName: 'Williams',
      email: 'alice.williams@email.com',
      phone: '+1234567890',
      source: 'Website',
      interestedModel: 'BYD ATTO 3',
      preferredColor: 'Blue',
      status: 'NEW',
      assignedToId: sc1.id
    }
  });

  const lead2 = await prisma.lead.create({
    data: {
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'bob.brown@email.com',
      phone: '+1234567891',
      source: 'Referral',
      interestedModel: 'BYD SEAL',
      preferredColor: 'White',
      status: 'CONTACTED',
      assignedToId: sc2.id
    }
  });

  const lead3 = await prisma.lead.create({
    data: {
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol.davis@email.com',
      phone: '+1234567892',
      source: 'Walk-in',
      interestedModel: 'BYD DOLPHIN',
      preferredColor: 'Red',
      status: 'QUALIFIED',
      assignedToId: sc1.id
    }
  });

  console.log(`✅ Created ${3} sample leads`);

  // Create sample activities
  console.log('📅 Creating sample activities...');
  await prisma.activity.create({
    data: {
      leadId: lead2.id,
      type: 'TEST_DRIVE',
      notes: 'Customer interested in test drive next week',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.activity.create({
    data: {
      leadId: lead3.id,
      type: 'RESERVATION',
      notes: 'Reservation confirmed',
      completedDate: new Date()
    }
  });

  console.log(`✅ Created sample activities`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Account:');
  console.log('  Email: bydiloilo@gmail.com');
  console.log('  Password: admin123');
  console.log('  Role: ADMIN');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Sales Consultant Accounts:');
  console.log('  Email: john.doe@byd.com');
  console.log('  Email: jane.smith@byd.com');
  console.log('  Email: mike.johnson@byd.com');
  console.log('  Password: Password123! (all)');
  console.log('  Role: SC');
  console.log('  Note: Force password change on first login');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
