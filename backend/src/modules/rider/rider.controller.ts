import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as riderService from './rider.service';
import { sendResponse, getPaginationMeta } from '../../utils/response.util';

// ─── GET /rider/profile ───────────────────────────────────────────────────────
export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await riderService.getRiderProfile(req.user!.id);
    return sendResponse(res, 200, 'Rider profile fetched', data);
  } catch (e) { next(e); }
};

// ─── GET /rider/stats ─────────────────────────────────────────────────────────
export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await riderService.getTodayStats(req.user!.id);
    return sendResponse(res, 200, 'Rider stats fetched', data);
  } catch (e) { next(e); }
};

// ─── GET /rider/orders/assigned ───────────────────────────────────────────────
export const getAssignedOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await riderService.getAssignedOrders(req.user!.id);
    return sendResponse(res, 200, 'Assigned orders fetched', data);
  } catch (e) { next(e); }
};

// ─── GET /rider/orders/pending ────────────────────────────────────────────────
export const getPendingOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await riderService.getPendingAssignedOrders(req.user!.id);
    return sendResponse(res, 200, 'Pending assigned orders fetched', data);
  } catch (e) { next(e); }
};

// ─── PATCH /rider/orders/:id/accept ──────────────────────────────────────────
export const acceptOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const order = await riderService.acceptOrder(req.params.id as string, req.user!.id);
    return sendResponse(res, 200, 'Order accepted successfully', order);
  } catch (e) { next(e); }
};

// ─── PATCH /rider/orders/:id/status ──────────────────────────────────────────
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const order = await riderService.updateOrderStatus(req.params.id as string, req.user!.id, status);
    return sendResponse(res, 200, `Order status updated to ${status}`, order);
  } catch (e) { next(e); }
};

// ─── PATCH /rider/availability ────────────────────────────────────────────────
export const toggleAvailability = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await riderService.toggleAvailability(req.user!.id);
    return sendResponse(res, 200, `Rider is now ${profile.isAvailable ? 'Online' : 'Offline'}`, profile);
  } catch (e) { next(e); }
};

// ─── GET /rider/orders/history ────────────────────────────────────────────────
export const getHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const { orders, total } = await riderService.getDeliveryHistory(req.user!.id, page, limit);
    return sendResponse(res, 200, 'Delivery history fetched', orders, getPaginationMeta(total, page, limit));
  } catch (e) { next(e); }
};
