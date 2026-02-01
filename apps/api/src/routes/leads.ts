import { Router } from 'express';
import { LeadController } from '../controllers/leadController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const leadController = new LeadController();

// All routes require authentication
router.use(authenticate);

router.post('/', leadController.createLead);
router.get('/', leadController.getLeads);
router.get('/stats', leadController.getLeadStats);
router.get('/:id', leadController.getLeadById);
router.put('/:id', leadController.updateLead);
// NO DELETE ENDPOINT - Leads must never be deleted per business requirements

export { router as leadsRouter };