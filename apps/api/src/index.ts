import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { leadsRouter } from './routes/leads.js';
import { activitiesRouter } from './routes/activities.js';
import { closedDealsRouter } from './routes/closedDeals.js';
import { analyticsRouter } from './routes/analytics.js';
import { auditRouter } from './routes/audit.js';
import { backupRouter } from './routes/backup.js';
import { errorLoggingService } from './services/errorLoggingService.js';
import { backupService } from './services/backupService.js';
import { runStartupTasks } from './startup.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: join(__dirname, '../../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (important for rate limiting behind reverse proxies)
app.set('trust proxy', 1);

// Enhanced security middleware with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
  frameguard: { action: 'deny' },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins in production (you can restrict this later)
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use('/api', apiLimiter);

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/leads', leadsRouter);
app.use('/api/v1/activities', activitiesRouter);
app.use('/api/v1/closed-deals', closedDealsRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/audit', auditRouter);
app.use('/api/v1/backup', backupRouter);

// Global error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Run startup tasks then start server
async function startServer() {
  // Run migrations and seeding
  await runStartupTasks();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🛡️  Security: Helmet enabled`);
    console.log(`⏱️  Rate limiting: Active`);
    console.log(`📝 Audit logging: Enabled`);
    console.log(`💾 Backup system: Ready`);
    
    // Log startup
    errorLoggingService.logInfo('Server started', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
    });

    // Schedule automated backups (if enabled)
    if (process.env.ENABLE_AUTO_BACKUP === 'true') {
      const backupInterval = parseInt(process.env.BACKUP_INTERVAL_HOURS || '24') * 60 * 60 * 1000;
      setInterval(() => {
        backupService.createAutomatedBackup();
      }, backupInterval);
      console.log(`🤖 Automated backups: Every ${process.env.BACKUP_INTERVAL_HOURS || '24'} hours`);
    }
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
