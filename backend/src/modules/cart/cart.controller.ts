import { Request, Response, NextFunction } from 'express';
import * as cartService from './cart.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse } from '../../utils/response.util';

export const getCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getOrCreateCart(req.user!.id);
    return sendResponse(res, 200, 'Cart fetched', cart);
  } catch (error) { next(error); }
};

export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity = 1 } = req.body;
    await cartService.addItemToCart(req.user!.id, String(productId), Number(quantity));
    return sendResponse(res, 200, 'Item added to cart');
  } catch (error) { next(error); }
};

export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await cartService.updateCartItem(req.user!.id, req.params.id as string, Number(req.body.quantity));
    return sendResponse(res, 200, 'Cart updated');
  } catch (error) { next(error); }
};

export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await cartService.removeCartItem(req.user!.id, req.params.id as string);
    return sendResponse(res, 200, 'Item removed from cart');
  } catch (error) { next(error); }
};

export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await cartService.clearUserCart(req.user!.id);
    return sendResponse(res, 200, 'Cart cleared');
  } catch (error) { next(error); }
};
