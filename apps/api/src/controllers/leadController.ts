import { Response, NextFunction } from 'express';
import { LeadService } from '../services/leadService.js';
import { AuthRequest } from '../middleware/auth.js';
import { createLeadSchema, updateLeadSchema, leadFiltersSchema, paginationSchema } from '@lead-management/shared';

const leadService = new LeadService();

export class LeadController {
  async createLead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createLeadSchema.parse(req.body);
      const lead = await leadService.createLead(validatedData, req.user!.id, req.user!.role);

      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: { lead }
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeads(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filters = leadFiltersSchema.parse(req.query);
      const pagination = paginationSchema.parse(req.query);

      const result = await leadService.getLeads(
        filters,
        pagination,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeadById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const lead = await leadService.getLeadById(id, req.user!.id, req.user!.role);

      res.json({
        success: true,
        data: { lead }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateLeadSchema.parse(req.body);
      const lead = await leadService.updateLead(id, validatedData, req.user!.id, req.user!.role);

      res.json({
        success: true,
        message: 'Lead updated successfully',
        data: { lead }
      });
    } catch (error) {
      next(error);
    }
  }

  // NOTE: Delete and restore methods removed per business requirements
  // Leads must NEVER be deleted

  async getLeadStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await leadService.getLeadStats(req.user!.id, req.user!.role);

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }
}