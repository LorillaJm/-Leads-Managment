import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole, UserStatus } from '../types.js';
import type { CreateUserInput, UpdateUserInput, ResetPasswordInput, UserFiltersInput } from '../types.js';

const prisma = new PrismaClient();

export class UserService {
  // Get all users with pagination and filters (Admin only)
  async getAllUsers(filters: UserFiltersInput, requestingUserRole: UserRole) {
    if (requestingUserRole !== UserRole.ADMIN) {
      throw new AppError('Insufficient permissions', 403);
    }

    const { search, role, status, page, pageSize } = filters;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          position: true,
          role: true,
          photoUrl: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          forcePasswordChange: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: ((page || 1) - 1) * (pageSize || 10),
        take: pageSize || 10
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page: page || 1,
        pageSize: pageSize || 10,
        total,
        totalPages: Math.ceil(total / (pageSize || 10))
      }
    };
  }

  // Get user by ID
  async getUserById(id: string, requestingUserRole: UserRole, requestingUserId: string) {
    // Users can view their own profile, admin can view any profile
    if (requestingUserRole !== UserRole.ADMIN && requestingUserId !== id) {
      throw new AppError('Insufficient permissions', 403);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        position: true,
        role: true,
        photoUrl: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        forcePasswordChange: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Create new user (Admin only)
  async createUser(data: CreateUserInput, requestingUserRole: UserRole) {
    if (requestingUserRole !== UserRole.ADMIN) {
      throw new AppError('Insufficient permissions', 403);
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    // Hash the temporary password (generate one if not provided)
    const tempPassword = data.temporaryPassword || Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        position: data.position,
        role: data.role || UserRole.SC,
        photoUrl: data.photoUrl || null,
        forcePasswordChange: data.forcePasswordChange ?? true,
        status: UserStatus.ACTIVE
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        position: true,
        role: true,
        photoUrl: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        forcePasswordChange: true
      }
    });

    return user;
  }

  // Update user (Admin only)
  async updateUser(id: string, data: UpdateUserInput, requestingUserRole: UserRole) {
    if (requestingUserRole !== UserRole.ADMIN) {
      throw new AppError('Insufficient permissions', 403);
    }

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.role && { role: data.role }),
        ...(data.photoUrl !== undefined && { photoUrl: data.photoUrl || null }),
        ...(data.status && { status: data.status })
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        position: true,
        role: true,
        photoUrl: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        forcePasswordChange: true
      }
    });

    return user;
  }

  // Reset user password (Admin only)
  async resetUserPassword(id: string, data: ResetPasswordInput, requestingUserRole: UserRole) {
    if (requestingUserRole !== UserRole.ADMIN) {
      throw new AppError('Insufficient permissions', 403);
    }

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Hash the new password (generate one if not provided)
    const tempPassword = data.temporaryPassword || data.newPassword;
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    await prisma.user.update({
      where: { id },
      data: {
        passwordHash,
        forcePasswordChange: true
      }
    });

    return { message: 'Password reset successfully' };
  }

  // Update user status (Admin only)
  async updateUserStatus(id: string, status: UserStatus, requestingUserRole: UserRole, requestingUserId: string) {
    if (requestingUserRole !== UserRole.ADMIN) {
      throw new AppError('Insufficient permissions', 403);
    }

    // Prevent admin from disabling themselves
    if (id === requestingUserId) {
      throw new AppError('Cannot change your own status', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        email: true,
        fullName: true,
        position: true,
        role: true,
        photoUrl: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        forcePasswordChange: true
      }
    });

    return user;
  }

  // Get sales consultants (for assignment dropdowns)
  async getSalesConsultants() {
    const salesConsultants = await prisma.user.findMany({
      where: {
        role: UserRole.SC,
        status: UserStatus.ACTIVE
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        position: true,
        role: true,
        photoUrl: true
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    return salesConsultants;
  }
}
