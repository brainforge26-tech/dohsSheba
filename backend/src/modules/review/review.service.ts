import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';

export const createReview = async (
  userId: string,
  data: {
    rating: number; comment?: string;
    serviceId?: string; productId?: string;
    bookingId?: string;
  }
) => {
  if (!data.serviceId && !data.productId) {
    throw new AppError('Either serviceId or productId is required.', 400);
  }

  const review = await prisma.review.create({
    data: {
      userId,
      rating: data.rating,
      comment: data.comment,
      serviceId: data.serviceId,
      productId: data.productId,
      bookingId: data.bookingId,
    },
    include: { user: { select: { name: true, avatar: true } } },
  });

  // Update rating average
  if (data.serviceId) {
    const stats = await prisma.review.aggregate({
      where:   { serviceId: data.serviceId },
      _avg:    { rating: true },
      _count:  { rating: true },
    });
    await prisma.service.update({
      where: { id: data.serviceId },
      data:  { rating: stats._avg.rating ?? 0, totalReviews: stats._count.rating },
    });
  }

  if (data.productId) {
    const stats = await prisma.review.aggregate({
      where:  { productId: data.productId },
      _avg:   { rating: true },
      _count: { rating: true },
    });
    await prisma.product.update({
      where: { id: data.productId },
      data:  { rating: stats._avg.rating ?? 0, totalReviews: stats._count.rating },
    });
  }

  return review;
};

export const getReviewsForService = async (serviceId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { serviceId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip, take: limit,
    }),
    prisma.review.count({ where: { serviceId } }),
  ]);
  return { reviews, total };
};

export const getReviewsForProduct = async (productId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      skip, take: limit,
    }),
    prisma.review.count({ where: { productId } }),
  ]);
  return { reviews, total };
};

export const deleteReview = async (reviewId: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new AppError('Review not found.', 404);
  if (role !== 'ADMIN' && review.userId !== userId) throw new AppError('Access denied.', 403);
  await prisma.review.delete({ where: { id: reviewId } });
};

export const getUserReviews = async (userId: string) => {
  return prisma.review.findMany({
    where: { userId },
    include: {
      product: { select: { name: true, seller: { select: { sellerProfile: { select: { shopName: true } } } } } },
      service: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

