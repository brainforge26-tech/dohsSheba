import { Response, NextFunction } from 'express';
import * as walletService from './wallet.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse, getPaginationMeta } from '../../utils/response.util';

export const getWallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const wallet = await walletService.getWallet(req.user!.id);
    return sendResponse(res, 200, 'Wallet fetched', wallet);
  } catch (error) { next(error); }
};

export const getTransactions = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const { transactions, total } = await walletService.getTransactions(req.user!.id, page, limit);
    return sendResponse(res, 200, 'Transactions fetched', transactions, getPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

export const topUpWallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { amount } = req.body;
    const wallet = await walletService.creditWallet(req.user!.id, Number(amount || 500), 'Wallet Top Up via bKash Online');
    return sendResponse(res, 200, 'Wallet topped up successfully', wallet);
  } catch (error) { next(error); }
};
