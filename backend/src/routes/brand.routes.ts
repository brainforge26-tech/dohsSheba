import { Router } from 'express';
import { getBrands, createBrand } from '../controllers/brand.controller';

const router = Router();

router.get('/', getBrands);
router.post('/', createBrand);

export default router;
