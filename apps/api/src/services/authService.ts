import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';
import { UserStatus } from '../types.js';
import type { LoginInput, RegisterInput, ChangePasswordInput } from '../types.js';

const prisma = new PrismaClient();

export class AuthService {
  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        position: data.position || null,
        role: data.role,
        status: UserStatus.ACTIVE,
        forcePasswordChange: false
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        position: true,
        role: true,
        photoUrl: true,
        status: true,
        forcePasswordChange: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const tokens = this.generateTokens(user.id);

    return { user, tokens };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is disabled
    if (user.status === UserStatus.DISABLED) {
      throw new AppError('Account has been disabled', 403);
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const tokens = this.generateTokens(user.id);

    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isValidPassword = await bcrypt.compare(data.currentPassword, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 401);
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        forcePasswordChange: false
      }
    });

    return { message: 'Password changed successfully' };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          fullName: true,
          position: true,
          role: true,
          photoUrl: true,
          status: true,
          forcePasswordChange: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new AppError('User not found', 401);
      }

      // Check if user is disabled
      if (user.status === UserStatus.DISABLED) {
        throw new AppError('Account has been disabled', 403);
      }

      const tokens = this.generateTokens(user.id);

      return { user, tokens };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        position: true,
        role: true,
        photoUrl: true,
        status: true,
        forcePasswordChange: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}
