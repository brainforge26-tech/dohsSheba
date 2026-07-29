import { Router } from 'express';
import * as reviewController from './review.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createReviewValidator } from './review.validate';

const router = Router();

// Public
router.get('/service/:serviceId', reviewController.getServiceReviews);
router.get('/product/:productId', reviewController.getProductReviews);

// Protected
router.get('/my-reviews', protect, reviewController.getMyReviews);
router.post('/',     protect, authorize('CUSTOMER'), createReviewValidator, validate, reviewController.createReview);
router.delete('/:id', protect, reviewController.deleteReview);

export default router;

