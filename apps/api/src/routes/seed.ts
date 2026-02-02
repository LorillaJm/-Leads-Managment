import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

router.post('/seed', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'bydiloilo@gmail.com' }
    });

    if (existingAdmin) {
      return res.json({
        success: true,
        message: 'Database already seeded',
        admin: {
          email: existingAdmin.email,
          fullName: existingAdmin.fullName
        }
      });
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'bydiloilo@gmail.com',
        passwordHash,
        fullName: 'Admin User',
        position: 'System Administrator',
        role: 'ADMIN',
        status: 'ACTIVE',
        forcePasswordChange: false
      }
    });

    res.json({
      success: true,
      message: 'Database seeded successfully',
      admin: {
        email: admin.email,
        fullName: admin.fullName,
        credentials: {
          email: 'bydiloilo@gmail.com',
          password: 'admin123'
        }
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as seedRouter };
