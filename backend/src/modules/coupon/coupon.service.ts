import { prisma } from '../../lib/prisma';

export const getAvailableCoupons = async () => {
  let coupons = await prisma.coupon.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  // Seed default coupons if empty
  if (coupons.length === 0) {
    await prisma.coupon.createMany({
      data: [
        {
          code: 'RESIDENT50',
          description: '৳50 Off DOHS Resident Special',
          discountType: 'FLAT',
          discountValue: 50,
          minOrderAmount: 500,
          expiresAt: new Date('2026-12-31'),
        },
        {
          code: 'DOHS100',
          description: '৳100 Off Mega Grocery Shopping',
          discountType: 'FLAT',
          discountValue: 100,
          minOrderAmount: 1000,
          expiresAt: new Date('2026-12-31'),
        },
        {
          code: 'WELCOME200',
          description: '৳200 Off First Order Special',
          discountType: 'FLAT',
          discountValue: 200,
          minOrderAmount: 1500,
          expiresAt: new Date('2026-08-15'),
        },
        {
          code: 'SHEBA15',
          description: '15% Off All Service Bookings',
          discountType: 'PERCENTAGE',
          discountValue: 15,
          minOrderAmount: 800,
          expiresAt: new Date('2026-11-30'),
        },
      ],
    });

    coupons = await prisma.coupon.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  return coupons;
};

export const createCoupon = async (data: any) => {
  return prisma.coupon.create({
    data: {
      code: data.code.toUpperCase(),
      description: data.description || data.title || '',
      discountType: data.discountType || 'FLAT',
      discountValue: Number(data.discountValue || data.discount || 0),
      minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : null,
      maxUses: data.maxUses ? Number(data.maxUses) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
};
