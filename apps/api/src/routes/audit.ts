import { Router } from 'express';
import { AuditController } from '../controllers/auditController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserRole } from '@lead-management/shared';

const router = Router();
const auditController = new AuditController();

// All audit routes require authentication and management role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// Get audit logs with filtering
router.get('/', auditController.getAuditLogs);

// Get audit trail for specific entity
router.get('/entity/:entity/:entityId', auditController.getEntityAuditTrail);

// Get user activity summary
router.get('/user/:userId/summary', auditController.getUserActivitySummary);

// Export audit logs
router.get('/export', auditController.exportAuditLogs);

export { router as auditRouter };
