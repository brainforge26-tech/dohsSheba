import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { OrderStatus } from '@prisma/client';

const orderInclude = {
  address: true,
  items: {
    include: {
      product: { select: { id: true, name: true, images: true, unit: true } },
    },
  },
  payment: true,
};

// ─── Get Orders ───────────────────────────────────────────────────────────────

export const getOrders = async (
  userId: string, role: string,
  filters: { page: number; limit: number; status?: string }
) => {
  const { page, limit, status } = filters;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (role === 'CUSTOMER') where.customerId = userId;
  if (role === 'SELLER')   where.items = { some: { product: { sellerId: userId } } };
  if (status && Object.values(OrderStatus).includes(status as any)) {
    where.status = status as OrderStatus;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: orderInclude, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.order.count({ where }),
  ]);
  return { orders, total };
};

// ─── Get Single Order ─────────────────────────────────────────────────────────

export const getOrderById = async (orderId: string, userId: string, role: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: orderInclude });
  if (!order) throw new AppError('Order not found.', 404);
  if (role === 'CUSTOMER' && order.customerId !== userId) throw new AppError('Access denied.', 403);
  return order;
};

// ─── Create Order from Cart ───────────────────────────────────────────────────

export const createOrderFromCart = async (
  customerId: string,
  data: {
    addressId: string;
    items: { productId: string; quantity: number }[];
    couponCode?: string;
    notes?: string;
  }
) => {
  const address = await prisma.address.findFirst({ where: { id: data.addressId, userId: customerId } });
  if (!address) throw new AppError('Address not found.', 404);

  // Fetch products & validate stock
  const productIds = data.items.map((i) => i.productId);
  const products   = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });
  if (products.length !== productIds.length) throw new AppError('One or more products not found.', 404);

  const orderItems = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) throw new AppError(`Insufficient stock for "${product.name}".`, 400);
    const price = product.price * (1 - (product.discount ?? 0) / 100);
    return { productId: item.productId, quantity: item.quantity, price };
  });

  const subtotal    = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 50;
  let discount      = 0;

  if (data.couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: { code: data.couponCode, isActive: true, expiresAt: { gt: new Date() } },
    });
    if (coupon) {
      discount = coupon.discountType === 'PERCENTAGE'
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }
  }

  const totalAmount = subtotal + deliveryFee - discount;

  const order = await prisma.$transaction(async (tx) => {
    // Reduce stock
    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data:  { stock: { decrement: item.quantity } },
      });
    }

    const newOrder = await tx.order.create({
      data: {
        customerId,
        addressId: data.addressId,
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        notes: data.notes,
        items: { create: orderItems },
      },
      include: orderInclude,
    });

    // Clear cart
    const cart = await tx.cart.findUnique({ where: { userId: customerId } });
    if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id, productId: { in: productIds } } });

    return newOrder;
  });

  // Notify customer
  await prisma.notification.create({
    data: {
      userId: customerId,
      title:   'Order Placed Successfully',
      message: `Your order has been placed. Total: ৳${totalAmount.toFixed(0)}`,
      type:    'SUCCESS',
      link:    `/dashboard/orders/${order.id}`,
    },
  });

  return order;
};

// ─── Update Order Status ──────────────────────────────────────────────────────

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new AppError('Order not found.', 404);

  const updated = await prisma.order.update({ where: { id: orderId }, data: { status } });

  await prisma.notification.create({
    data: {
      userId:  order.customerId,
      title:   'Order Status Updated',
      message: `Your order is now ${status}`,
      type:    status === 'DELIVERED' ? 'SUCCESS' : 'INFO',
      link:    `/dashboard/orders/${orderId}`,
    },
  });

  return updated;
};

// ─── Cancel Order ─────────────────────────────────────────────────────────────

export const cancelOrder = async (orderId: string, customerId: string) => {
  const order = await prisma.order.findFirst({ where: { id: orderId, customerId } });
  if (!order) throw new AppError('Order not found.', 404);
  if (!['PENDING', 'PROCESSING'].includes(order.status)) {
    throw new AppError('Order cannot be cancelled at this stage.', 400);
  }
  return prisma.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
};
