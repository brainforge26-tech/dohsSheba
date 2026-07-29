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

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      phone: input.phone,
      role: input.role ?? 'CUSTOMER',
    },
    select: {
      id: true, name: true, email: true,
      phone: true, role: true, avatar: true, createdAt: true,
    },
  });

  // Auto-create wallet for new users
  await prisma.wallet.create({ data: { userId: user.id } });

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  return { user, tokens: { accessToken, refreshToken } };
};

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new AppError('Invalid email or password.', 401);
  if (!user.isActive) throw new AppError('Account is deactivated. Contact support.', 403);

  const isValid = await comparePassword(input.password, user.password);
  if (!isValid) throw new AppError('Invalid email or password.', 401);

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

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
    },
  });

  if (!user) throw new AppError('User not found.', 404);
  return user;
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshUserToken = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) throw new AppError('Invalid refresh token.', 401);

  const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
  return { accessToken };
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
};
