import { body } from 'express-validator';

export const createReviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 1000 }),
  body('serviceId').optional(),
  body('productId').optional(),
  body('bookingId').optional(),
  body('images').optional().isArray(),
];
