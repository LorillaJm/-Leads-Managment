# Security Documentation

## Overview

This document outlines the security measures, best practices, and hardening steps implemented in the Lead Management System.

## Authentication & Authorization

### JWT Implementation
- **Access Token**: 15-minute expiry
- **Refresh Token**: 7-day expiry in HTTP-only cookies
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret**: Stored in environment variables (min 32 characters)

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **Minimum length**: 8 characters
- **Requirements**: Enforced on client and server
- **Storage**: Never stored in plain text

### Session Management
- **HTTP-only cookies**: Prevents XSS attacks
- **Secure flag**: HTTPS only in production
- **SameSite**: Strict (CSRF protection)
- **Auto-refresh**: Before token expiry

## Role-Based Access Control (RBAC)

### Roles
1. **MANAGEMENT**: Full system access
2. **SALES_CONSULTANT**: Limited to own leads

### Enforcement
- **Server-side**: All authorization checks on backend
- **Middleware**: `authorize()` function
- **Never trust client**: UI hiding is not security

### Permission Matrix

| Resource | Management | Sales Consultant |
|----------|-----------|------------------|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Edit own lead | ✅ | ✅ |
| Edit other's lead | ✅ | ❌ |
| Delete lead | ✅ | ❌ |
| View analytics | ✅ (all) | ✅ (own) |
| View rankings | ✅ | ❌ |
| Export data | ✅ | ✅ (own) |

## API Security

### Rate Limiting

**General API**:
- 100 requests per 15 minutes per IP
- Applies to all `/api` endpoints

**Authentication**:
- 5 login attempts per 15 minutes per IP
- Prevents brute force attacks
- Successful requests don't count

**Export**:
- 10 exports per hour per IP
- Prevents abuse of resource-intensive operations

### Input Validation

**Zod Schemas**:
```typescript
// All inputs validated with Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

**Sanitization**:
- HTML entities escaped
- SQL injection prevented (Prisma ORM)
- NoSQL injection prevented (type checking)

### CORS Configuration

**Development**:
```typescript
origin: ['http://localhost:5173', 'http://localhost:5174']
```

**Production**:
```typescript
origin: process.env.FRONTEND_URL.split(',')
```

**Settings**:
- Credentials: true (cookies)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

### Security Headers (Helmet.js)

**Content Security Policy**:
```typescript
defaultSrc: ["'self'"]
styleSrc: ["'self'", "'unsafe-inline'"]
scriptSrc: ["'self'"]
imgSrc: ["'self'", 'data:', 'https:']
```

**HSTS**:
```typescript
maxAge: 31536000 (1 year)
includeSubDomains: true
preload: true
```

**Other Headers**:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## Data Protection

### Encryption

**At Rest**:
- Database: Provider-managed encryption (AES-256)
- Backups: Encrypted before storage
- Secrets: Environment variables, never in code

**In Transit**:
- HTTPS/TLS 1.3 only in production
- Certificate: Let's Encrypt or provider-managed
- HSTS enforced

### Sensitive Data Handling

**Never Log**:
- Passwords
- JWT tokens
- Credit card numbers
- Personal identification numbers

**Audit Logging**:
- User actions tracked
- IP address recorded
- Changes logged (before/after)
- Retention: 90 days

### Data Minimization
- Collect only necessary data
- Delete inactive accounts after 2 years
- Anonymize data for analytics

## Audit Logging

### What We Log

**Authentication Events**:
- Login attempts (success/failure)
- Logout events
- Token refresh
- Password changes

**Data Operations**:
- Lead creation/update/deletion
- Activity additions
- Closed deal records
- Export operations

**Administrative Actions**:
- User management
- Role changes
- System configuration

### Audit Log Structure
```typescript
{
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: 'User' | 'Lead' | 'Activity' | 'ClosedDeal';
  entityId?: string;
  changes?: object; // Before/after values
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}
```

### Audit Log Retention
- **Active logs**: 90 days in database
- **Archived logs**: 7 years in cold storage
- **Compliance**: GDPR, SOC 2

## Vulnerability Management

### Dependency Scanning

**Automated**:
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check specific severity
npm audit --audit-level=high
```

**Schedule**:
- Weekly automated scans
- Monthly manual review
- Immediate action on critical vulnerabilities

### Security Updates

**Process**:
1. Monitor security advisories
2. Test updates in staging
3. Deploy to production within 48 hours (critical)
4. Document changes

**Tools**:
- Dependabot (GitHub)
- Snyk
- npm audit

## Environment Variables

### Required Variables

**Backend (.env)**:
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret

# Environment
NODE_ENV=production
PORT=3001

# Frontend URL (for CORS)
FRONTEND_URL=https://your-domain.com

# Optional: Sentry
SENTRY_DSN=https://...
```

**Frontend (.env)**:
```bash
VITE_API_URL=https://api.your-domain.com
```

### Security Best Practices
- Never commit .env files
- Use different secrets per environment
- Rotate secrets quarterly
- Use secret management service (AWS Secrets Manager, etc.)

## Incident Response

### Security Incident Levels

**Level 1 - Critical**:
- Data breach
- System compromise
- Authentication bypass
- Response time: Immediate

**Level 2 - High**:
- Unauthorized access attempt
- DDoS attack
- Vulnerability exploitation
- Response time: 1 hour

**Level 3 - Medium**:
- Suspicious activity
- Failed login spikes
- Rate limit violations
- Response time: 4 hours

### Incident Response Plan

1. **Detection**: Monitoring alerts, user reports
2. **Containment**: Isolate affected systems
3. **Investigation**: Analyze logs, identify scope
4. **Eradication**: Remove threat, patch vulnerabilities
5. **Recovery**: Restore services, verify integrity
6. **Post-Incident**: Document, improve defenses

### Contact Information
- **Security Team**: security@company.com
- **Emergency**: +1-XXX-XXX-XXXX
- **Slack**: #security-incidents

## Compliance

### GDPR Compliance

**User Rights**:
- Right to access: Export functionality
- Right to erasure: Delete account feature
- Right to portability: CSV export
- Right to rectification: Edit profile

**Data Processing**:
- Lawful basis documented
- Privacy policy published
- Consent tracked
- Data retention policy enforced

### SOC 2 (if applicable)

**Security Principles**:
- Access controls implemented
- Encryption at rest and in transit
- Audit logging enabled
- Incident response plan documented
- Regular security reviews

## Security Checklist

### Pre-Deployment

- [ ] All secrets in environment variables
- [ ] HTTPS/TLS configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set (Helmet)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (React escaping)
- [ ] CSRF protection (SameSite cookies)
- [ ] Audit logging enabled
- [ ] Error messages don't leak info
- [ ] Default credentials changed
- [ ] Unnecessary endpoints removed
- [ ] File upload restrictions (if applicable)
- [ ] Database backups configured

### Post-Deployment

- [ ] Penetration testing completed
- [ ] Vulnerability scan passed
- [ ] Security monitoring active
- [ ] Incident response plan tested
- [ ] Team trained on security procedures
- [ ] Documentation updated
- [ ] Compliance requirements met

## Monitoring & Alerting

### Security Monitoring

**Metrics to Track**:
- Failed login attempts
- Rate limit violations
- Unusual API patterns
- Database query anomalies
- Error rate spikes

**Alerting Thresholds**:
- 10+ failed logins from same IP: Alert
- 50+ requests/min from single IP: Block
- 5xx errors > 1%: Investigate
- Unauthorized access attempts: Immediate alert

### Tools

**Recommended**:
- Sentry (error tracking)
- Datadog/New Relic (APM)
- CloudWatch/Stackdriver (logs)
- PagerDuty (incident management)

## Security Testing

### Regular Testing

**Weekly**:
- Dependency vulnerability scan
- Automated security tests

**Monthly**:
- Manual security review
- Access control audit
- Log review

**Quarterly**:
- Penetration testing
- Security training
- Incident response drill

**Annually**:
- Full security audit
- Compliance review
- Third-party assessment

### Testing Tools

**SAST (Static Analysis)**:
- ESLint security plugins
- SonarQube
- Semgrep

**DAST (Dynamic Analysis)**:
- OWASP ZAP
- Burp Suite
- Nikto

**Dependency Scanning**:
- npm audit
- Snyk
- Dependabot

## Secure Development Practices

### Code Review
- Security-focused reviews
- Two-person approval required
- Automated security checks in CI/CD

### Git Security
- Signed commits (GPG)
- Branch protection rules
- No force pushes to main
- Secret scanning enabled

### CI/CD Security
- Secrets in CI/CD variables
- Isolated build environments
- Automated security tests
- Deployment approval required

## Common Vulnerabilities & Mitigations

### SQL Injection
- **Risk**: Database compromise
- **Mitigation**: Prisma ORM (parameterized queries)
- **Status**: ✅ Protected

### XSS (Cross-Site Scripting)
- **Risk**: Session hijacking
- **Mitigation**: React auto-escaping, CSP headers
- **Status**: ✅ Protected

### CSRF (Cross-Site Request Forgery)
- **Risk**: Unauthorized actions
- **Mitigation**: SameSite cookies, CORS
- **Status**: ✅ Protected

### Authentication Bypass
- **Risk**: Unauthorized access
- **Mitigation**: Server-side auth checks, JWT validation
- **Status**: ✅ Protected

### Brute Force
- **Risk**: Password compromise
- **Mitigation**: Rate limiting, account lockout
- **Status**: ✅ Protected

### DDoS
- **Risk**: Service unavailability
- **Mitigation**: Rate limiting, CDN, cloud provider protection
- **Status**: ⚠️ Partial (depends on infrastructure)

## Security Contacts

### Internal
- **Security Lead**: security-lead@company.com
- **DevOps**: devops@company.com
- **CTO**: cto@company.com

### External
- **Responsible Disclosure**: security@company.com
- **Bug Bounty**: (if applicable)

## Updates & Maintenance

This document should be reviewed and updated:
- After security incidents
- Quarterly (minimum)
- When adding new features
- When compliance requirements change

---

**Last Updated**: 2024-01-01  
**Next Review**: 2024-04-01  
**Document Owner**: Security Team
