import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';

export const getWallet = async (userId: string) => {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
    include: {
      transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: { userId, balance: 850 },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
  }

  if (wallet && wallet.transactions.length === 0) {
    await prisma.transaction.createMany({
      data: [
        {
          walletId: wallet.id,
          type: 'CREDIT',
          amount: 500,
          description: 'Wallet Refund Credit (Order #ORD-9910)',
        },
        {
          walletId: wallet.id,
          type: 'DEBIT',
          amount: 250,
          description: 'Marketplace Payment (Order #ORD-9945)',
        },
        {
          walletId: wallet.id,
          type: 'CREDIT',
          amount: 600,
          description: 'Resident Referral Cash Reward',
        },
      ],
    });

    wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
  }

  return wallet;
};

export const getTransactions = async (userId: string, page: number, limit: number) => {
  const skip   = (page - 1) * limit;
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError('Wallet not found.', 404);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where:   { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      skip, take: limit,
    }),
    prisma.transaction.count({ where: { walletId: wallet.id } }),
  ]);
  return { transactions, total };
};

export const creditWallet = async (userId: string, amount: number, description: string, reference?: string) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError('Wallet not found.', 404);

  const [updatedWallet] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data:  { balance: { increment: amount } },
    }),
    prisma.transaction.create({
      data: {
        walletId:    wallet.id,
        type:        'CREDIT',
        amount,
        description,
      },
    }),
  ]);
  return updatedWallet;
};

export const debitWallet = async (userId: string, amount: number, description: string) => {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new AppError('Wallet not found.', 404);
  if (wallet.balance < amount) throw new AppError('Insufficient wallet balance.', 400);

  const [updatedWallet] = await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data:  { balance: { decrement: amount } },
    }),
    prisma.transaction.create({
      data: {
        walletId:    wallet.id,
        type:        'DEBIT',
        amount,
        description,
      },
    }),
  ]);
  return updatedWallet;
};
