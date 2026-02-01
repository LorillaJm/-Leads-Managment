import { Response, NextFunction } from 'express';
import { ActivityService } from '../services/activityService.js';
import { AuthRequest } from '../middleware/auth.js';
import { createActivitySchema } from '@lead-management/shared';

const activityService = new ActivityService();

export class ActivityController {
  async createActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createActivitySchema.parse(req.body);
      const activity = await activityService.createActivity(
        validatedData,
        req.user!.id,
        req.user!.role
      );

      res.status(201).json({
        success: true,
        message: 'Activity created successfully',
        data: { activity }
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivitiesByLeadId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { leadId } = req.params;
      const activities = await activityService.getActivitiesByLeadId(
        leadId,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        data: { activities }
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivityById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const activity = await activityService.getActivityById(
        id,
        req.user!.id,
        req.user!.role
      );

      res.json({
        success: true,
        data: { activity }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteActivity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await activityService.deleteActivity(id, req.user!.id, req.user!.role);

      res.json({
        success: true,
        message: 'Activity deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivityStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await activityService.getActivityStats(
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
}