import { body, param } from 'express-validator';

export const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters'),

  body('phone')
    .optional()
    .isString().withMessage('Invalid phone number'),

  body('avatar')
    .optional()
    .isString().withMessage('Avatar must be a valid string or URL'),
];

export const addAddressValidator = [
  body('label')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Label max 30 characters'),

  body('line1')
    .trim()
    .notEmpty().withMessage('Address line 1 is required'),

  body('area')
    .trim()
    .notEmpty().withMessage('Area is required'),

  body('city')
    .optional()
    .trim(),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be boolean'),
];

export const addressIdValidator = [
  param('id').notEmpty().withMessage('Address ID is required'),
];
