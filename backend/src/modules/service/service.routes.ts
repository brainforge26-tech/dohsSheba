import { Router } from 'express';
import * as serviceController from './service.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  createServiceValidator,
  updateServiceValidator,
  serviceCategoryValidator,
} from './service.validate';

const router = Router();

// ─── Service Categories ───────────────────────────────────────────────────────
const categoryRouter = Router();

categoryRouter.get('/',     serviceController.getCategories);
categoryRouter.post('/',    protect, authorize('ADMIN'), serviceCategoryValidator, validate, serviceController.createCategory);
categoryRouter.put('/:id',  protect, authorize('ADMIN'), serviceController.updateCategory);
categoryRouter.delete('/:id', protect, authorize('ADMIN'), serviceController.deleteCategory);

// ─── Services ─────────────────────────────────────────────────────────────────

// Provider-specific routes first (before :id to avoid conflict)
router.get('/provider/my-services', protect, authorize('PROVIDER', 'ADMIN'), serviceController.getMyServices);

// Public routes
router.get('/',     serviceController.getServices);
router.get('/:id',  serviceController.getService);

// Protected routes
router.post('/',
  protect, authorize('PROVIDER', 'ADMIN'),
  createServiceValidator, validate,
  serviceController.createService
);
router.put('/:id',
  protect, authorize('PROVIDER', 'ADMIN'),
  updateServiceValidator, validate,
  serviceController.updateService
);
router.delete('/:id',
  protect, authorize('PROVIDER', 'ADMIN'),
  serviceController.deleteService
);

export { categoryRouter };
export default router;
