import { body, param } from 'express-validator';

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required')
    .isLength({ max: 150 }).withMessage('Name max 150 characters'),
  body('description').optional().trim(),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').optional().trim(),
  body('brand').optional().trim(),
  body('brandId').optional().trim(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('unit').optional().trim(),
  body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount 0–100'),
  body('images').optional().isArray(),
  body('isFeatured').optional().isBoolean(),
  body('isFlashSale').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('slug').optional().trim(),
];

export const updateProductValidator = [
  param('id').notEmpty().withMessage('Product ID is required'),
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('categoryId').optional().trim(),
  body('brand').optional().trim(),
  body('brandId').optional().trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('discount').optional().isFloat({ min: 0, max: 100 }),
  body('unit').optional().trim(),
  body('images').optional().isArray(),
  body('isFeatured').optional().isBoolean(),
  body('isFlashSale').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('slug').optional().trim(),
];

export const productCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug').optional().trim(),
  body('parentId').optional(),
  body('image').optional(),
  body('icon').optional(),
  body('description').optional(),
];
