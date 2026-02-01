import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';
import { ActivityType, LeadStatus } from '../types.js';
import type { CreateActivityInput } from '../types.js';

const prisma = new PrismaClient();

// Status progression rules based on activity type
const statusProgressionMap: Record<string, string> = {
  [ActivityType.CLOSED_DEAL]: LeadStatus.CLOSED_DEAL,
  [ActivityType.BANK_APPLICATION]: LeadStatus.BANK_APPLICATION,
};

export class ActivityService {
  async createActivity(data: CreateActivityInput, userId: string, userRole: string) {
    // Verify lead exists and user has access
    const lead = await prisma.lead.findUnique({
      where: { id: data.leadId },
      include: {
        assignedTo: true
      }
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    if (lead.deletedAt) {
      throw new AppError('Cannot add activity to deleted lead', 400);
    }

    // RBAC: Sales consultants can only add activities to their own leads
    if (userRole === 'SALES_CONSULTANT' && lead.assignedToId !== userId) {
      throw new AppError('Access denied', 403);
    }

    // Validate activity-specific fields
    if (data.type === ActivityType.CLOSED_DEAL) {
      if (!data.chassisNumber || !data.vsiNumber || !data.dateReleased) {
        throw new AppError('Closed deal requires chassis number, VSI number, and release date', 400);
      }
    }

    if (data.type === ActivityType.BANK_APPLICATION && !data.bankName) {
      throw new AppError('Bank application requires bank name', 400);
    }

    // Use transaction to create activity and update lead status
    const result = await prisma.$transaction(async (tx) => {
      // Create activity
      const activity = await tx.activity.create({
        data: {
          leadId: data.leadId,
          type: data.type,
          notes: data.notes,
          scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
          completedDate: data.completedDate ? new Date(data.completedDate) : new Date(),
          chassisNumber: data.chassisNumber,
          vsiNumber: data.vsiNumber,
          dateReleased: data.dateReleased ? new Date(data.dateReleased) : null,
          bankName: data.bankName,
        }
      });

      // Update lead status based on activity type
      const newStatus = statusProgressionMap[data.type];
      if (newStatus) {
        await tx.lead.update({
          where: { id: data.leadId },
          data: { status: newStatus }
        });
      }

      // If closed deal, create closed deal record
      if (data.type === ActivityType.CLOSED_DEAL) {
        // Check if closed deal already exists
        const existingDeal = await tx.closedDeal.findUnique({
          where: { leadId: data.leadId }
        });

        if (!existingDeal) {
          await tx.closedDeal.create({
            data: {
              leadId: data.leadId,
              chassisNumber: data.chassisNumber!,
              vsiNumber: data.vsiNumber!,
              dateReleased: new Date(data.dateReleased!),
              salePrice: 0, // Can be updated later
            }
          });
        }
      }

      return activity;
    });

    // Fetch the complete activity with lead info
    const completeActivity = await prisma.activity.findUnique({
      where: { id: result.id },
      include: {
        lead: {
          include: {
            assignedTo: {
              select: {
                id: true,
                email: true,
                fullName: true,
                role: true
              }
            }
          }
        }
      }
    });

    return completeActivity;
  }

  async getActivitiesByLeadId(leadId: string, userId: string, userRole: string) {
    // Verify lead exists and user has access
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    if (lead.deletedAt) {
      throw new AppError('Lead not found', 404);
    }

    // RBAC: Sales consultants can only view activities for their own leads
    if (userRole === 'SALES_CONSULTANT' && lead.assignedToId !== userId) {
      throw new AppError('Access denied', 403);
    }

    const activities = await prisma.activity.findMany({
      where: { leadId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return activities;
  }

  async getActivityById(id: string, userId: string, userRole: string) {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        lead: {
          include: {
            assignedTo: true
          }
        }
      }
    });

    if (!activity) {
      throw new AppError('Activity not found', 404);
    }

    // RBAC: Sales consultants can only view activities for their own leads
    if (userRole === 'SALES_CONSULTANT' && activity.lead.assignedToId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return activity;
  }

  async deleteActivity(id: string, userId: string, userRole: string) {
    const activity = await this.getActivityById(id, userId, userRole);

    // Don't allow deleting closed deal activities
    if (activity.type === ActivityType.CLOSED_DEAL) {
      throw new AppError('Cannot delete closed deal activity', 400);
    }

    await prisma.activity.delete({
      where: { id }
    });

    return { message: 'Activity deleted successfully' };
  }

  async getActivityStats(userId: string, userRole: string) {
    const where: any = {};

    // RBAC: Sales consultants only see stats for their own leads
    if (userRole === 'SALES_CONSULTANT') {
      where.lead = {
        assignedToId: userId
      };
    }

    const [total, byType] = await Promise.all([
      prisma.activity.count({ where }),
      prisma.activity.groupBy({
        by: ['type'],
        where,
        _count: true
      })
    ]);

    return {
      total,
      byType
    };
  }
}