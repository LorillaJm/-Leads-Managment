export enum UserRole {
  ADMIN = 'ADMIN',
  SC = 'SC'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED'
}

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  TEST_DRIVE = 'TEST_DRIVE',
  RESERVATION = 'RESERVATION',
  BANK_APPLICATION = 'BANK_APPLICATION',
  CLOSED_DEAL = 'CLOSED_DEAL',
  LOST = 'LOST'
}

export enum LeadSource {
  WALK_IN = 'WALK_IN',
  REFERRAL = 'REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  DISPLAY = 'DISPLAY'
}

export enum InterestLevel {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD'
}

export enum VehicleType {
  BEV = 'BEV', // Battery Electric Vehicle
  HEV = 'HEV', // Hybrid Electric Vehicle
  ICE = 'ICE'  // Internal Combustion Engine
}

export enum ActivityType {
  TEST_DRIVE = 'TEST_DRIVE',
  RESERVATION = 'RESERVATION',
  BANK_APPLICATION = 'BANK_APPLICATION',
  CLOSED_DEAL = 'CLOSED_DEAL'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  position?: string;
  role: UserRole;
  photoUrl?: string;
  status: UserStatus;
  forcePasswordChange: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: LeadSource | string;
  interestedModel: string;
  preferredColor: string;
  interestLevel: InterestLevel | string;
  vehicleType?: VehicleType | string;
  remarks?: string;
  status: LeadStatus;
  assignedToId: string;
  assignedTo: User;
  activities?: Activity[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  notes?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  chassisNumber?: string;
  vsiNumber?: string;
  dateReleased?: Date;
  bankName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClosedDeal {
  id: string;
  leadId: string;
  lead: Lead;
  chassisNumber: string;
  vsiNumber: string;
  dateReleased: Date;
  salePrice: number;
  createdAt: Date;
  updatedAt: Date;
}