import { Router } from 'express';
import * as couponController from './coupon.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', couponController.getAvailableCoupons);
router.post('/validate', couponController.validateCoupon); // public — no auth needed
router.post('/', protect, couponController.createCoupon);

export default router;
