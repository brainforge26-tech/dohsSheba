import { Response, NextFunction } from 'express';
import * as orderService from './order.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse, getPaginationMeta } from '../../utils/response.util';
import { OrderStatus } from '@prisma/client';

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page   = Number(req.query.page   as string) || 1;
    const limit  = Number(req.query.limit  as string) || 10;
    const status = req.query.status as string | undefined;
    const { orders, total } = await orderService.getOrders(
      req.user!.id, req.user!.role, { page, limit, status }
    );
    return sendResponse(res, 200, 'Orders fetched', orders, getPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.getOrderById(req.params.id as string, req.user!.id, req.user!.role);
    return sendResponse(res, 200, 'Order fetched', order);
  } catch (error) { next(error); }
};

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createOrderFromCart(req.user!.id, req.body);
    return sendResponse(res, 201, 'Order placed successfully', order);
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id as string, req.body.status as OrderStatus);
    return sendResponse(res, 200, 'Order status updated', order);
  } catch (error) { next(error); }
};

export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await orderService.cancelOrder(req.params.id as string, req.user!.id);
    return sendResponse(res, 200, 'Order cancelled');
  } catch (error) { next(error); }
};

export const deleteOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await orderService.permanentlyDeleteOrder(req.params.id as string);
    return sendResponse(res, 200, 'Order deleted permanently');
  } catch (error) { next(error); }
};
