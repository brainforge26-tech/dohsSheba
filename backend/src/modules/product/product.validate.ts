import { body, param } from 'express-validator';

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required')
    .isLength({ max: 150 }).withMessage('Name max 150 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').notEmpty().withMessage('Category ID is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('unit').optional().trim(),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount 0–100'),
  body('images').optional().isArray(),
  body('isFeatured').optional().isBoolean(),
];

export const updateProductValidator = [
  param('id').notEmpty().withMessage('Product ID is required'),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('discount').optional().isFloat({ min: 0, max: 100 }),
  body('isActive').optional().isBoolean(),
];

export const productCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').optional().trim(),
  body('parentId').optional(),
];
