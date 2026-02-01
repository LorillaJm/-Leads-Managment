import { Router } from 'express';
import { ClosedDealController } from '../controllers/closedDealController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const closedDealController = new ClosedDealController();

// All routes require authentication
router.use(authenticate);

router.get('/', closedDealController.getClosedDeals);
router.get('/stats', closedDealController.getClosedDealStats);
router.get('/export', closedDealController.exportClosedDeals);
router.get('/:id', closedDealController.getClosedDealById);
router.put('/:id', closedDealController.updateClosedDeal);

export { router as closedDealsRouter };