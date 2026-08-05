import { Request, Response, NextFunction } from 'express';
import * as productService from './product.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { sendResponse, getPaginationMeta } from '../../utils/response.util';

// Categories
export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cats = await productService.getAllProductCategories();
    return sendResponse(res, 200, 'Product categories fetched', cats);
  } catch (error) { next(error); }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = await productService.getCategoryBySlug(req.params.slug as string);
    return sendResponse(res, 200, 'Category fetched', cat);
  } catch (error) { next(error); }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = await productService.createProductCategory(req.body);
    return sendResponse(res, 201, 'Category created', cat);
  } catch (error) { next(error); }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = await productService.updateProductCategory(req.params.id as string, req.body);
    return sendResponse(res, 200, 'Category updated', cat);
  } catch (error) { next(error); }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProductCategory(req.params.id as string);
    return sendResponse(res, 200, 'Category deleted', null);
  } catch (error) { next(error); }
};

// Products
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page     = Number(req.query.page     as string) || 1;
    const limit    = Number(req.query.limit    as string) || 12;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice as string) : undefined;

    const { products, total } = await productService.getProducts({
      page, limit,
      category: req.query.category as string,
      search:   req.query.search   as string,
      sort:     req.query.sort     as string,
      featured: req.query.featured === 'true',
      flashSale: req.query.flashSale === 'true',
      minPrice, maxPrice,
    });
    return sendResponse(res, 200, 'Products fetched', products, getPaginationMeta(total, page, limit));
  } catch (error) { next(error); }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id as string);
    return sendResponse(res, 200, 'Product fetched', product);
  } catch (error) { next(error); }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.user!.id, req.body);
    return sendResponse(res, 201, 'Product created', product);
  } catch (error) { next(error); }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(
      req.user!.id, req.params.id as string, req.user!.role, req.body
    );
    return sendResponse(res, 200, 'Product updated', product);
  } catch (error) { next(error); }
};

export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.user!.id, req.params.id as string, req.user!.role);
    return sendResponse(res, 200, 'Product deleted');
  } catch (error) { next(error); }
};

export const getMyProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getSellerProducts(req.user!.id);
    return sendResponse(res, 200, 'My products fetched', products);
  } catch (error) { next(error); }
};

export const patchStock = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { adjustment, stock } = req.body;
    const product = await productService.adjustStock(
      req.user!.id, req.params.id as string, adjustment, stock, req.user!.role
    );
    return sendResponse(res, 200, 'Stock updated', product);
  } catch (err) { next(err); }
};
