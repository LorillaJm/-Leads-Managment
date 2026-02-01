import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { backupService } from '../services/backupService.js';
import { auditService, AuditAction, AuditEntity } from '../services/auditService.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class BackupController {
  async createBackup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await backupService.createBackup();

      // Log audit
      await auditService.logFromRequest(
        req,
        req.user!.id,
        AuditAction.CREATE,
        AuditEntity.SYSTEM,
        undefined,
        { action: 'backup_created', filename: result.filename }
      );

      res.json({
        success: true,
        message: 'Backup created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async listBackups(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const backups = await backupService.listBackups();

      res.json({
        success: true,
        data: { backups },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBackupStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await backupService.getBackupStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async restoreBackup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { filename } = req.params;

      const result = await backupService.restoreBackup(filename);

      // Log audit
      await auditService.logFromRequest(
        req,
        req.user!.id,
        AuditAction.RESTORE,
        AuditEntity.SYSTEM,
        undefined,
        { action: 'backup_restored', filename, recordsRestored: result.restored }
      );

      res.json({
        success: true,
        message: 'Backup restored successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadBackup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { filename } = req.params;
      const backupDir = join(__dirname, '../../backups');
      const filepath = join(backupDir, filename);

      // Security: Prevent path traversal
      if (!filename.startsWith('backup-') || !filename.endsWith('.json')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid backup filename',
        });
      }

      // Log audit
      await auditService.logFromRequest(
        req,
        req.user!.id,
        AuditAction.EXPORT,
        AuditEntity.SYSTEM,
        undefined,
        { action: 'backup_downloaded', filename }
      );

      res.download(filepath, filename);
    } catch (error) {
      next(error);
    }
  }

  async cleanupOldBackups(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const keepCount = req.body.keepCount || 10;
      const deleted = await backupService.cleanupOldBackups(keepCount);

      // Log audit
      await auditService.logFromRequest(
        req,
        req.user!.id,
        AuditAction.DELETE,
        AuditEntity.SYSTEM,
        undefined,
        { action: 'backups_cleaned', deletedCount: deleted }
      );

      res.json({
        success: true,
        message: `Cleaned up ${deleted} old backups`,
        data: { deleted },
      });
    } catch (error) {
      next(error);
    }
  }
}
