import { body, param, query } from 'express-validator';

export const createServiceValidator = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 120 }).withMessage('Title max 120 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('priceUnit').optional().isIn(['hour', 'fixed', 'day']).withMessage('Invalid price unit'),
  body('categoryId').notEmpty().withMessage('Category is required'),
  body('images').optional().isArray().withMessage('Images must be an array'),
];

export const updateServiceValidator = [
  param('id').notEmpty().withMessage('Service ID is required'),
  body('title').optional().trim().isLength({ max: 120 }),
  body('price').optional().isFloat({ min: 0 }),
  body('priceUnit').optional().isIn(['hour', 'fixed', 'day']),
  body('isActive').optional().isBoolean(),
];

export const serviceCategoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('image').optional().trim(),
];
