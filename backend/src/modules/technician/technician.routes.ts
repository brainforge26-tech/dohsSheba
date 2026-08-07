import { Router } from 'express';
import * as technicianController from './technician.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Active list for operations/admin
router.get('/active', protect, technicianController.getActiveTechnicians);

// Full list & management (Admin / Provider / Service Ops)
router.get('/', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PROVIDER'), technicianController.getTechnicians);
router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PROVIDER'), technicianController.createTechnician);
router.patch('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PROVIDER'), technicianController.updateTechnician);
router.delete('/:id', protect, authorize('ADMIN', 'SUPER_ADMIN', 'PROVIDER'), technicianController.deleteTechnician);

export default router;
