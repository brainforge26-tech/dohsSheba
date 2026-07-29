import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error.middleware';

const cartInclude = {
  items: {
    include: {
      product: {
        select: {
          id: true, name: true, price: true, discount: true,
          images: true, unit: true, stock: true, isActive: true,
          seller: { select: { name: true } },
        },
      },
    },
  },
};

export const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({ where: { userId }, include: cartInclude });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId }, include: cartInclude });
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - (item.product.discount ?? 0) / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  return { ...cart, subtotal: Number(subtotal.toFixed(2)) };
};

export const addItemToCart = async (userId: string, productId: string, quantity: number) => {
  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true } });
  if (!product) throw new AppError('Product not found.', 404);
  if (product.stock < quantity) throw new AppError(`Only ${product.stock} items available.`, 400);

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    if (product.stock < newQty) throw new AppError(`Only ${product.stock} items available.`, 400);
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
  }
};

export const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart not found.', 404);

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) throw new AppError('Cart item not found.', 404);

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
    return null;
  }
  return prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
};

export const removeCartItem = async (userId: string, itemId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw new AppError('Cart not found.', 404);

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) throw new AppError('Cart item not found.', 404);

  await prisma.cartItem.delete({ where: { id: itemId } });
};

export const clearUserCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};
