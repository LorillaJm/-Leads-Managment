import { PrismaClient } from '@prisma/client';
import { UserRole, LeadStatus } from '../types.js';

const prisma = new PrismaClient();

export class AnalyticsService {
  async getDashboardStats(userId: string, userRole: string, dateRange?: { startDate?: string; endDate?: string }) {
    const where: any = {
      deletedAt: null
    };

    // RBAC: Sales consultants only see their own stats
    if (userRole === UserRole.SC) {
      where.assignedToId = userId;
    }

    // Date range filter
    if (dateRange?.startDate || dateRange?.endDate) {
      where.createdAt = {};
      if (dateRange.startDate) {
        where.createdAt.gte = new Date(dateRange.startDate);
      }
      if (dateRange.endDate) {
        where.createdAt.lte = new Date(dateRange.endDate);
      }
    }

    // Get lead statistics
    const [
      totalLeads,
      newLeads,
      qualifiedLeads,
      closedDeals,
      lostLeads,
      leadsByStatus,
      leadsBySource,
      leadsByModel,
      leadsByColor
    ] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.count({ where: { ...where, status: LeadStatus.NEW } }),
      prisma.lead.count({ 
        where: { 
          ...where, 
          status: { 
            in: [LeadStatus.QUALIFIED, LeadStatus.TEST_DRIVE, LeadStatus.RESERVATION, LeadStatus.BANK_APPLICATION] 
          } 
        } 
      }),
      prisma.lead.count({ where: { ...where, status: LeadStatus.CLOSED_DEAL } }),
      prisma.lead.count({ where: { ...where, status: LeadStatus.LOST } }),
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
        by: ['interestedModel'],
        where,
        _count: true
      }),
      prisma.lead.groupBy({
        by: ['preferredColor'],
        where,
        _count: true
      })
    ]);

    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? (closedDeals / totalLeads) * 100 : 0;

    // Get closed deals revenue
    const closedDealWhere: any = {};
    if (userRole === UserRole.SC) {
      closedDealWhere.lead = { assignedToId: userId };
    }
    if (dateRange?.startDate || dateRange?.endDate) {
      closedDealWhere.dateReleased = {};
      if (dateRange.startDate) {
        closedDealWhere.dateReleased.gte = new Date(dateRange.startDate);
      }
      if (dateRange.endDate) {
        closedDealWhere.dateReleased.lte = new Date(dateRange.endDate);
      }
    }

    const revenueData = await prisma.closedDeal.aggregate({
      where: closedDealWhere,
      _sum: {
        salePrice: true
      },
      _avg: {
        salePrice: true
      }
    });

    return {
      kpis: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        closedDeals,
        lostLeads,
        conversionRate: Math.round(conversionRate * 100) / 100,
        totalRevenue: revenueData._sum.salePrice || 0,
        avgDealSize: revenueData._avg.salePrice || 0
      },
      charts: {
        leadsByStatus: leadsByStatus.map(item => ({
          status: item.status,
          count: item._count
        })),
        leadsBySource: leadsBySource.map(item => ({
          source: item.source,
          count: item._count
        })),
        leadsByModel: leadsByModel.map(item => ({
          model: item.interestedModel,
          count: item._count
        })),
        leadsByColor: leadsByColor.map(item => ({
          color: item.preferredColor,
          count: item._count
        }))
      }
    };
  }

  async getConversionFunnel(userId: string, userRole: string) {
    const where: any = {
      deletedAt: null
    };

    // RBAC: Sales consultants only see their own funnel
    if (userRole === UserRole.SC) {
      where.assignedToId = userId;
    }

    const funnelStages = [
      { stage: 'New Leads', status: LeadStatus.NEW },
      { stage: 'Contacted', status: LeadStatus.CONTACTED },
      { stage: 'Qualified', status: LeadStatus.QUALIFIED },
      { stage: 'Test Drive', status: LeadStatus.TEST_DRIVE },
      { stage: 'Reservation', status: LeadStatus.RESERVATION },
      { stage: 'Bank Application', status: LeadStatus.BANK_APPLICATION },
      { stage: 'Closed Deal', status: LeadStatus.CLOSED_DEAL }
    ];

    const funnelData = await Promise.all(
      funnelStages.map(async ({ stage, status }) => {
        const count = await prisma.lead.count({
          where: { ...where, status }
        });
        return { stage, count };
      })
    );

    return funnelData;
  }

  async getPerformanceMetrics(userId: string, userRole: string, period: 'week' | 'month' | 'year' = 'month') {
    // Calculate date range based on period
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const where: any = {
      deletedAt: null,
      createdAt: {
        gte: startDate
      }
    };

    // RBAC: Sales consultants only see their own performance
    if (userRole === UserRole.SC) {
      where.assignedToId = userId;
    }

    const [leadsCreated, leadsConverted, activities] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.count({ 
        where: { 
          ...where, 
          status: LeadStatus.CLOSED_DEAL 
        } 
      }),
      prisma.activity.count({
        where: {
          createdAt: {
            gte: startDate
          },
          ...(userRole === UserRole.SC && {
            lead: {
              assignedToId: userId
            }
          })
        }
      })
    ]);

    const conversionRate = leadsCreated > 0 ? (leadsConverted / leadsCreated) * 100 : 0;

    return {
      period,
      leadsCreated,
      leadsConverted,
      conversionRate: Math.round(conversionRate * 100) / 100,
      activitiesLogged: activities
    };
  }

  async getSalesConsultantRanking(compareMonths: boolean = false) {
    // Get all sales consultants with their stats
    const consultants = await prisma.user.findMany({
      where: {
        role: UserRole.SC
      },
      select: {
        id: true,
        fullName: true,
        email: true
      }
    });

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const rankings = await Promise.all(
      consultants.map(async (consultant) => {
        // Current period stats
        const [totalLeads, closedDeals, revenue] = await Promise.all([
          prisma.lead.count({
            where: {
              assignedToId: consultant.id,
              deletedAt: null,
              ...(compareMonths && {
                createdAt: { gte: thisMonthStart }
              })
            }
          }),
          prisma.lead.count({
            where: {
              assignedToId: consultant.id,
              status: LeadStatus.CLOSED_DEAL,
              deletedAt: null,
              ...(compareMonths && {
                createdAt: { gte: thisMonthStart }
              })
            }
          }),
          prisma.closedDeal.aggregate({
            where: {
              lead: {
                assignedToId: consultant.id
              },
              ...(compareMonths && {
                dateReleased: { gte: thisMonthStart }
              })
            },
            _sum: {
              salePrice: true
            }
          })
        ]);

        const conversionRate = totalLeads > 0 ? (closedDeals / totalLeads) * 100 : 0;

        let previousMetrics = null;
        if (compareMonths) {
          // Previous month stats
          const [prevTotalLeads, prevClosedDeals, prevRevenue] = await Promise.all([
            prisma.lead.count({
              where: {
                assignedToId: consultant.id,
                deletedAt: null,
                createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
              }
            }),
            prisma.lead.count({
              where: {
                assignedToId: consultant.id,
                status: LeadStatus.CLOSED_DEAL,
                deletedAt: null,
                createdAt: { gte: lastMonthStart, lte: lastMonthEnd }
              }
            }),
            prisma.closedDeal.aggregate({
              where: {
                lead: {
                  assignedToId: consultant.id
                },
                dateReleased: { gte: lastMonthStart, lte: lastMonthEnd }
              },
              _sum: {
                salePrice: true
              }
            })
          ]);

          const prevConversionRate = prevTotalLeads > 0 ? (prevClosedDeals / prevTotalLeads) * 100 : 0;

          previousMetrics = {
            totalLeads: prevTotalLeads,
            closedDeals: prevClosedDeals,
            conversionRate: Math.round(prevConversionRate * 100) / 100,
            totalRevenue: prevRevenue._sum.salePrice || 0
          };
        }

        return {
          consultant: {
            id: consultant.id,
            name: consultant.fullName,
            email: consultant.email
          },
          metrics: {
            totalLeads,
            closedDeals,
            conversionRate: Math.round(conversionRate * 100) / 100,
            totalRevenue: revenue._sum.salePrice || 0
          },
          ...(previousMetrics && { previousMetrics })
        };
      })
    );

    // Sort by closed deals (descending)
    rankings.sort((a, b) => b.metrics.closedDeals - a.metrics.closedDeals);

    return rankings;
  }

  async getPerformanceTrends(userId: string, userRole: string, period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    const dataPoints: Array<{ date: string; leads: number; conversions: number; revenue: number }> = [];
    
    let intervals = 7;
    let intervalUnit: 'day' | 'week' | 'month' = 'day';
    
    switch (period) {
      case 'week':
        intervals = 7;
        intervalUnit = 'day';
        break;
      case 'month':
        intervals = 4;
        intervalUnit = 'week';
        break;
      case 'year':
        intervals = 12;
        intervalUnit = 'month';
        break;
    }

    for (let i = intervals - 1; i >= 0; i--) {
      const endDate = new Date(now);
      const startDate = new Date(now);

      if (intervalUnit === 'day') {
        startDate.setDate(now.getDate() - i);
        endDate.setDate(now.getDate() - i);
        endDate.setHours(23, 59, 59, 999);
      } else if (intervalUnit === 'week') {
        startDate.setDate(now.getDate() - (i + 1) * 7);
        endDate.setDate(now.getDate() - i * 7);
      } else if (intervalUnit === 'month') {
        startDate.setMonth(now.getMonth() - (i + 1));
        endDate.setMonth(now.getMonth() - i);
      }

      const where: any = {
        deletedAt: null,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      };

      if (userRole === UserRole.SC) {
        where.assignedToId = userId;
      }

      const [leadsCount, conversionsCount] = await Promise.all([
        prisma.lead.count({ where }),
        prisma.lead.count({ 
          where: { 
            ...where, 
            status: LeadStatus.CLOSED_DEAL 
          } 
        })
      ]);

      const revenueData = await prisma.closedDeal.aggregate({
        where: {
          dateReleased: {
            gte: startDate,
            lte: endDate
          },
          ...(userRole === UserRole.SC && {
            lead: {
              assignedToId: userId
            }
          })
        },
        _sum: {
          salePrice: true
        }
      });

      let dateLabel = '';
      if (intervalUnit === 'day') {
        dateLabel = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (intervalUnit === 'week') {
        dateLabel = `Week ${intervals - i}`;
      } else {
        dateLabel = startDate.toLocaleDateString('en-US', { month: 'short' });
      }

      dataPoints.push({
        date: dateLabel,
        leads: leadsCount,
        conversions: conversionsCount,
        revenue: revenueData._sum.salePrice || 0
      });
    }

    return dataPoints;
  }
}
