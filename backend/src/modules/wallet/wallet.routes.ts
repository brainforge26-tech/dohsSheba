import { Router } from 'express';
import * as walletController from './wallet.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/',             walletController.getWallet);
router.get('/transactions', walletController.getTransactions);
router.post('/topup',       walletController.topUpWallet);

export default router;
