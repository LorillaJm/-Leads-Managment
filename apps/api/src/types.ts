// Shared types for the API
export enum UserRole {
  ADMIN = 'ADMIN',
  SC = 'SC',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  TEST_DRIVE = 'TEST_DRIVE',
  RESERVATION = 'RESERVATION',
  BANK_APPLICATION = 'BANK_APPLICATION',
  CLOSED_DEAL = 'CLOSED_DEAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
  LOST = 'LOST',
}

export enum InterestLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ActivityType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  NOTE = 'NOTE',
  TASK = 'TASK',
  STATUS_CHANGE = 'STATUS_CHANGE',
  CLOSED_DEAL = 'CLOSED_DEAL',
  BANK_APPLICATION = 'BANK_APPLICATION',
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateLeadInput {
  fullName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  address?: string;
  source?: string;
  interestedModel?: string;
  preferredColor?: string;
  interestLevel: InterestLevel;
  vehicleType?: string;
  remarks?: string;
  status?: LeadStatus;
  assignedToId?: string;
}

export interface UpdateLeadInput {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  source?: string;
  interestedModel?: string;
  preferredColor?: string;
  interestLevel?: InterestLevel;
  vehicleType?: string;
  remarks?: string;
  status?: LeadStatus;
  assignedToId?: string;
}

export interface LeadFiltersInput {
  status?: LeadStatus;
  source?: string;
  interestLevel?: InterestLevel;
  vehicleType?: string;
  interestedModel?: string;
  assignedTo?: string;
  assignedToId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateUserInput {
  email: string;
  fullName: string;
  role: UserRole;
  position?: string;
  photoUrl?: string;
  temporaryPassword?: string;
  forcePasswordChange?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  fullName?: string;
  role?: UserRole;
  position?: string;
  photoUrl?: string;
  status?: UserStatus;
}

export interface ResetPasswordInput {
  newPassword: string;
  temporaryPassword?: string;
}

export interface UserFiltersInput {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  position?: string;
  role?: UserRole;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface CreateActivityInput {
  leadId: string;
  type: ActivityType;
  description: string;
  notes?: string;
  scheduledAt?: Date;
  scheduledDate?: string;
  completedDate?: string;
  chassisNumber?: string;
  vsiNumber?: string;
  dateReleased?: string;
  bankName?: string;
}
