import { Router } from 'express';
import { getBrands, createBrand, deleteBrand } from '../controllers/brand.controller';

const router = Router();

router.get('/', getBrands);
router.post('/', createBrand);
router.delete('/:id', deleteBrand);

export default router;
