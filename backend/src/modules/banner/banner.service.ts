import { prisma } from '../../lib/prisma';

export const getPublicBanners = async () => {
  return prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
};
