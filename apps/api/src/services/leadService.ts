import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole, LeadStatus, InterestLevel } from '../types.js';
import type { CreateLeadInput, UpdateLeadInput, LeadFiltersInput, PaginationInput } from '../types.js';

const prisma = new PrismaClient();

const userSelectFields = {
  id: true,
  email: true,
  fullName: true,
  role: true
};

export class LeadService {
  async createLead(data: CreateLeadInput, createdById: string, createdByRole: string) {
    // If no assignedToId provided and user is SC, assign to themselves
    const assignedToId = data.assignedToId || (createdByRole === UserRole.SC ? createdById : undefined);

    if (!assignedToId) {
      throw new AppError('Lead must be assigned to a sales consultant', 400);
    }

    // Verify the assigned user exists and is a sales consultant
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedToId }
    });

    if (!assignedUser) {
      throw new AppError('Assigned user not found', 404);
    }

    if (assignedUser.role !== UserRole.SC) {
      throw new AppError('Leads can only be assigned to sales consultants', 400);
    }

    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        source: data.source,
        interestedModel: data.interestedModel,
        preferredColor: data.preferredColor,
        interestLevel: data.interestLevel || 'WARM',
        vehicleType: data.vehicleType,
        remarks: data.remarks,
        assignedToId,
        status: LeadStatus.NEW
      },
      include: {
        assignedTo: {
          select: userSelectFields
        }
      }
    });

    return lead;
  }

  async getLeads(
    filters: LeadFiltersInput,
    pagination: PaginationInput,
    userId: string,
    userRole: string
  ) {
    const { page, limit } = pagination;
    const { status, source, interestLevel, vehicleType, interestedModel, assignedToId, search } = filters;

    const where: any = {
      // Note: deletedAt check removed per requirements - leads are never deleted
    };

    // RBAC: Sales consultants only see their own leads
    if (userRole === UserRole.SC) {
      where.assignedToId = userId;
    }

    // Apply filters
    if (status) where.status = status;
    if (source) where.source = source;
    if (interestLevel) where.interestLevel = interestLevel;
    if (vehicleType) where.vehicleType = vehicleType;
    if (interestedModel) where.interestedModel = interestedModel;
    if (assignedToId && userRole === UserRole.ADMIN) {
      where.assignedToId = assignedToId;
    }

    // Search across multiple fields (only if search is a valid string)
    if (search && search !== 'undefined' && search.trim()) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          assignedTo: {
            select: userSelectFields
          },
          activities: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1 // Get latest activity for display
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.lead.count({ where })
    ]);

    return {
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getLeadById(id: string, userId: string, userRole: string) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: userSelectFields
        },
        activities: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // RBAC: Sales consultants can only view their own leads
    if (userRole === UserRole.SC && lead.assignedToId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return lead;
  }

  async updateLead(id: string, data: UpdateLeadInput, userId: string, userRole: string) {
    // First check if lead exists and user has access
    await this.getLeadById(id, userId, userRole);

    // If assignedToId is being changed, verify the new user
    if (data.assignedToId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: data.assignedToId }
      });

      if (!assignedUser) {
        throw new AppError('Assigned user not found', 404);
      }

      if (assignedUser.role !== UserRole.SC) {
        throw new AppError('Leads can only be assigned to sales consultants', 400);
      }
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        assignedTo: {
          select: userSelectFields
        }
      }
    });

    return lead;
  }

  // NOTE: Delete and restore methods removed per business requirements
  // Leads must NEVER be deleted - only status changes are allowed

  async getLeadStats(userId: string, userRole: string) {
    const where: any = {
      // No deletedAt filter - leads are never deleted per requirements
    };

    // RBAC: Sales consultants only see their own stats
    if (userRole === UserRole.SC) {
      where.assignedToId = userId;
    }

    const [total, byStatus, bySources, byInterest, byVehicleType] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.groupBy({
        by: ['status'],
        where,
        _count: true
      }),
      prisma.lead.groupBy({
        by: ['source'],
        where,
        _count: true
      }),
      prisma.lead.groupBy({
        by: ['interestLevel'],
        where,
        _count: true
      }),
      prisma.lead.groupBy({
        by: ['vehicleType'],
        where: { ...where, vehicleType: { not: null } },
        _count: true
      })
    ]);

    return {
      total,
      byStatus,
      bySources,
      byInterest,
      byVehicleType
    };
  }
}