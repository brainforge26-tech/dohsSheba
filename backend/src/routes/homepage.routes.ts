import { Router } from 'express';
import { getHomepageData } from '../controllers/homepage.controller';

const router = Router();

// Public aggregated homepage data endpoint
router.get('/full', getHomepageData);

export default router;
