import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/auth.util';
import { Role } from '@prisma/client';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Register ────────────────────────────────────────────────────────────────

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError('Email is already in use.', 409);

  const hashedPassword = await hashPassword(input.password);
  const userRole = input.role ?? 'CUSTOMER';

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      role: userRole,
    },
    select: {
      id: true, name: true, email: true,
      phone: true, role: true, avatar: true, createdAt: true,
    },
  });

  // Auto-create wallet
  await prisma.wallet.create({ data: { userId: user.id } });

  // Role profile initialization
  if (userRole === 'RIDER') {
    await prisma.riderProfile.create({
      data: { userId: user.id, isOnline: false, isAvailable: true },
    });
  } else if (userRole === 'SELLER') {
    await prisma.sellerProfile.create({
      data: { userId: user.id, shopName: `${user.name}'s Shop` },
    });
  } else if (userRole === 'PROVIDER') {
    await prisma.providerProfile.create({
      data: { userId: user.id },
    });
  }

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  // Store refresh token in DB
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  return { user, tokens: { accessToken, refreshToken } };
};

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: {
      sellerProfile: true,
      riderProfile: true,
      providerProfile: true,
    },
  });
  if (!user) throw new AppError('Invalid email or password.', 401);
  if (!user.isActive) throw new AppError('Account is deactivated. Contact support.', 403);

  const isValid = await comparePassword(input.password, user.password);
  if (!isValid) throw new AppError('Invalid email or password.', 401);

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  // Save Refresh Token in DB
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, tokens: { accessToken, refreshToken } };
};

// ─── Get Current User ─────────────────────────────────────────────────────────

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, name: true, email: true, phone: true,
      role: true, avatar: true, emailVerified: true,
      isActive: true, createdAt: true,
      wallet: { select: { balance: true } },
      providerProfile: true,
      sellerProfile: true,
      riderProfile: true,
    },
  });

  if (!user) throw new AppError('User not found.', 404);
  return user;
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshUserToken = async (token: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  const user = storedToken.user;
  if (!user || !user.isActive) throw new AppError('Account deactivated or not found.', 401);

  // Rotate Refresh Token
  const newAccessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user.id });
  const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Delete old & create new in atomic transaction
  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { id: storedToken.id } }),
    prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: user.id, expiresAt: newExpiresAt },
    }),
  ]);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ─── Invalidate Refresh Token (Logout) ───────────────────────────────────────

export const logoutUserToken = async (token?: string) => {
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token } }).catch(() => {});
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────

export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found.', 404);

  const isValid = await comparePassword(currentPassword, user.password);
  if (!isValid) throw new AppError('Current password is incorrect.', 400);

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  // Invalidate all active sessions for security
  await prisma.refreshToken.deleteMany({ where: { userId } });
};
