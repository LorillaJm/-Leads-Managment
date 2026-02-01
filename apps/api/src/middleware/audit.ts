import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { AuditService, AuditAction, AuditEntity } from '../services/auditService.js';

const auditService = new AuditService();

export function auditLog(action: AuditAction, entity: AuditEntity) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to capture response
    res.json = function (body: any) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entityId = req.params.id || body?.data?.id;
        
        // Extract changes from request body
        const changes = req.body ? { ...req.body } : undefined;
        
        // Remove sensitive data
        if (changes?.password) delete changes.password;

        // Log audit entry (async, non-blocking)
        auditService.log({
          userId: req.user?.id || 'system',
          action,
          entity,
          entityId,
          changes,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.get('user-agent')
        }).catch(err => console.error('Audit log failed:', err));
      }

      return originalJson(body);
    };

    next();
  };
}
