import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserRole } from '../types.js';

const router = Router();
const analyticsController = new AnalyticsController();

// All routes require authentication
router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/funnel', analyticsController.getConversionFunnel);
router.get('/performance', analyticsController.getPerformanceMetrics);
router.get('/trends', analyticsController.getPerformanceTrends);
router.get('/rankings', authorize(UserRole.ADMIN), analyticsController.getSalesConsultantRanking);

export { router as analyticsRouter };