const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing all demo data from database...\n');

  // Delete transactional & user operational data in proper dependency order
  console.log('  → Deleting Order Items...');
  await prisma.orderItem.deleteMany();

  console.log('  → Deleting Payments...');
  await prisma.payment.deleteMany();

  console.log('  → Deleting Orders...');
  await prisma.order.deleteMany();

  console.log('  → Deleting Bookings...');
  await prisma.booking.deleteMany();

  console.log('  → Deleting Reviews...');
  await prisma.review.deleteMany();

  console.log('  → Deleting Cart Items...');
  await prisma.cartItem.deleteMany();

  console.log('  → Deleting Carts...');
  await prisma.cart.deleteMany();

  console.log('  → Deleting Wishlist Items...');
  await prisma.wishlistItem.deleteMany();

  console.log('  → Deleting Wishlists...');
  await prisma.wishlist.deleteMany();

  console.log('  → Deleting Notifications...');
  await prisma.notification.deleteMany();

  console.log('  → Deleting Transactions...');
  await prisma.transaction.deleteMany();

  console.log('  → Deleting Wallets...');
  await prisma.wallet.deleteMany();

  console.log('\n✅ ALL DEMO DATA SUCCESSFULLY CLEARED FROM DATABASE!\n');
}

main()
  .catch((err) => {
    console.error('❌ Error clearing demo data:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
