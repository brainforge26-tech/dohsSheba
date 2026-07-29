import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { sendResponse, getPaginationMeta } from '../../utils/response.util';

export const getDashboard = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await adminService.getDashboardStats();
    return sendResponse(res, 200, 'Dashboard stats fetched', data);
  } catch (error) { next(error); }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page   = Number(req.query.page   as string) || 1;
    const limit  = Number(req.query.limit  as string) || 20;
    const role   = req.query.role   as string | undefined;
    const search = req.query.search as string | undefined;
    const { users, total } = await adminService.getAllUsers(page, limit, role, search);
    return sendResponse(res, 200, 'Users fetched', users, getPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

export const toggleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await adminService.toggleUserStatus(req.params.id as string);
    return sendResponse(res, 200, `User ${user.isActive ? 'activated' : 'deactivated'}`, user);
  } catch (error) { next(error); }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.params.id as string, role);
    return sendResponse(res, 200, `User role updated to ${role}`, user);
  } catch (error) { next(error); }
};

export const approvePartner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await adminService.approvePartner(req.params.id as string);
    return sendResponse(res, 200, 'Partner approved successfully', user);
  } catch (error) { next(error); }
};

// Banners
export const getBanners = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendResponse(res, 200, 'Banners fetched', await adminService.getBanners()); }
  catch (e) { next(e); }
};
export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendResponse(res, 201, 'Banner created', await adminService.createBanner(req.body)); }
  catch (e) { next(e); }
};
export const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendResponse(res, 200, 'Banner updated', await adminService.updateBanner(req.params.id as string, req.body)); }
  catch (e) { next(e); }
};
export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try { await adminService.deleteBanner(req.params.id as string); return sendResponse(res, 200, 'Banner deleted'); }
  catch (e) { next(e); }
};

// Coupons
export const getCoupons = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendResponse(res, 200, 'Coupons fetched', await adminService.getCoupons()); }
  catch (e) { next(e); }
};
export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendResponse(res, 201, 'Coupon created', await adminService.createCoupon(req.body)); }
  catch (e) { next(e); }
};
export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try { return sendResponse(res, 200, 'Coupon updated', await adminService.updateCoupon(req.params.id as string, req.body)); }
  catch (e) { next(e); }
};
export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try { await adminService.deleteCoupon(req.params.id as string); return sendResponse(res, 200, 'Coupon deleted'); }
  catch (e) { next(e); }
};

// ─── Rider Dispatch Controllers ───────────────────────────────────────────────

export const getAvailableRiders = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendResponse(res, 200, 'Available riders fetched', await adminService.getAvailableRiders()); }
  catch (e) { next(e); }
};

export const getAllRiders = async (_req: Request, res: Response, next: NextFunction) => {
  try { return sendResponse(res, 200, 'All riders fetched', await adminService.getAllRiders()); }
  catch (e) { next(e); }
};

export const getAdminOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page   = Number(req.query.page)   || 1;
    const limit  = Number(req.query.limit)  || 20;
    const status = req.query.status as string | undefined;
    const { orders, total } = await adminService.getAdminOrders(page, limit, status);
    return sendResponse(res, 200, 'Orders fetched', orders, getPaginationMeta(total, page, limit));
  } catch (e) { next(e); }
};

export const assignRider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { riderId } = req.body;
    const order = await adminService.assignRiderToOrder(req.params.id as string, riderId);
    return sendResponse(res, 200, 'Rider assigned successfully', order);
  } catch (e) { next(e); }
};

export const unassignRider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await adminService.unassignRider(req.params.id as string);
    return sendResponse(res, 200, 'Rider unassigned', order);
  } catch (e) { next(e); }
};
