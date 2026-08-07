import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { generateSlug } from '../../utils/auth.util';

// ─── Service Categories ───────────────────────────────────────────────────────

export const getAllServiceCategories = async () => {
  return prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
};

export const createServiceCategory = async (data: {
  name: string;
  description?: string;
  icon?: string;
  image?: string;
}) => {
  const slug = generateSlug(data.name);
  return prisma.serviceCategory.create({ data: { ...data, slug } });
};

export const updateServiceCategory = async (id: string, data: object) => {
  const existing = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError('Category not found.', 404);
  return prisma.serviceCategory.update({ where: { id }, data });
};

export const deleteServiceCategory = async (id: string) => {
  const existing = await prisma.serviceCategory.findUnique({ where: { id } });
  if (!existing) throw new AppError('Category not found.', 404);
  return prisma.serviceCategory.update({ where: { id }, data: { isActive: false } });
};

// ─── Services ─────────────────────────────────────────────────────────────────

interface ServiceFilter {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export const getServices = async (filters: ServiceFilter) => {
  const { page = 1, limit = 20, category, search, minPrice, maxPrice, sort } = filters;
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };

  if (category && category !== 'all') {
    const keyword = category
      .replace(/-(service|repair|cleaner|plumber|services)$/i, '')
      .toLowerCase();

    where.OR = [
      { category: { slug: { contains: category, mode: 'insensitive' } } },
      { category: { slug: { contains: keyword, mode: 'insensitive' } } },
      { category: { name: { contains: keyword, mode: 'insensitive' } } },
      { title: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  if (search) {
    const searchCondition = [
      { title:       { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchCondition }];
      delete where.OR;
    } else {
      where.OR = searchCondition;
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  const orderBy: any =
    sort === 'price_asc'  ? { price: 'asc' }     :
    sort === 'price_desc' ? { price: 'desc' }    :
    sort === 'rating'     ? { rating: 'desc' }   :
    { createdAt: 'desc' };

  const [rawServices, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true, icon: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.service.count({ where }),
  ]);

  // Format services to represent DOHS Sheba Service Team
  const services = rawServices.map((s) => ({
    ...s,
    provider: {
      id: 'dohsheba-service-team',
      name: 'DOHS Sheba Service Team',
      avatar: '🛡️',
      isVerified: true,
    },
  }));

  return { services, total };
};

export const getServiceById = async (id: string) => {
  const rawService = await prisma.service.findFirst({
    where: { id, isActive: true },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { bookings: true } },
    },
  });
  if (!rawService) throw new AppError('Service not found.', 404);

  return {
    ...rawService,
    provider: {
      id: 'dohsheba-service-team',
      name: 'DOHS Sheba Service Team',
      title: 'Professional Verified Team',
      avatar: '🛡️',
      isVerified: true,
      bio: 'Managed directly by DOHS Sheba operations. Certified background-checked technicians.',
    },
  };
};

export const createService = async (
  providerId: string,
  data: {
    title: string;
    description: string;
    price: number;
    priceUnit?: string;
    categoryId: string;
    images?: string[];
  }
) => {
  return prisma.service.create({
    data: {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      priceUnit: data.priceUnit || 'hour',
      categoryId: data.categoryId,
      images: data.images ?? [],
      providerId,
    },
  });
};

export const updateService = async (
  providerId: string,
  serviceId: string,
  role: string,
  data: object
) => {
  const existing = await prisma.service.findFirst({ where: { id: serviceId } });
  if (!existing) throw new AppError('Service not found.', 404);

  return prisma.service.update({ where: { id: serviceId }, data });
};

export const deleteService = async (providerId: string, serviceId: string, role: string) => {
  const existing = await prisma.service.findFirst({ where: { id: serviceId } });
  if (!existing) throw new AppError('Service not found.', 404);

  return prisma.service.update({ where: { id: serviceId }, data: { isActive: false } });
};

export const getProviderServices = async (providerId: string) => {
  return prisma.service.findMany({
    where: { isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      _count: { select: { bookings: true, reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
