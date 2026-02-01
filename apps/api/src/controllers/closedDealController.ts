import { Response, NextFunction } from 'express';
import { ClosedDealService } from '../services/closedDealService.js';
import { AuthRequest } from '../middleware/auth.js';
import { paginationSchema } from '../schemas.js';
import { z } from 'zod';

const closedDealService = new ClosedDealService();

const closedDealFiltersSchema = z.object({
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

const updateClosedDealSchema = z.object({
  salePrice: z.number().min(0).optional()
});

export class ClosedDealController {
  async getClosedDeals(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const pagination = paginationSchema.parse(req.query);
      const filters = closedDealFiltersSchema.parse(req.query);

      const result = await closedDealService.getClosedDeals(
        pagination,
        req.user!.id,
        req.user!.role,
        filters
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getClosedDealById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const closedDeal = await closedDealService.getClosedDealById(
        id,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        data: { closedDeal }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClosedDeal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateClosedDealSchema.parse(req.body);
      
      const closedDeal = await closedDealService.updateClosedDeal(
        id,
        validatedData,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        message: 'Closed deal updated successfully',
        data: { closedDeal }
      });
    } catch (error) {
      next(error);
    }
  }

  async getClosedDealStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await closedDealService.getClosedDealStats(
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  async exportClosedDeals(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const csv = await closedDealService.exportClosedDeals(
        req.user!.id,
        req.user!.role
      );

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=closed-deals-${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}