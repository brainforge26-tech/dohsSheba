import { Router } from 'express';
import * as adminController from './admin.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// All admin routes require ADMIN role
router.use(protect, authorize('ADMIN'));

// Dashboard
router.get('/dashboard',    adminController.getDashboard);

// Users
router.get('/users',        adminController.getUsers);
router.patch('/users/:id/toggle', adminController.toggleUser);
router.patch('/users/:id/role',   adminController.updateRole);
router.patch('/users/:id/approve', adminController.approvePartner);

// Banners
router.get('/banners',         adminController.getBanners);
router.post('/banners',        adminController.createBanner);
router.put('/banners/:id',     adminController.updateBanner);
router.delete('/banners/:id',  adminController.deleteBanner);

// Coupons
router.get('/coupons',         adminController.getCoupons);
router.post('/coupons',        adminController.createCoupon);
router.put('/coupons/:id',     adminController.updateCoupon);
router.delete('/coupons/:id',  adminController.deleteCoupon);

// ─── Orders ───────────────────────────────────────────────────────────────────
router.get('/orders',                       adminController.getAdminOrders);
router.patch('/orders/:id/assign-rider',    adminController.assignRider);
router.patch('/orders/:id/unassign-rider',  adminController.unassignRider);

// ─── Riders ───────────────────────────────────────────────────────────────────
router.get('/riders',           adminController.getAllRiders);
router.get('/riders/available', adminController.getAvailableRiders);

export default router;
