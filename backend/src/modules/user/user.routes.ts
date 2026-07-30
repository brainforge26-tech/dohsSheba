import { Router } from 'express';
import * as userController from './user.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  updateProfileValidator,
  addAddressValidator,
  addressIdValidator,
} from './user.validate';

const router = Router();

// All user routes require authentication
router.use(protect);

// Profile
router.get('/profile',        userController.getProfile);
router.put('/profile',        updateProfileValidator, validate, userController.updateProfile);

// Addresses
router.get('/addresses',        userController.getAddresses);
router.get('/me/addresses',     userController.getAddresses);
router.post('/addresses',       addAddressValidator,  validate, userController.addAddress);
router.post('/me/addresses',      addAddressValidator,  validate, userController.addAddress);
router.put('/addresses/:id',    addressIdValidator,   validate, userController.updateAddress);
router.put('/me/addresses/:id', addressIdValidator,   validate, userController.updateAddress);
router.delete('/addresses/:id', addressIdValidator, validate, userController.deleteAddress);
router.delete('/me/addresses/:id', addressIdValidator, validate, userController.deleteAddress);

// Notifications
router.get('/notifications',                  userController.getNotifications);
router.patch('/notifications/read-all',       userController.markAllRead);
router.patch('/notifications/:id/read',       userController.markOneRead);

export default router;
