import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { auditService, AuditEntity, AuditAction } from '../services/auditService.js';
import { z } from 'zod';

const auditQuerySchema = z.object({
  userId: z.string().optional(),
  entity: z.nativeEnum(AuditEntity).optional(),
  action: z.nativeEnum(AuditAction).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export class AuditController {
  async getAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = auditQuerySchema.parse(req.query);

      const filters = {
        userId: query.userId,
        entity: query.entity,
        action: query.action,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        page: query.page ? parseInt(query.page) : undefined,
        limit: query.limit ? parseInt(query.limit) : undefined,
      };

      const result = await auditService.getAuditLogs(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEntityAuditTrail(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { entity, entityId } = req.params;

      if (!Object.values(AuditEntity).includes(entity as AuditEntity)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid entity type',
        });
      }

      const logs = await auditService.getEntityAuditTrail(entity as AuditEntity, entityId);

      res.json({
        success: true,
        data: { logs },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserActivitySummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;

      const summary = await auditService.getUserActivitySummary(userId, days);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async exportAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = auditQuerySchema.parse(req.query);

      const filters = {
        userId: query.userId,
        entity: query.entity,
        action: query.action,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        limit: 10000, // Max export limit
      };

      const result = await auditService.getAuditLogs(filters);

      // Convert to CSV
      const csv = this.convertToCSV(result.logs);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  private convertToCSV(logs: any[]): string {
    if (logs.length === 0) return '';

    const headers = ['Timestamp', 'User ID', 'Action', 'Entity', 'Entity ID', 'IP Address', 'User Agent', 'Changes'];
    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.userId,
      log.action,
      log.entity,
      log.entityId || '',
      log.ipAddress || '',
      log.userAgent || '',
      log.changes ? JSON.stringify(log.changes) : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return csvContent;
  }
}
