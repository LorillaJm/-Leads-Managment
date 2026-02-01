import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService.js';
import { AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const analyticsService = new AnalyticsService();

const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

const performancePeriodSchema = z.object({
  period: z.enum(['week', 'month', 'year']).optional()
});

export class AnalyticsController {
  async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const dateRange = dateRangeSchema.parse(req.query);
      const stats = await analyticsService.getDashboardStats(
        req.user!.id,
        req.user!.role,
        dateRange
      );

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversionFunnel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const funnel = await analyticsService.getConversionFunnel(
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        data: { funnel }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPerformanceMetrics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { period } = performancePeriodSchema.parse(req.query);
      const metrics = await analyticsService.getPerformanceMetrics(
        req.user!.id,
        req.user!.role,
        period
      );

      res.json({
        success: true,
        data: { metrics }
      });
    } catch (error) {
      next(error);
    }
  }

  async getSalesConsultantRanking(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const compareMonths = req.query.compare === 'true';
      const rankings = await analyticsService.getSalesConsultantRanking(compareMonths);

      res.json({
        success: true,
        data: { rankings }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPerformanceTrends(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { period } = performancePeriodSchema.parse(req.query);
      const trends = await analyticsService.getPerformanceTrends(
        req.user!.id,
        req.user!.role,
        period
      );

      res.json({
        success: true,
        data: { trends }
      });
    } catch (error) {
      next(error);
    }
  }
}