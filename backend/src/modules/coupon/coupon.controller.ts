import { Request, Response, NextFunction } from 'express';
import * as couponService from './coupon.service';
import { sendResponse } from '../../utils/response.util';

export const getAvailableCoupons = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await couponService.getAvailableCoupons();
    return sendResponse(res, 200, 'Available coupons retrieved successfully', coupons);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    return sendResponse(res, 201, 'Coupon created successfully', coupon);
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return sendResponse(res, 400, 'Coupon code is required', null);
    }
    const result = await couponService.validateCoupon(code, Number(subtotal) || 0);
    return sendResponse(res, 200, 'Coupon applied successfully', result);
  } catch (error: any) {
    return sendResponse(res, 400, error.message || 'Invalid coupon', null);
  }
};
