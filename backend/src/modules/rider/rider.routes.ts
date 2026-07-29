import { Router } from 'express';
import { protect, authorize } from '../../middlewares/auth.middleware';
import * as riderController from './rider.controller';

const router = Router();

// All rider routes require authentication + RIDER role
router.use(protect, authorize('RIDER', 'ADMIN', 'SUPER_ADMIN'));

// ─── Profile & Stats ──────────────────────────────────────────────────────────
router.get('/profile',              riderController.getProfile);
router.get('/stats',                riderController.getStats);
router.patch('/availability',       riderController.toggleAvailability);

// ─── Orders ───────────────────────────────────────────────────────────────────
router.get('/orders/assigned',      riderController.getAssignedOrders);
router.get('/orders/pending',       riderController.getPendingOrders);
router.get('/orders/history',       riderController.getHistory);
router.patch('/orders/:id/accept',  riderController.acceptOrder);
router.patch('/orders/:id/status',  riderController.updateOrderStatus);

export default router;
