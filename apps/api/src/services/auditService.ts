import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

const prisma = new PrismaClient();

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  EXPORT = 'EXPORT',
  VIEW = 'VIEW',
  RESTORE = 'RESTORE',
}

export enum AuditEntity {
  USER = 'User',
  LEAD = 'Lead',
  ACTIVITY = 'Activity',
  CLOSED_DEAL = 'ClosedDeal',
  AUTH = 'Auth',
  SYSTEM = 'System',
}

interface AuditLogData {
  userId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Create an audit log entry
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          changes: data.changes ? JSON.stringify(data.changes) : null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      // Log to console but don't throw - audit failures shouldn't break the app
      console.error('Audit log failed:', error);
    }
  }

  /**
   * Log from Express request
   */
  async logFromRequest(
    req: Request,
    userId: string,
    action: AuditAction,
    entity: AuditEntity,
    entityId?: string,
    changes?: any
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entity,
      entityId,
      changes,
      ipAddress: this.getIpAddress(req),
      userAgent: req.get('user-agent'),
    });
  }

  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(filters: {
    userId?: string;
    entity?: AuditEntity;
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { userId, entity, action, startDate, endDate, page = 1, limit = 50 } = filters;

    const where: any = {};

    if (userId) where.userId = userId;
    if (entity) where.entity = entity;
    if (action) where.action = action;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs: logs.map(log => ({
        ...log,
        changes: log.changes ? JSON.parse(log.changes) : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityAuditTrail(entity: AuditEntity, entityId: string) {
    const logs = await prisma.auditLog.findMany({
      where: {
        entity,
        entityId,
      },
      orderBy: { timestamp: 'desc' },
    });

    return logs.map(log => ({
      ...log,
      changes: log.changes ? JSON.parse(log.changes) : null,
    }));
  }

  /**
   * Get user activity summary
   */
  async getUserActivitySummary(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await prisma.auditLog.findMany({
      where: {
        userId,
        timestamp: { gte: startDate },
      },
    });

    const summary = {
      totalActions: logs.length,
      actionsByType: {} as Record<string, number>,
      actionsByEntity: {} as Record<string, number>,
      recentActivity: logs.slice(0, 10).map(log => ({
        action: log.action,
        entity: log.entity,
        timestamp: log.timestamp,
      })),
    };

    logs.forEach(log => {
      summary.actionsByType[log.action] = (summary.actionsByType[log.action] || 0) + 1;
      summary.actionsByEntity[log.entity] = (summary.actionsByEntity[log.entity] || 0) + 1;
    });

    return summary;
  }

  /**
   * Clean up old audit logs (for maintenance)
   */
  async cleanupOldLogs(daysToKeep: number = 365) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.auditLog.deleteMany({
      where: {
        timestamp: { lt: cutoffDate },
      },
    });

    return result.count;
  }

  /**
   * Extract IP address from request (handles proxies)
   */
  private getIpAddress(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0];
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  /**
   * Compare objects and return changes
   */
  static getChanges(oldData: any, newData: any): any {
    const changes: any = {
      before: {},
      after: {},
    };

    const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]);

    allKeys.forEach(key => {
      if (key === 'password' || key === 'updatedAt') return; // Skip sensitive/auto fields

      const oldValue = oldData?.[key];
      const newValue = newData?.[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.before[key] = oldValue;
        changes.after[key] = newValue;
      }
    });

    return Object.keys(changes.before).length > 0 ? changes : null;
  }
}

export const auditService = new AuditService();
