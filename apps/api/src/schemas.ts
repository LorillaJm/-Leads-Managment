import { z } from 'zod';
import { UserRole, UserStatus, LeadStatus, InterestLevel, ActivityType } from './types.js';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  position: z.string().optional(),
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
  role: z.nativeEnum(UserRole),
  position: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().min(1).optional(),
  role: z.nativeEnum(UserRole).optional(),
  position: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6),
});

export const userFiltersSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  search: z.string().optional(),
});

// Lead schemas
export const createLeadSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(1),
  address: z.string().optional(),
  interestLevel: z.nativeEnum(InterestLevel),
  vehicleType: z.string().optional(),
  remarks: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
});

export const updateLeadSchema = z.object({
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  address: z.string().optional(),
  interestLevel: z.nativeEnum(InterestLevel).optional(),
  vehicleType: z.string().optional(),
  remarks: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
});

export const leadFiltersSchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  interestLevel: z.nativeEnum(InterestLevel).optional(),
  vehicleType: z.string().optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Activity schemas
export const createActivitySchema = z.object({
  leadId: z.string(),
  type: z.nativeEnum(ActivityType),
  description: z.string().min(1),
  scheduledAt: z.string().datetime().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
