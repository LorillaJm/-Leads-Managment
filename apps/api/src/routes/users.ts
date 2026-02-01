import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { UserRole } from '@lead-management/shared';
import rateLimit from 'express-rate-limit';

const router = Router();
const userController = new UserController();

// Rate limiter for sensitive operations
const sensitiveOpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require authentication
router.use(authenticate);

// Admin-only routes
router.get('/', requireRole(UserRole.ADMIN), userController.getAllUsers);
router.post('/', requireRole(UserRole.ADMIN), sensitiveOpLimiter, userController.createUser);
router.patch('/:id', requireRole(UserRole.ADMIN), userController.updateUser);
router.post('/:id/reset-password', requireRole(UserRole.ADMIN), sensitiveOpLimiter, userController.resetPassword);
router.patch('/:id/status', requireRole(UserRole.ADMIN), userController.updateStatus);

// Available to all authenticated users
router.get('/sales-consultants', userController.getSalesConsultants);
router.get('/:id', userController.getUserById);

export { router as usersRouter };
