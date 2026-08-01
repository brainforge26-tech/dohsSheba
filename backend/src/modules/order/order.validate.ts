import { body } from 'express-validator';

export const createOrderValidator = [
  body('addressId').notEmpty().withMessage('Delivery address is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('couponCode').optional().trim(),
  body('notes').optional().trim().isLength({ max: 500 }),
];

export const updateOrderStatusValidator = [
  body('status')
    .isIn([
      'PENDING',
      'SELLER_ACCEPTED',
      'READY_FOR_RIDER',
      'RIDER_ASSIGNED',
      'ARRIVED_AT_STORE',
      'PICKUP_STARTED',
      'PICKED_UP',
      'ON_THE_WAY',
      'ARRIVED',
      'ARRIVED_DESTINATION',
      'DELIVERED',
      'WAITING_FOR_MANUAL_ASSIGNMENT',
      'CANCELLED',
      'REJECTED',
      'REFUNDED',
    ])
    .withMessage('Invalid order status'),
];
