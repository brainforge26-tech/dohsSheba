import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { OrderStatus } from '@prisma/client';
import { emitToOnlineRiders, emitToUser, emitToOrderRoom, emitToSellerRoom } from '../../lib/socket';

// ─── Get Rider Profile ────────────────────────────────────────────────────────

export const getRiderProfile = async (riderId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: riderId },
    select: {
      id: true, name: true, email: true, phone: true, avatar: true,
      riderProfile: true,
    },
  });
  if (!user) throw new AppError('Rider profile not found.', 404);
  return user;
};

// ─── Toggle Duty (Online/Offline) ─────────────────────────────────────────────

export const toggleDuty = async (riderId: string, isOnline?: boolean) => {
  const profile = await prisma.riderProfile.findUnique({ where: { userId: riderId } });
  if (!profile) throw new AppError('Rider profile not found.', 404);

  const newStatus = isOnline !== undefined ? isOnline : !profile.isOnline;

  const updated = await prisma.riderProfile.update({
    where: { userId: riderId },
    data: {
      isOnline: newStatus,
      isAvailable: newStatus,
    },
  });

  return updated;
};

// ─── Get Open Broadcast Orders (Ready for Rider) ──────────────────────────────

export const getOpenOrders = async () => {
  return prisma.order.findMany({
    where: {
      status: 'READY_FOR_RIDER',
      riderId: null,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      customer: { select: { name: true, phone: true } },
      address: true,
      items: {
        include: {
          product: {
            select: { name: true, images: true, unit: true, seller: { select: { sellerProfile: true, name: true } } },
          },
        },
      },
    },
  });
};

// ─── Accept Open Broadcast Order (Foodpanda First-Come Assignment) ─────────────

export const acceptOpenOrder = async (orderId: string, riderId: string) => {
  const riderUser = await prisma.user.findUnique({
    where: { id: riderId },
    include: { riderProfile: true },
  });
  if (!riderUser || !riderUser.riderProfile) throw new AppError('Rider not found.', 404);
  if (!riderUser.riderProfile.isOnline) throw new AppError('You must be ON DUTY to accept orders.', 400);

  // Atomic database update to prevent race conditions
  const updatedOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) throw new AppError('Order not found.', 404);
    if (order.status !== 'READY_FOR_RIDER' || order.riderId !== null) {
      throw new AppError('Order has already been accepted by another rider.', 409);
    }

    return tx.order.update({
      where: { id: orderId },
      data: {
        riderId,
        riderName: riderUser.name,
        status: 'RIDER_ASSIGNED',
      },
      include: {
        customer: { select: { id: true, name: true, phone: true } },
        address: true,
        items: {
          include: {
            product: { select: { name: true, sellerId: true } },
          },
        },
      },
    });
  });

  // Socket notification: Dismiss from all online riders
  emitToOnlineRiders('RIDER_ORDER_DISMISS', { orderId });

  // Notify customer & seller
  emitToUser(updatedOrder.customerId, 'ORDER_STATUS_UPDATED', {
    orderId,
    status: 'RIDER_ASSIGNED',
    riderName: riderUser.name,
    riderPhone: riderUser.phone,
  });

  const sellerId = updatedOrder.items[0]?.product?.sellerId;
  if (sellerId) {
    emitToSellerRoom(sellerId, 'ORDER_STATUS_UPDATED', { orderId, status: 'RIDER_ASSIGNED', riderName: riderUser.name });
  }

  emitToOrderRoom(orderId, 'ORDER_STATUS_UPDATED', { orderId, status: 'RIDER_ASSIGNED', order: updatedOrder });

  return updatedOrder;
};

// ─── Get Active Assigned Missions ─────────────────────────────────────────────

export const getActiveMissions = async (riderId: string) => {
  return prisma.order.findMany({
    where: {
      riderId,
      status: {
        in: ['RIDER_ASSIGNED', 'PICKUP_STARTED', 'PICKED_UP', 'ON_THE_WAY', 'ARRIVED'],
      },
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      customer: { select: { name: true, phone: true } },
      address: true,
      items: {
        include: {
          product: { select: { name: true, images: true, unit: true, seller: { select: { name: true, phone: true, sellerProfile: true } } } },
        },
      },
    },
  });
};

// ─── Update Sequential Delivery Mission Status ────────────────────────────────

export const updateMissionStatus = async (
  orderId: string,
  riderId: string,
  targetStatus: OrderStatus
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: { select: { sellerId: true } } } } },
  });

  if (!order) throw new AppError('Order not found.', 404);
  if (order.riderId !== riderId) throw new AppError('This mission is not assigned to you.', 403);

  const allowedTransitions: Record<string, OrderStatus[]> = {
    RIDER_ASSIGNED: ['PICKUP_STARTED', 'CANCELLED'],
    PICKUP_STARTED: ['PICKED_UP'],
    PICKED_UP: ['ON_THE_WAY'],
    ON_THE_WAY: ['ARRIVED'],
    ARRIVED: ['DELIVERED'],
  };

  const valid = allowedTransitions[order.status]?.includes(targetStatus);
  if (!valid) {
    throw new AppError(`Cannot transition order status from ${order.status} to ${targetStatus}.`, 400);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: targetStatus },
    include: {
      customer: { select: { id: true, name: true } },
      address: true,
    },
  });

  // On DELIVERY completed -> update rider stats & payment
  if (targetStatus === 'DELIVERED') {
    await prisma.riderProfile.update({
      where: { userId: riderId },
      data: {
        totalTrips: { increment: 1 },
        totalEarnings: { increment: order.deliveryFee || 50 },
      },
    });

    // Update payment status to PAID if CASH
    await prisma.payment.updateMany({
      where: { orderId },
      data: { status: 'PAID' },
    });
  }

  // Socket emissions to Customer, Seller, and Order Room
  emitToUser(order.customerId, 'ORDER_STATUS_UPDATED', { orderId, status: targetStatus });
  const sellerId = order.items[0]?.product?.sellerId;
  if (sellerId) {
    emitToSellerRoom(sellerId, 'ORDER_STATUS_UPDATED', { orderId, status: targetStatus });
  }
  emitToOrderRoom(orderId, 'ORDER_STATUS_UPDATED', { orderId, status: targetStatus, order: updatedOrder });

  return updatedOrder;
};

// ─── Get Today Stats ──────────────────────────────────────────────────────────

export const getTodayStats = async (riderId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [todayDeliveries, activeOrders, profile] = await Promise.all([
    prisma.order.count({
      where: { riderId, status: 'DELIVERED', updatedAt: { gte: startOfDay } },
    }),
    prisma.order.count({
      where: {
        riderId,
        status: { in: ['RIDER_ASSIGNED', 'PICKUP_STARTED', 'PICKED_UP', 'ON_THE_WAY', 'ARRIVED'] },
      },
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
    totalTrips: profile?.totalTrips ?? 0,
    totalEarnings: profile?.totalEarnings ?? 0,
    rating: profile?.rating ?? 5.0,
    isOnline: profile?.isOnline ?? false,
    isAvailable: profile?.isAvailable ?? true,
    vehicleType: profile?.vehicleType ?? 'Bicycle',
    vehicleNo: profile?.vehicleNo ?? '',
  };
};

// ─── Delivery History ─────────────────────────────────────────────────────────

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
        address: { select: { line1: true, area: true, city: true } },
      },
    }),
    prisma.order.count({ where: { riderId, status: 'DELIVERED' } }),
  ]);

  return { orders, total };
};
