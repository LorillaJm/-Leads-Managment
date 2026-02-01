import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class BackupService {
  private backupDir: string;

  constructor() {
    this.backupDir = join(__dirname, '../../backups');
    this.ensureBackupDirectory();
  }

  /**
   * Ensure backup directory exists
   */
  private async ensureBackupDirectory() {
    if (!existsSync(this.backupDir)) {
      await mkdir(this.backupDir, { recursive: true });
    }
  }

  /**
   * Create a full database backup
   */
  async createBackup(): Promise<{ filename: string; size: number; timestamp: Date }> {
    const timestamp = new Date();
    const filename = `backup-${timestamp.toISOString().replace(/[:.]/g, '-')}.json`;
    const filepath = join(this.backupDir, filename);

    try {
      // Export all data from database
      const [users, leads, activities, closedDeals, auditLogs] = await Promise.all([
        prisma.user.findMany(),
        prisma.lead.findMany(),
        prisma.activity.findMany(),
        prisma.closedDeal.findMany(),
        prisma.auditLog.findMany(),
      ]);

      const backup = {
        version: '1.0',
        timestamp: timestamp.toISOString(),
        data: {
          users,
          leads,
          activities,
          closedDeals,
          auditLogs,
        },
        metadata: {
          totalRecords: users.length + leads.length + activities.length + closedDeals.length + auditLogs.length,
        },
      };

      // Write to file
      const backupJson = JSON.stringify(backup, null, 2);
      await writeFile(filepath, backupJson, 'utf-8');

      const size = Buffer.byteLength(backupJson, 'utf-8');

      console.log(`✅ Backup created: ${filename} (${(size / 1024 / 1024).toFixed(2)} MB)`);

      return { filename, size, timestamp };
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw new Error('Backup creation failed');
    }
  }

  /**
   * Restore database from backup
   */
  async restoreBackup(filename: string): Promise<{ restored: number }> {
    const filepath = join(this.backupDir, filename);

    try {
      // Read backup file
      const backupJson = await readFile(filepath, 'utf-8');
      const backup = JSON.parse(backupJson);

      if (!backup.version || !backup.data) {
        throw new Error('Invalid backup file format');
      }

      // Clear existing data (in transaction)
      await prisma.$transaction(async (tx: any) => {
        // Delete in correct order (respecting foreign keys)
        await tx.closedDeal.deleteMany();
        await tx.activity.deleteMany();
        await tx.lead.deleteMany();
        await tx.auditLog.deleteMany();
        // Don't delete users to preserve authentication

        // Restore data
        if (backup.data.closedDeals?.length > 0) {
          await tx.closedDeal.createMany({ data: backup.data.closedDeals });
        }
        if (backup.data.activities?.length > 0) {
          await tx.activity.createMany({ data: backup.data.activities });
        }
        if (backup.data.leads?.length > 0) {
          await tx.lead.createMany({ data: backup.data.leads });
        }
        if (backup.data.auditLogs?.length > 0) {
          await tx.auditLog.createMany({ data: backup.data.auditLogs });
        }
      });

      const restored = backup.metadata.totalRecords;
      console.log(`✅ Backup restored: ${restored} records`);

      return { restored };
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw new Error('Backup restoration failed');
    }
  }

  /**
   * List all available backups
   */
  async listBackups(): Promise<Array<{ filename: string; size: number; timestamp: Date }>> {
    try {
      const { readdir, stat } = await import('fs/promises');
      const files = await readdir(this.backupDir);
      
      const backups = await Promise.all(
        files
          .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
          .map(async (file) => {
            const filepath = join(this.backupDir, file);
            const stats = await stat(filepath);
            return {
              filename: file,
              size: stats.size,
              timestamp: stats.mtime,
            };
          })
      );

      return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('❌ Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Delete old backups (keep last N backups)
   */
  async cleanupOldBackups(keepCount: number = 10): Promise<number> {
    try {
      const backups = await this.listBackups();
      
      if (backups.length <= keepCount) {
        return 0;
      }

      const toDelete = backups.slice(keepCount);
      const { unlink } = await import('fs/promises');

      for (const backup of toDelete) {
        const filepath = join(this.backupDir, backup.filename);
        await unlink(filepath);
      }

      console.log(`✅ Cleaned up ${toDelete.length} old backups`);
      return toDelete.length;
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      return 0;
    }
  }

  /**
   * Create automated backup (for cron jobs)
   */
  async createAutomatedBackup(): Promise<void> {
    try {
      const result = await this.createBackup();
      console.log(`🤖 Automated backup completed: ${result.filename}`);

      // Cleanup old backups
      await this.cleanupOldBackups(30); // Keep last 30 backups
    } catch (error) {
      console.error('❌ Automated backup failed:', error);
      // Don't throw - we don't want to crash the app
    }
  }

  /**
   * Export database to SQL (for PostgreSQL/MySQL)
   */
  async exportToSQL(): Promise<string> {
    // This is a placeholder for SQL export
    // Implementation depends on the database type
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    // For PostgreSQL:
    // pg_dump $DATABASE_URL > backup.sql
    
    // For MySQL:
    // mysqldump -u user -p database > backup.sql

    throw new Error('SQL export not implemented for SQLite. Use JSON backup instead.');
  }

  /**
   * Get backup statistics
   */
  async getBackupStats(): Promise<{
    totalBackups: number;
    totalSize: number;
    oldestBackup: Date | null;
    newestBackup: Date | null;
  }> {
    const backups = await this.listBackups();

    if (backups.length === 0) {
      return {
        totalBackups: 0,
        totalSize: 0,
        oldestBackup: null,
        newestBackup: null,
      };
    }

    return {
      totalBackups: backups.length,
      totalSize: backups.reduce((sum, b) => sum + b.size, 0),
      oldestBackup: backups[backups.length - 1].timestamp,
      newestBackup: backups[0].timestamp,
    };
  }
}

export const backupService = new BackupService();
