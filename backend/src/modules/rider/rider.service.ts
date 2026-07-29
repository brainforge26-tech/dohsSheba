import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';

// ─── Get Rider's own profile ─────────────────────────────────────────────────

export const getRiderProfile = async (riderId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: riderId },
    select: {
      id: true, name: true, email: true, phone: true, avatar: true,
      riderProfile: true,
    },
  });
  if (!user) throw new AppError('Rider not found.', 404);
  return user;
};

// ─── Get assigned orders for this rider ──────────────────────────────────────

export const getAssignedOrders = async (riderId: string) => {
  return prisma.order.findMany({
    where: {
      riderId,
      status: { in: ['RIDER_ASSIGNED', 'PROCESSING', 'SHIPPED'] },
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      customer: { select: { name: true, phone: true } },
      address: true,
      items: {
        include: {
          product: { select: { name: true, images: true, unit: true } },
        },
      },
    },
  });
};

// ─── Get pending (unaccepted) orders assigned to this rider ──────────────────

export const getPendingAssignedOrders = async (riderId: string) => {
  return prisma.order.findMany({
    where: { riderId, status: 'RIDER_ASSIGNED' },
    orderBy: { updatedAt: 'desc' },
    include: {
      customer: { select: { name: true, phone: true } },
      address: true,
      items: {
        include: {
          product: { select: { name: true, images: true, unit: true } },
        },
      },
    },
  });
};

// ─── Accept an assigned order ─────────────────────────────────────────────────

export const acceptOrder = async (orderId: string, riderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found.', 404);
  if (order.riderId !== riderId) throw new AppError('This order is not assigned to you.', 403);
  if (order.status !== 'RIDER_ASSIGNED') throw new AppError('Order is not in RIDER_ASSIGNED status.', 400);

  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'PROCESSING' },
    include: {
      customer: { select: { name: true, phone: true } },
      address: true,
      items: { include: { product: { select: { name: true } } } },
    },
  });
};

// ─── Update delivery step status ──────────────────────────────────────────────

export const updateOrderStatus = async (
  orderId: string,
  riderId: string,
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED'
) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found.', 404);
  if (order.riderId !== riderId) throw new AppError('This order is not assigned to you.', 403);

  const allowedTransitions: Record<string, string[]> = {
    PROCESSING: ['SHIPPED'],
    SHIPPED:    ['DELIVERED'],
  };

  if (!allowedTransitions[order.status]?.includes(status)) {
    throw new AppError(`Cannot transition from ${order.status} to ${status}.`, 400);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  // On delivery completion, update rider's totalTrips and totalEarnings
  if (status === 'DELIVERED') {
    await prisma.riderProfile.update({
      where: { userId: riderId },
      data: {
        totalTrips:    { increment: 1 },
        totalEarnings: { increment: order.deliveryFee },
      },
    });
  }

  return updatedOrder;
};

// ─── Toggle rider availability ────────────────────────────────────────────────

export const toggleAvailability = async (riderId: string) => {
  const profile = await prisma.riderProfile.findUnique({ where: { userId: riderId } });
  if (!profile) throw new AppError('Rider profile not found.', 404);

  return prisma.riderProfile.update({
    where: { userId: riderId },
    data: { isAvailable: !profile.isAvailable },
  });
};

// ─── Get delivery history ─────────────────────────────────────────────────────

export const getDeliveryHistory = async (riderId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { riderId, status: 'DELIVERED' },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        customer: { select: { name: true } },
        address:  { select: { area: true, city: true } },
      },
    }),
    prisma.order.count({ where: { riderId, status: 'DELIVERED' } }),
  ]);
  return { orders, total };
};

// ─── Get today's stats ────────────────────────────────────────────────────────

export const getTodayStats = async (riderId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [todayDeliveries, activeOrders, profile] = await Promise.all([
    prisma.order.count({
      where: { riderId, status: 'DELIVERED', updatedAt: { gte: startOfDay } },
    }),
    prisma.order.count({
      where: { riderId, status: { in: ['RIDER_ASSIGNED', 'PROCESSING', 'SHIPPED'] } },
    }),
    prisma.riderProfile.findUnique({ where: { userId: riderId } }),
  ]);

  const todayEarnings = await prisma.order.aggregate({
    where: { riderId, status: 'DELIVERED', updatedAt: { gte: startOfDay } },
    _sum: { deliveryFee: true },
  });

  return {
    todayDeliveries,
    activeOrders,
    todayEarnings: todayEarnings._sum.deliveryFee ?? 0,
    totalTrips:    profile?.totalTrips ?? 0,
    totalEarnings: profile?.totalEarnings ?? 0,
    rating:        profile?.rating ?? 5.0,
    isAvailable:   profile?.isAvailable ?? true,
    vehicleType:   profile?.vehicleType ?? 'Bicycle',
    vehicleNo:     profile?.vehicleNo ?? '',
  };
};
