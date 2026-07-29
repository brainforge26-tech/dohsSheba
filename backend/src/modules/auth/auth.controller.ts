import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as authService from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../utils/response.util';
import { AppError } from '../../middlewares/error.middleware';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/v1/auth/register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, tokens } = await authService.registerUser(req.body);
    res.cookie('token', tokens.accessToken, TOKEN_COOKIE_OPTIONS);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    return sendResponse(res, 201, 'Registration successful', {
      user,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, tokens } = await authService.loginUser(req.body);
    res.cookie('token', tokens.accessToken, TOKEN_COOKIE_OPTIONS);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    return sendResponse(res, 200, 'Login successful', {
      user,
      accessToken: tokens.accessToken,
      token: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/logout
export const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const clearOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
    res.clearCookie('token', clearOpts);
    res.clearCookie('refreshToken', clearOpts);
    res.cookie('token', '', { ...clearOpts, maxAge: 0, expires: new Date(0) });
    res.cookie('refreshToken', '', { ...clearOpts, maxAge: 0, expires: new Date(0) });
    return sendResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/auth/me
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getCurrentUser(req.user!.id);
    return sendResponse(res, 200, 'User fetched', user);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/refresh
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return next(new AppError('No refresh token provided.', 401));

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const result = await authService.refreshUserToken(decoded.id);

    return sendResponse(res, 200, 'Token refreshed', result);
  } catch (error) {
    next(new AppError('Invalid or expired refresh token.', 401));
  }
};

// PATCH /api/v1/auth/change-password
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changeUserPassword(req.user!.id, currentPassword, newPassword);
    return sendResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
