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
  const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort } = filters;
  const skip = (page - 1) * limit;

  const where: any = { isActive: true };
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { title:       { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
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

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true, icon: true } },
        provider: { select: { id: true, name: true, avatar: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.service.count({ where }),
  ]);

  return { services, total };
};

export const getServiceById = async (id: string) => {
  const service = await prisma.service.findFirst({
    where: { id, isActive: true },
    include: {
      category: true,
      provider: {
        select: {
          id: true, name: true, avatar: true, phone: true,
          providerProfile: true,
        },
      },
      reviews: {
        include: { user: { select: { name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { bookings: true } },
    },
  });
  if (!service) throw new AppError('Service not found.', 404);
  return service;
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
      ...data,
      price: Number(data.price),
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
  const where: any = { id: serviceId };
  if (role !== 'ADMIN') where.providerId = providerId;

  const existing = await prisma.service.findFirst({ where });
  if (!existing) throw new AppError('Service not found.', 404);

  return prisma.service.update({ where: { id: serviceId }, data });
};

export const deleteService = async (providerId: string, serviceId: string, role: string) => {
  const where: any = { id: serviceId };
  if (role !== 'ADMIN') where.providerId = providerId;

  const existing = await prisma.service.findFirst({ where });
  if (!existing) throw new AppError('Service not found.', 404);

  return prisma.service.update({ where: { id: serviceId }, data: { isActive: false } });
};

export const getProviderServices = async (providerId: string) => {
  return prisma.service.findMany({
    where: { providerId },
    include: {
      category: { select: { name: true, slug: true } },
      _count: { select: { bookings: true, reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};
