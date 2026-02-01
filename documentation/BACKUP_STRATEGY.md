# Backup Strategy

## Overview

This document outlines the backup strategy for the Lead Management System to ensure data integrity, disaster recovery, and business continuity.

## Database Backups

### Automated Backups

#### Production (PostgreSQL on Neon/Supabase)
- **Frequency**: Automated daily backups
- **Retention**: 7 days (configurable)
- **Type**: Full database snapshots
- **Provider**: Neon/Supabase automatic backups

#### Manual Backups

**PostgreSQL:**
```bash
# Full database backup
pg_dump -h your-host -U your-user -d your-database > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -h your-host -U your-user -d your-database | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Backup specific tables
pg_dump -h your-host -U your-user -d your-database -t users -t leads -t activities > backup_tables.sql
```

**SQLite (Development):**
```bash
# Copy database file
cp apps/api/prisma/dev.db backups/dev_$(date +%Y%m%d_%H%M%S).db

# Using SQLite command
sqlite3 apps/api/prisma/dev.db ".backup 'backups/dev_backup.db'"
```

### Backup Schedule

| Environment | Frequency | Retention | Storage Location |
|-------------|-----------|-----------|------------------|
| Production  | Daily at 2 AM UTC | 30 days | Cloud storage (S3/GCS) |
| Staging     | Weekly | 14 days | Cloud storage |
| Development | Manual | 7 days | Local |

## Backup Verification

### Monthly Verification Process
1. Download latest backup
2. Restore to test environment
3. Run data integrity checks
4. Verify critical data (users, leads, closed deals)
5. Document results

### Automated Verification Script
```bash
#!/bin/bash
# verify-backup.sh

BACKUP_FILE=$1
TEST_DB="test_restore_db"

# Restore backup
psql -h localhost -U postgres -c "CREATE DATABASE $TEST_DB;"
psql -h localhost -U postgres -d $TEST_DB < $BACKUP_FILE

# Run verification queries
psql -h localhost -U postgres -d $TEST_DB -c "SELECT COUNT(*) FROM users;"
psql -h localhost -U postgres -d $TEST_DB -c "SELECT COUNT(*) FROM leads;"
psql -h localhost -U postgres -d $TEST_DB -c "SELECT COUNT(*) FROM closed_deals;"

# Cleanup
psql -h localhost -U postgres -c "DROP DATABASE $TEST_DB;"

echo "Backup verification complete"
```

## Disaster Recovery

### Recovery Time Objective (RTO)
- **Target**: 4 hours
- **Maximum acceptable downtime**: 8 hours

### Recovery Point Objective (RPO)
- **Target**: 24 hours
- **Maximum acceptable data loss**: 24 hours

### Recovery Procedures

#### Full System Recovery
1. **Provision new infrastructure** (if needed)
2. **Deploy application** from Git repository
3. **Restore database** from latest backup
4. **Verify environment variables** and secrets
5. **Run health checks** and smoke tests
6. **Update DNS** (if needed)
7. **Monitor system** for 24 hours

#### Database-Only Recovery
```bash
# 1. Stop application
pm2 stop all

# 2. Restore database
psql -h your-host -U your-user -d your-database < backup_file.sql

# 3. Verify data
psql -h your-host -U your-user -d your-database -c "SELECT COUNT(*) FROM users;"

# 4. Restart application
pm2 start all

# 5. Monitor logs
pm2 logs
```

## File Storage Backups

### Uploaded Files (if applicable)
- **Location**: Cloud storage (S3/GCS/Azure Blob)
- **Backup**: Automatic versioning enabled
- **Retention**: 90 days

### Application Code
- **Primary**: Git repository (GitHub/GitLab)
- **Backup**: Multiple clones on team machines
- **Frequency**: Continuous (on push)

## Backup Storage

### Primary Storage
- **Provider**: AWS S3 / Google Cloud Storage
- **Region**: Same as production
- **Encryption**: AES-256 at rest
- **Access**: Restricted to backup service account

### Secondary Storage (Optional)
- **Provider**: Different cloud provider
- **Purpose**: Geographic redundancy
- **Sync**: Weekly

### Storage Structure
```
backups/
├── production/
│   ├── daily/
│   │   ├── 2024-01-01/
│   │   │   ├── database.sql.gz
│   │   │   └── metadata.json
│   │   └── 2024-01-02/
│   ├── weekly/
│   └── monthly/
├── staging/
└── logs/
```

## Backup Automation

### Cron Job Example
```bash
# /etc/cron.d/database-backup

# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup-database.sh >> /var/log/backup.log 2>&1

# Weekly cleanup (remove backups older than 30 days)
0 3 * * 0 find /backups -type f -mtime +30 -delete
```

### Backup Script
```bash
#!/bin/bash
# backup-database.sh

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/production/daily/$(date +%Y-%m-%d)"
BACKUP_FILE="$BACKUP_DIR/database_$DATE.sql.gz"

# Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_FILE

# Create metadata
cat > $BACKUP_DIR/metadata.json <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "database": "$DB_NAME",
  "size": "$(du -h $BACKUP_FILE | cut -f1)",
  "checksum": "$(sha256sum $BACKUP_FILE | cut -d' ' -f1)"
}
EOF

# Upload to cloud storage
aws s3 cp $BACKUP_FILE s3://your-bucket/backups/production/daily/$(date +%Y-%m-%d)/
aws s3 cp $BACKUP_DIR/metadata.json s3://your-bucket/backups/production/daily/$(date +%Y-%m-%d)/

# Send notification
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"✅ Database backup completed: $BACKUP_FILE\"}"

echo "Backup completed successfully: $BACKUP_FILE"
```

## Monitoring & Alerts

### Backup Monitoring
- **Success notifications**: Slack/Email
- **Failure alerts**: PagerDuty/Slack (immediate)
- **Missing backups**: Alert if no backup in 25 hours
- **Storage capacity**: Alert at 80% full

### Health Checks
```bash
# Check last backup age
LAST_BACKUP=$(aws s3 ls s3://your-bucket/backups/production/daily/ | tail -1)
BACKUP_AGE=$(( ($(date +%s) - $(date -d "$LAST_BACKUP" +%s)) / 3600 ))

if [ $BACKUP_AGE -gt 25 ]; then
  echo "WARNING: Last backup is $BACKUP_AGE hours old"
  # Send alert
fi
```

## Security

### Backup Encryption
- **At rest**: AES-256 encryption
- **In transit**: TLS 1.3
- **Keys**: Managed by cloud provider KMS

### Access Control
- **Principle of least privilege**
- **Service accounts** for automated backups
- **MFA required** for manual access
- **Audit logging** enabled

### Backup Testing
- **Monthly**: Restore test
- **Quarterly**: Full disaster recovery drill
- **Annually**: Complete system recovery test

## Compliance

### Data Retention
- **Production data**: 30 days
- **Audit logs**: 90 days
- **Closed deals**: 7 years (regulatory requirement)

### GDPR Compliance
- **Right to erasure**: Backup retention policy
- **Data portability**: Export functionality
- **Encryption**: All backups encrypted

## Costs

### Estimated Monthly Costs
- **Database backups**: $10-20 (storage)
- **Cloud storage**: $5-15 (S3/GCS)
- **Data transfer**: $5-10
- **Total**: ~$20-45/month

## Restoration Procedures

### Quick Restore (< 1 hour)
```bash
# 1. Download latest backup
aws s3 cp s3://your-bucket/backups/production/daily/latest/database.sql.gz .

# 2. Decompress
gunzip database.sql.gz

# 3. Restore
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < database.sql

# 4. Verify
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM users;"
```

### Point-in-Time Recovery (if supported)
```bash
# Restore to specific timestamp
# (Requires WAL archiving enabled)
pg_restore --target-time="2024-01-15 14:30:00" backup.dump
```

## Contacts

### Backup Team
- **Primary**: DevOps Lead
- **Secondary**: Backend Lead
- **Escalation**: CTO

### Emergency Contacts
- **24/7 Hotline**: +1-XXX-XXX-XXXX
- **Email**: devops@company.com
- **Slack**: #incidents

## Review Schedule

- **Monthly**: Backup verification
- **Quarterly**: Strategy review
- **Annually**: Full disaster recovery test

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2024-01-01 | 1.0 | Initial backup strategy | DevOps Team |

---

**Last Updated**: 2024-01-01  
**Next Review**: 2024-04-01
