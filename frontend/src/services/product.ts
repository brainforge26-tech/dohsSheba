import { ALL_PRODUCTS } from '@/constants/products';
import { ProductCategorySlug, ProductItem } from '@/types/shopping';

export class ProductService {
  static async getProductsByCategory(categorySlug: ProductCategorySlug | 'all'): Promise<ProductItem[]> {
    if (categorySlug === 'all') return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
  }

  static async getProductBySlug(slug: string): Promise<ProductItem | null> {
    return ALL_PRODUCTS.find((p) => p.slug === slug) || null;
  }

  static async searchProducts(query: string): Promise<ProductItem[]> {
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(
      (p) => p.title.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q)
    );
  }
}
