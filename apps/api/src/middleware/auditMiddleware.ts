import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { auditService, AuditAction, AuditEntity } from '../services/auditService.js';

/**
 * Middleware to automatically log API requests
 */
export const auditMiddleware = (action: AuditAction, entity: AuditEntity) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to capture response
    res.json = function (body: any) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const entityId = req.params.id || body?.data?.id;
        
        // Log asynchronously without blocking response
        setImmediate(() => {
          auditService.logFromRequest(
            req,
            req.user!.id,
            action,
            entity,
            entityId,
            {
              method: req.method,
              path: req.path,
              query: req.query,
              // Don't log sensitive data
              body: sanitizeBody(req.body),
            }
          ).catch(err => console.error('Audit logging failed:', err));
        });
      }

      return originalJson(body);
    };

    next();
  };
};

/**
 * Remove sensitive fields from audit logs
 */
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') return body;

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret'];

  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
}
