import { Router } from 'express';
import * as bannerController from './banner.controller';

const router = Router();

router.get('/', bannerController.getBanners);

export default router;
