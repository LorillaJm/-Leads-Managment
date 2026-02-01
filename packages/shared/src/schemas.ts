import { z } from 'zod';
import { UserRole, UserStatus, LeadStatus, LeadSource, InterestLevel, VehicleType, ActivityType } from './types.js';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  position: z.string().optional(),
  role: z.nativeEnum(UserRole)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
});

// User management schemas (Admin only)
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required'),
  position: z.string().min(1, 'Position is required'),
  role: z.nativeEnum(UserRole),
  temporaryPassword: z.string().min(8, 'Password must be at least 8 characters'),
  photoUrl: z.string().url().optional().or(z.literal('')),
  forcePasswordChange: z.boolean().default(true)
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').optional(),
  position: z.string().min(1, 'Position is required').optional(),
  role: z.nativeEnum(UserRole).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  status: z.nativeEnum(UserStatus).optional()
});

export const resetPasswordSchema = z.object({
  temporaryPassword: z.string().min(8, 'Password must be at least 8 characters')
});

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10)
});

// Lead schemas
export const createLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  source: z.nativeEnum(LeadSource),
  interestedModel: z.string().min(1, 'Interested model is required'),
  preferredColor: z.string().min(1, 'Preferred color is required'),
  interestLevel: z.nativeEnum(InterestLevel).default(InterestLevel.WARM),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  remarks: z.string().optional(),
  assignedToId: z.string().optional()
});

export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z.nativeEnum(LeadStatus).optional()
});

// Activity schemas
export const createActivitySchema = z.object({
  leadId: z.string(),
  type: z.nativeEnum(ActivityType),
  notes: z.string().optional(),
  scheduledDate: z.string().datetime().optional(),
  completedDate: z.string().datetime().optional(),
  chassisNumber: z.string().optional(),
  vsiNumber: z.string().optional(),
  dateReleased: z.string().datetime().optional(),
  bankName: z.string().optional()
});

// Query schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10)
});

export const leadFiltersSchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  interestLevel: z.nativeEnum(InterestLevel).optional(),
  vehicleType: z.nativeEnum(VehicleType).optional(),
  interestedModel: z.string().optional(),
  assignedToId: z.string().optional(),
  search: z.string().optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UserFiltersInput = z.infer<typeof userFiltersSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type LeadFiltersInput = z.infer<typeof leadFiltersSchema>;