import { Router } from 'express';
import * as cartController from './cart.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { addToCartValidator, updateCartItemValidator } from './cart.validate';

const router = Router();

router.use(protect, authorize('CUSTOMER'));

router.get('/',              cartController.getCart);
router.post('/add',          addToCartValidator,    validate, cartController.addToCart);
router.patch('/items/:id',   updateCartItemValidator, validate, cartController.updateCartItem);
router.delete('/items/:id',  cartController.removeFromCart);
router.delete('/clear',      cartController.clearCart);

export default router;
