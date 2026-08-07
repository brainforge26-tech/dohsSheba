import { Request, Response, NextFunction } from 'express';
import * as serviceService from './service.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse, getPaginationMeta } from '../../utils/response.util';

// ─── Service Categories ───────────────────────────────────────────────────────

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await serviceService.getAllServiceCategories();
    return sendResponse(res, 200, 'Service categories fetched', categories);
  } catch (error) { next(error); }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await serviceService.createServiceCategory(req.body);
    return sendResponse(res, 201, 'Category created', category);
  } catch (error) { next(error); }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await serviceService.updateServiceCategory(req.params.id as string, req.body);
    return sendResponse(res, 200, 'Category updated', category);
  } catch (error) { next(error); }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await serviceService.deleteServiceCategory(req.params.id as string);
    return sendResponse(res, 200, 'Category deleted');
  } catch (error) { next(error); }
};

// ─── Services ─────────────────────────────────────────────────────────────────

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page     = Number(req.query.page     as string) || 1;
    const limit    = Number(req.query.limit    as string) || 100;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice as string) : undefined;

    const { services, total } = await serviceService.getServices({
      page, limit,
      category: req.query.category as string,
      search:   req.query.search   as string,
      sort:     req.query.sort     as string,
      minPrice,
      maxPrice,
    });

    return sendResponse(res, 200, 'Services fetched', services, getPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

export const getService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.getServiceById(req.params.id as string);
    return sendResponse(res, 200, 'Service fetched', service);
  } catch (error) { next(error); }
};

export const createService = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.createService(req.user!.id, req.body);
    return sendResponse(res, 201, 'Service created', service);
  } catch (error) { next(error); }
};

export const updateService = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.updateService(
      req.user!.id, req.params.id as string, req.user!.role, req.body
    );
    return sendResponse(res, 200, 'Service updated', service);
  } catch (error) { next(error); }
};

export const deleteService = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await serviceService.deleteService(req.user!.id, req.params.id as string, req.user!.role);
    return sendResponse(res, 200, 'Service deleted');
  } catch (error) { next(error); }
};

export const getMyServices = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const services = await serviceService.getProviderServices(req.user!.id);
    return sendResponse(res, 200, 'My services fetched', services);
  } catch (error) { next(error); }
};
