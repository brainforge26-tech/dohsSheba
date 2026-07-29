import { body, param } from 'express-validator';

export const createBookingValidator = [
  body('serviceId').notEmpty().withMessage('Service ID is required'),
  body('addressId').notEmpty().withMessage('Address ID is required'),
  body('scheduledAt')
    .notEmpty().withMessage('Scheduled date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('notes').optional().trim().isLength({ max: 500 }),
];

export const updateStatusValidator = [
  param('id').notEmpty().withMessage('Booking ID is required'),
  body('status')
    .isIn(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED'])
    .withMessage('Invalid booking status'),
];
