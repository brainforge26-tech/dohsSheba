import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';
import { BookingStatus } from '@prisma/client';

const bookingInclude = {
  service: {
    select: {
      id: true, title: true, price: true, images: true, priceUnit: true,
      provider: { select: { id: true, name: true, avatar: true, phone: true } },
    },
  },
  address: true,
  payment:  true,
};

// ─── Get Bookings ─────────────────────────────────────────────────────────────

export const getBookings = async (
  userId: string,
  role: string,
  filters: { page: number; limit: number; status?: string }
) => {
  const { page, limit, status } = filters;
  const skip = (page - 1) * limit;

  let where: any = {};
  if (role === 'CUSTOMER') where.customerId = userId;
  if (role === 'PROVIDER') where.service = { providerId: userId };
  if (status) where.status = status;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return { bookings, total };
};

// ─── Get Single Booking ───────────────────────────────────────────────────────

export const getBookingById = async (bookingId: string, userId: string, role: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      ...bookingInclude,
      review: { include: { user: { select: { name: true, avatar: true } } } },
    },
  });

  if (!booking) throw new AppError('Booking not found.', 404);

  // Access check for non-admins
  if (role !== 'ADMIN') {
    const isCustomer  = role === 'CUSTOMER' && booking.customerId === userId;
    const isProvider  = role === 'PROVIDER' && booking.service.provider.id === userId;
    if (!isCustomer && !isProvider) throw new AppError('Access denied.', 403);
  }

  return booking;
};

// ─── Create Booking ───────────────────────────────────────────────────────────

export const createBooking = async (
  customerId: string,
  data: { serviceId: string; addressId: string; scheduledAt: string; notes?: string }
) => {
  const [service, address] = await Promise.all([
    prisma.service.findFirst({ where: { id: data.serviceId, isActive: true } }),
    prisma.address.findFirst({ where: { id: data.addressId, userId: customerId } }),
  ]);

  if (!service)  throw new AppError('Service not found.', 404);
  if (!address)  throw new AppError('Address not found.', 404);

  const booking = await prisma.booking.create({
    data: {
      customerId,
      serviceId:   data.serviceId,
      addressId:   data.addressId,
      scheduledAt: new Date(data.scheduledAt),
      totalAmount: service.price,
      notes:       data.notes,
      status:      'PENDING',
    },
    include: bookingInclude,
  });

  // Create notification for provider
  await prisma.notification.create({
    data: {
      userId:  service.providerId,
      title:   'New Booking Request',
      message: `You have a new booking for "${service.title}"`,
      type:    'INFO',
      link:    `/provider/dashboard/bookings/${booking.id}`,
    },
  });

  return booking;
};

// ─── Update Booking Status ────────────────────────────────────────────────────

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  userId: string,
  role: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: { select: { providerId: true, title: true } } },
  });
  if (!booking) throw new AppError('Booking not found.', 404);

  // Only provider or admin can update status
  if (role === 'PROVIDER' && booking.service.providerId !== userId) {
    throw new AppError('Access denied.', 403);
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data:  { status },
    include: bookingInclude,
  });

  // Notify customer
  await prisma.notification.create({
    data: {
      userId:  booking.customerId,
      title:   'Booking Status Updated',
      message: `Your booking for "${booking.service.title}" is now ${status}`,
      type:    status === 'COMPLETED' ? 'SUCCESS' : 'INFO',
      link:    `/dashboard/bookings/${bookingId}`,
    },
  });

  return updated;
};

// ─── Cancel Booking ───────────────────────────────────────────────────────────

export const cancelBooking = async (bookingId: string, customerId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
  });
  if (!booking) throw new AppError('Booking not found.', 404);

  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
    throw new AppError('This booking cannot be cancelled.', 400);
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data:  { status: 'CANCELLED' },
  });
};
