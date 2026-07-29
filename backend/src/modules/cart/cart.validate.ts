import { body, param } from 'express-validator';

export const addToCartValidator = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];
export const updateCartItemValidator = [
  param('id').notEmpty().withMessage('Cart item ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
];
