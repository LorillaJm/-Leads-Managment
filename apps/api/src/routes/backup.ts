import { Router } from 'express';
import { BackupController } from '../controllers/backupController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserRole } from '@lead-management/shared';

const router = Router();
const backupController = new BackupController();

// All backup routes require authentication and management role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// Create backup
router.post('/create', backupController.createBackup);

// List backups
router.get('/list', backupController.listBackups);

// Get backup stats
router.get('/stats', backupController.getBackupStats);

// Restore backup
router.post('/restore/:filename', backupController.restoreBackup);

// Download backup
router.get('/download/:filename', backupController.downloadBackup);

// Cleanup old backups
router.post('/cleanup', backupController.cleanupOldBackups);

export { router as backupRouter };
