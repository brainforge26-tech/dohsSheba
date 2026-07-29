import { Request, Response, NextFunction } from 'express';
import * as reviewService from './review.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse, getPaginationMeta } from '../../utils/response.util';

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await reviewService.createReview(req.user!.id, req.body);
    return sendResponse(res, 201, 'Review submitted', review);
  } catch (error) { next(error); }
};

export const getServiceReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page  = Number(req.query.page  as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const { reviews, total } = await reviewService.getReviewsForService(
      req.params.serviceId as string, page, limit
    );
    return sendResponse(res, 200, 'Reviews fetched', reviews, getPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page  = Number(req.query.page  as string) || 1;
    const limit = Number(req.query.limit as string) || 10;
    const { reviews, total } = await reviewService.getReviewsForProduct(
      req.params.productId as string, page, limit
    );
    return sendResponse(res, 200, 'Reviews fetched', reviews, getPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await reviewService.deleteReview(req.params.id as string, req.user!.id, req.user!.role);
    return sendResponse(res, 200, 'Review deleted');
  } catch (error) { next(error); }
};

export const getMyReviews = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getUserReviews(req.user!.id);
    return sendResponse(res, 200, 'My reviews fetched', reviews);
  } catch (error) { next(error); }
};

