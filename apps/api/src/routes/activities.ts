import { Router } from 'express';
import { ActivityController } from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const activityController = new ActivityController();

// All routes require authentication
router.use(authenticate);

router.post('/', activityController.createActivity);
router.get('/stats', activityController.getActivityStats);
router.get('/lead/:leadId', activityController.getActivitiesByLeadId);
router.get('/:id', activityController.getActivityById);
// NOTE: Delete endpoint removed for data integrity - activities should not be deleted

export { router as activitiesRouter };