import { prisma } from '../../lib/prisma';

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  const [
    totalUsers, totalProviders, totalSellers,
    totalServices, totalProducts,
    totalBookings, totalOrders,
    pendingBookings, pendingOrders,
    recentOrders, recentBookings,
    pendingProviders,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.user.count({ where: { role: 'PROVIDER' } }),
    prisma.user.count({ where: { role: 'SELLER' } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.booking.count(),
    prisma.order.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true, email: true } },
        items: { include: { product: true } },
      },
    }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { name: true } },
        service:  { select: { title: true, price: true } },
      },
    }),
    prisma.providerProfile.findMany({
      where: { isVerified: false },
      include: { user: { select: { id: true, name: true, phone: true, email: true } } },
      take: 10,
    }),
  ]);

  // Revenue calculations directly from database
  const orderRevenue   = await prisma.order.aggregate({ _sum: { totalAmount: true } });
  const bookingRevenue = await prisma.booking.aggregate({ _sum: { totalAmount: true } });
  const totalRev = (orderRevenue._sum.totalAmount ?? 0) + (bookingRevenue._sum.totalAmount ?? 0);

  // Targets & Chart breakdowns dynamically calculated from DB
  const ordersTargetPct = Math.min(100, Math.round((totalOrders / 80) * 100));
  const usersTargetPct  = Math.min(100, Math.round((totalUsers / 170) * 100));

  // Bar Chart Data dynamically scaled from DB orders and bookings
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quickSummaryChart = months.map((m, idx) => {
    const monthOrders = recentOrders.filter((o) => new Date(o.createdAt).getMonth() === idx).length;
    const monthBookings = recentBookings.filter((b) => new Date(b.createdAt).getMonth() === idx).length;
    return {
      month: m,
      top: monthOrders * 5,
      bottom: monthBookings * 5,
    };
  });

  const pendingQueue = pendingProviders.map((p) => ({
    id: p.userId,
    name: p.user.name,
    category: p.bio || 'Home Services Provider',
    applicant: p.user.name,
    phone: p.user.phone || 'N/A',
    nid: p.nid || 'N/A',
  }));

  return {
    stats: {
      totalUsers,
      totalProviders,
      totalSellers,
      totalServices,
      totalProducts,
      totalBookings,
      totalOrders,
      pendingBookings,
      pendingOrders,
      totalRevenue: totalRev,
      earningAmount: Math.round(totalRev * 0.15),
      toPaidAmount: Math.round(totalRev * 0.85),
      onlineVisitors: 1,
      ordersTargetPct,
      usersTargetPct,
    },
    quickSummaryChart,
    recentOrders,
    recentBookings,
    pendingQueue,
  };
};

// ─── Users Management ─────────────────────────────────────────────────────────

export const getAllUsers = async (page: number, limit: number, role?: string, search?: string) => {
  const skip  = (page - 1) * limit;
  const where: any = {};
  if (role)   where.role = role;
  if (search) {
    where.OR = [
      { name:  { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, isActive: true, createdAt: true,
        _count: { select: { orders: true, bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

export const toggleUserStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  return prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
};

export const updateUserRole = async (userId: string, role: string) => {
  return prisma.user.update({ where: { id: userId }, data: { role: role as any } });
};

export const approvePartner = async (userId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: 'PROVIDER', isActive: true },
  });
  await prisma.providerProfile.upsert({
    where: { userId },
    update: { isVerified: true },
    create: { userId, isVerified: true, experience: 3, nid: '1992269412984' },
  }).catch(() => null);
  return user;
};

// ─── Banner Management ────────────────────────────────────────────────────────

export const getBanners = async () => {
  return prisma.banner.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
};

export const createBanner = async (data: object) => {
  return prisma.banner.create({ data: data as any });
};

export const updateBanner = async (id: string, data: object) => {
  return prisma.banner.update({ where: { id }, data: data as any });
};

export const deleteBanner = async (id: string) => {
  return prisma.banner.update({ where: { id }, data: { isActive: false } });
};

// ─── Coupon Management ────────────────────────────────────────────────────────

export const getCoupons = async () => {
  return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
};

export const createCoupon = async (data: object) => {
  return prisma.coupon.create({ data: data as any });
};

export const updateCoupon = async (id: string, data: object) => {
  return prisma.coupon.update({ where: { id }, data: data as any });
};

export const deleteCoupon = async (id: string) => {
  return prisma.coupon.delete({ where: { id } });
};

// ─── Rider Dispatch Management ────────────────────────────────────────────────

export const getAvailableRiders = async () => {
  return prisma.user.findMany({
    where: {
      role: 'RIDER',
      isActive: true,
      riderProfile: { isAvailable: true },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      riderProfile: {
        select: {
          vehicleType: true,
          vehicleNo: true,
          totalTrips: true,
          rating: true,
          isAvailable: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
};

export const getAllRiders = async () => {
  return prisma.user.findMany({
    where: { role: 'RIDER', isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      riderProfile: {
        select: {
          vehicleType: true,
          vehicleNo: true,
          totalTrips: true,
          totalEarnings: true,
          rating: true,
          isAvailable: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
};

export const getAdminOrders = async (
  page = 1,
  limit = 20,
  status?: string,
) => {
  const skip = (page - 1) * limit;
  const where: any = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, name: true, email: true, phone: true } },
        address:  true,
        rider:    { select: { id: true, name: true, phone: true } },
        items: {
          include: {
            product: { select: { name: true, images: true } },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);
  return { orders, total };
};

export const assignRiderToOrder = async (orderId: string, riderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found.');
  if (!['PENDING', 'PROCESSING'].includes(order.status)) {
    throw new Error(`Cannot assign rider to order with status ${order.status}.`);
  }

  const rider = await prisma.user.findUnique({
    where: { id: riderId },
    select: { id: true, name: true, role: true },
  });
  if (!rider || rider.role !== 'RIDER') throw new Error('Invalid rider selected.');

  return prisma.order.update({
    where: { id: orderId },
    data: {
      riderId,
      riderName: rider.name,
      status: 'RIDER_ASSIGNED',
    },
    include: {
      customer: { select: { name: true } },
      rider:    { select: { name: true, phone: true } },
    },
  });
};

export const unassignRider = async (orderId: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found.');

  return prisma.order.update({
    where: { id: orderId },
    data: { riderId: null, riderName: null, status: 'PENDING' },
  });
};
