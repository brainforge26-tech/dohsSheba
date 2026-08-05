import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { generateSlug } from '../../utils/auth.util';

interface ProductFilter {
  page?: number; limit?: number;
  category?: string; search?: string;
  minPrice?: number; maxPrice?: number;
  sort?: string; featured?: boolean; flashSale?: boolean;
}

// ─── Product Categories ───────────────────────────────────────────────────────

export const getAllProductCategories = async () => {
  try {
    let cats = await prisma.productCategory.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          include: { _count: { select: { products: { where: { isActive: true } } } } },
        },
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { name: 'asc' },
    });

    return cats || [];
  } catch (err) {
    console.error('Error fetching product categories:', err);
    return [];
  }
};

export const createProductCategory = async (data: {
  name: string; description?: string; icon?: string;
  image?: string; parentId?: string;
}) => {
  const slug = generateSlug(data.name);
  return prisma.productCategory.create({ data: { ...data, slug } });
};

export const updateProductCategory = async (id: string, data: object) => {
  const existing = await prisma.productCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError('Category not found.', 404);
  return prisma.productCategory.update({ where: { id }, data });
};

export const deleteProductCategory = async (id: string) => {
  const existing = await prisma.productCategory.findUnique({
    where: { id },
    include: {
      children: true,
    },
  });
  if (!existing) throw new AppError('Category not found.', 404);

  const childIds = existing.children.map((c) => c.id);
  const allCatIds = [id, ...childIds];

  // 1. Check if category or any of its subcategories has linked ACTIVE products
  const activeProductCount = await prisma.product.count({
    where: {
      categoryId: { in: allCatIds },
      isActive: true,
    },
  });

  if (activeProductCount > 0) {
    throw new AppError(
      `Cannot delete category "${existing.name}". It is currently in use by ${activeProductCount} active product(s). Please reassign or delete those active products first.`,
      400
    );
  }

  // 2. Clean up any remaining soft-deleted / inactive products linked to subcategories & delete subcategories
  if (existing.children.length > 0) {
    for (const child of existing.children) {
      await prisma.product.deleteMany({ where: { categoryId: child.id, isActive: false } }).catch(() => null);
      await prisma.productCategory.delete({ where: { id: child.id } }).catch(() => null);
    }
  }

  // Clean up any remaining soft-deleted / inactive products linked to parent category
  await prisma.product.deleteMany({ where: { categoryId: id, isActive: false } }).catch(() => null);

  // 3. Delete parent category safely
  return prisma.productCategory.delete({ where: { id } });
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const getProducts = async (filters: ProductFilter) => {
  const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort, featured, flashSale } = filters;
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };
  if (category) {
    const catObj = await prisma.productCategory.findFirst({
      where: { slug: category },
      include: { children: { select: { id: true } } },
    });

    if (catObj) {
      if (catObj.children && catObj.children.length > 0) {
        const catIds = [catObj.id, ...catObj.children.map((c) => c.id)];
        where.categoryId = { in: catIds };
      } else {
        where.categoryId = catObj.id;
      }
    } else {
      where.category = { slug: category };
    }
  }
  if (featured)   where.isFeatured = true;
  if (flashSale)  where.isFlashSale = true;
  if (search) {
    where.OR = [
      { name:        { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const orderBy: any =
    sort === 'price_asc'  ? { price: 'asc' }       :
    sort === 'price_desc' ? { price: 'desc' }      :
    sort === 'rating'     ? { rating: 'desc' }     :
    sort === 'popular'    ? { totalReviews: 'desc' } :
    { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        seller: {
          select: {
            id: true, name: true,
            sellerProfile: { select: { shopName: true } },
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
      isActive: true,
    },
    include: {
      category: true,
      brand: true,
      seller: {
        select: {
          id: true, name: true, avatar: true,
          sellerProfile: true,
        },
      },
      reviews: {
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });
  if (!product) throw new AppError('Product not found.', 404);
  return product;
};

export const createProduct = async (
  sellerId: string,
  data: any
) => {
  const {
    name, description, price, salePrice, costPrice, discount,
    categoryId, brand, brandId, images, stock, unit,
    isFeatured, isFlashSale, isActive,
    sku, barcode, weight, length, width, height,
    videoUrl, metaTitle, metaDescription, relatedProductIds, relatedProducts
  } = data;
  const slug = data.slug ? `${generateSlug(data.slug)}-${Date.now().toString().slice(-4)}` : `${generateSlug(name || 'product')}-${Date.now()}`;

  // Resolve Brand ID from brand string if provided
  let resolvedBrandId = brandId || null;
  let brandName = typeof brand === 'string' ? brand.trim() : undefined;

  if (!resolvedBrandId && brandName) {
    let b = await prisma.brand.findFirst({
      where: { name: { equals: brandName, mode: 'insensitive' } },
    });
    if (!b) {
      b = await prisma.brand.create({
        data: { name: brandName, slug: generateSlug(brandName) },
      }).catch(() => null);
    }
    if (b) resolvedBrandId = b.id;
  }

  // Resolve Category ID fallback
  let resolvedCategoryId = categoryId;
  if (!resolvedCategoryId) {
    const firstCat = await prisma.productCategory.findFirst();
    if (firstCat) resolvedCategoryId = firstCat.id;
    else {
      const newCat = await prisma.productCategory.create({ data: { name: 'General', slug: `gen-${Date.now()}` } });
      resolvedCategoryId = newCat.id;
    }
  }

  // Resolve related product IDs array
  let relIds: string[] = [];
  if (Array.isArray(relatedProductIds)) {
    relIds = relatedProductIds;
  } else if (Array.isArray(relatedProducts)) {
    relIds = relatedProducts.map((r: any) => typeof r === 'string' ? r : r.id).filter(Boolean);
  }

  return prisma.product.create({
    data: {
      sellerId,
      categoryId: resolvedCategoryId,
      brandId:     resolvedBrandId,
      brandName:   brandName || undefined,
      name:        name || 'Untitled Product',
      slug,
      description: description || '',
      price:       Number(price || 0),
      salePrice:   salePrice ? Number(salePrice) : undefined,
      costPrice:   costPrice ? Number(costPrice) : undefined,
      discount:    Number(discount || 0),
      stock:       Number(stock || 0),
      unit:        unit || 'unit',
      isFeatured:  Boolean(isFeatured),
      isFlashSale: Boolean(isFlashSale),
      isActive:    isActive !== undefined ? Boolean(isActive) : true,
      images:      Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600'],
      sku:         sku || undefined,
      barcode:     barcode || undefined,
      weight:      weight ? Number(weight) : undefined,
      length:      length ? Number(length) : undefined,
      width:       width ? Number(width) : undefined,
      height:      height ? Number(height) : undefined,
      videoUrl:    videoUrl || undefined,
      metaTitle:   metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      relatedProductIds: relIds,
    },
    include: {
      category: true,
      brand: true,
    },
  });
};

export const updateProduct = async (
  sellerId: string, productId: string, role: string, data: any
) => {
  const existing = await prisma.product.findUnique({ where: { id: productId } });

  const {
    name, description, price, salePrice, costPrice, discount,
    categoryId, brand, brandId, images, stock, unit,
    isFeatured, isFlashSale, isActive,
    sku, barcode, weight, length, width, height,
    videoUrl, metaTitle, metaDescription, relatedProductIds, relatedProducts
  } = data;
  const updateData: any = {};
  if (name !== undefined)        updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined)       updateData.price = Number(price);
  if (salePrice !== undefined)   updateData.salePrice = salePrice ? Number(salePrice) : null;
  if (costPrice !== undefined)   updateData.costPrice = costPrice ? Number(costPrice) : null;
  if (discount !== undefined)    updateData.discount = Number(discount);
  if (categoryId !== undefined)  updateData.categoryId = categoryId;
  if (sku !== undefined)         updateData.sku = sku || null;
  if (barcode !== undefined)     updateData.barcode = barcode || null;
  if (weight !== undefined)      updateData.weight = weight ? Number(weight) : null;
  if (length !== undefined)      updateData.length = length ? Number(length) : null;
  if (width !== undefined)       updateData.width = width ? Number(width) : null;
  if (height !== undefined)      updateData.height = height ? Number(height) : null;
  if (videoUrl !== undefined)    updateData.videoUrl = videoUrl || null;
  if (metaTitle !== undefined)   updateData.metaTitle = metaTitle || null;
  if (metaDescription !== undefined) updateData.metaDescription = metaDescription || null;

  if (Array.isArray(relatedProductIds)) {
    updateData.relatedProductIds = relatedProductIds;
  } else if (Array.isArray(relatedProducts)) {
    updateData.relatedProductIds = relatedProducts.map((r: any) => typeof r === 'string' ? r : r.id).filter(Boolean);
  }

  // Resolve Brand ID
  if (brandId !== undefined) updateData.brandId = brandId || null;
  else if (brand && typeof brand === 'string') {
    const cleanBrandName = brand.trim();
    if (cleanBrandName) {
      updateData.brandName = cleanBrandName;
      let b = await prisma.brand.findFirst({
        where: { name: { equals: cleanBrandName, mode: 'insensitive' } },
      });
      if (!b) {
        b = await prisma.brand.create({
          data: { name: cleanBrandName, slug: generateSlug(cleanBrandName) },
        }).catch(() => null);
      }
      if (b) updateData.brandId = b.id;
    }
  }

  if (images !== undefined)      updateData.images = Array.isArray(images) ? images : [];
  if (stock !== undefined)       updateData.stock = Number(stock);
  if (unit !== undefined)        updateData.unit = unit;
  if (isFeatured !== undefined)  updateData.isFeatured = Boolean(isFeatured);
  if (isFlashSale !== undefined) updateData.isFlashSale = Boolean(isFlashSale);
  if (isActive !== undefined)    updateData.isActive = Boolean(isActive);

  if (existing) {
    return prisma.product.update({ where: { id: productId }, data: updateData });
  } else {
    return createProduct(sellerId, { id: productId, ...data });
  }
};

export const deleteProduct = async (sellerId: string, productId: string, role: string) => {
  const where: any = { id: productId };
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') where.sellerId = sellerId;

  const existing = await prisma.product.findFirst({
    where,
    include: { _count: { select: { orderItems: true } } },
  });
  if (!existing) throw new AppError('Product not found.', 404);

  // If product has never been ordered in an order, hard-delete from database
  if (existing._count.orderItems === 0) {
    await prisma.cartItem.deleteMany({ where: { productId } }).catch(() => null);
    await prisma.wishlistItem.deleteMany({ where: { productId } }).catch(() => null);
    await prisma.review.deleteMany({ where: { productId } }).catch(() => null);
    return prisma.product.delete({ where: { id: productId } });
  }

  // If product is linked to past orders, soft-delete (isActive: false) to preserve order history integrity
  return prisma.product.update({ where: { id: productId }, data: { isActive: false } });
};

export const getSellerProducts = async (sellerId: string) => {
  return prisma.product.findMany({
    where: {
      sellerId,
      isActive: true,
    },
    include: {
      category: { select: { name: true, slug: true } },
      _count: { select: { reviews: true, orderItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

// ─── Stock Adjustment ────────────────────────────────────────────────────────

export const adjustStock = async (
  sellerId: string, productId: string,
  adjustment?: number, stock?: number, role?: string
) => {
  const where: any = { id: productId };
  if (role !== 'ADMIN') where.sellerId = sellerId;

  const existing = await prisma.product.findFirst({ where });
  if (!existing) throw new AppError('Product not found.', 404);

  // If absolute stock is provided, set it directly
  // Otherwise apply the relative adjustment (+/-)
  const newStock = stock !== undefined
    ? Math.max(0, stock)
    : Math.max(0, existing.stock + (adjustment ?? 0));

  return prisma.product.update({
    where: { id: productId },
    data:  { stock: newStock },
    include: { category: { select: { name: true } } },
  });
};

