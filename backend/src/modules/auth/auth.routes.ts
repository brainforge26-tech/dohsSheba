import { Router } from 'express';
import * as authController from './auth.controller';
import { protect } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} from './auth.validate';

const router = Router();

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login',    loginValidator,    validate, authController.login);
router.post('/google',                               authController.googleLogin);
router.post('/logout',                               authController.logout);
router.post('/refresh',                              authController.refreshToken);

// Protected routes
router.get('/me',               protect, authController.getMe);
router.patch('/change-password', protect, changePasswordValidator, validate, authController.changePassword);

export default router;
