import { Router } from 'express';
import * as orderController from './order.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createOrderValidator, updateOrderStatusValidator } from './order.validate';

const router = Router();

router.use(protect);

router.get('/',      orderController.getOrders);
router.get('/:id',   orderController.getOrder);
router.post('/',     authorize('CUSTOMER'), createOrderValidator, validate, orderController.createOrder);
router.patch('/:id/status', authorize('SELLER', 'ADMIN'), updateOrderStatusValidator, validate, orderController.updateOrderStatus);
router.delete('/:id/cancel', authorize('CUSTOMER'), orderController.cancelOrder);
router.delete('/:id', authorize('SELLER', 'ADMIN'), orderController.deleteOrder);

export default router;
