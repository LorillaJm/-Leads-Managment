import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole } from '../types.js';
import type { PaginationInput } from '../types.js';

const prisma = new PrismaClient();

export class ClosedDealService {
  async getClosedDeals(
    pagination: PaginationInput,
    userId: string,
    userRole: string,
    filters?: {
      search?: string;
      startDate?: string;
      endDate?: string;
    }
  ) {
    const { page, limit } = pagination;
    const { search, startDate, endDate } = filters || {};

    const where: any = {};

    // RBAC: Sales consultants only see their own closed deals
    if (userRole === UserRole.SC) {
      where.lead = {
        assignedToId: userId
      };
    }

    // Date range filter
    if (startDate || endDate) {
      where.dateReleased = {};
      if (startDate) {
        where.dateReleased.gte = new Date(startDate);
      }
      if (endDate) {
        where.dateReleased.lte = new Date(endDate);
      }
    }

    // Search across lead name, chassis, VSI
    if (search && search.trim()) {
      where.OR = [
        { chassisNumber: { contains: search, mode: 'insensitive' } },
        { vsiNumber: { contains: search, mode: 'insensitive' } },
        {
          lead: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ]
          }
        }
      ];
    }

    const [closedDeals, total] = await Promise.all([
      prisma.closedDeal.findMany({
        where,
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
        },
        orderBy: {
          dateReleased: 'desc'
        },
        skip: ((page || 1) - 1) * (limit || 10),
        take: limit || 10
      }),
      prisma.closedDeal.count({ where })
    ]);

    return {
      closedDeals,
      pagination: {
        page: page || 1,
        limit: limit || 10,
        total,
        totalPages: Math.ceil(total / (limit || 10))
      }
    };
  }

  async getClosedDealById(id: string, userId: string, userRole: string) {
    const closedDeal = await prisma.closedDeal.findUnique({
      where: { id },
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

    if (!closedDeal) {
      throw new AppError('Closed deal not found', 404);
    }

    // RBAC: Sales consultants can only view their own closed deals
    if (userRole === UserRole.SC && closedDeal.lead.assignedToId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return closedDeal;
  }

  async updateClosedDeal(
    id: string,
    data: { salePrice?: number },
    userId: string,
    userRole: string
  ) {
    // Verify access
    await this.getClosedDealById(id, userId, userRole);

    const closedDeal = await prisma.closedDeal.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
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

    return closedDeal;
  }

  async getClosedDealStats(userId: string, userRole: string) {
    const where: any = {};

    // RBAC: Sales consultants only see their own stats
    if (userRole === UserRole.SC) {
      where.lead = {
        assignedToId: userId
      };
    }

    const [total, totalRevenue, avgSalePrice, recentDeals] = await Promise.all([
      prisma.closedDeal.count({ where }),
      prisma.closedDeal.aggregate({
        where,
        _sum: {
          salePrice: true
        }
      }),
      prisma.closedDeal.aggregate({
        where,
        _avg: {
          salePrice: true
        }
      }),
      prisma.closedDeal.findMany({
        where,
        take: 5,
        orderBy: {
          dateReleased: 'desc'
        },
        include: {
          lead: {
            include: {
              assignedTo: {
                select: {
                  id: true,
                  fullName: true
                }
              }
            }
          }
        }
      })
    ]);

    return {
      total,
      totalRevenue: totalRevenue._sum.salePrice || 0,
      avgSalePrice: avgSalePrice._avg.salePrice || 0,
      recentDeals
    };
  }

  async exportClosedDeals(userId: string, userRole: string) {
    const where: any = {};

    // RBAC: Sales consultants only export their own deals
    if (userRole === UserRole.SC) {
      where.lead = {
        assignedToId: userId
      };
    }

    const closedDeals = await prisma.closedDeal.findMany({
      where,
      include: {
        lead: {
          include: {
            assignedTo: {
              select: {
                fullName: true
              }
            }
          }
        }
      },
      orderBy: {
        dateReleased: 'desc'
      }
    });

    // Convert to CSV format
    const headers = [
      'Customer Name',
      'Email',
      'Phone',
      'Model',
      'Color',
      'Chassis Number',
      'VSI Number',
      'Date Released',
      'Sale Price',
      'Sales Consultant',
      'Created Date'
    ];

    const rows = closedDeals.map((deal: any) => [
      `${deal.lead.firstName} ${deal.lead.lastName}`,
      deal.lead.email,
      deal.lead.phone,
      deal.lead.interestedModel,
      deal.lead.preferredColor,
      deal.chassisNumber,
      deal.vsiNumber,
      new Date(deal.dateReleased).toLocaleDateString(),
      deal.salePrice.toString(),
      deal.lead.assignedTo.fullName,
      new Date(deal.createdAt).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }
}

