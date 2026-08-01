import { Request, Response, NextFunction } from 'express';
import * as bannerService from './banner.service';
import { sendResponse } from '../../utils/response.util';

export const getBanners = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await bannerService.getPublicBanners();
    return sendResponse(res, 200, 'Public banners fetched', banners);
  } catch (error) {
    next(error);
  }
};
