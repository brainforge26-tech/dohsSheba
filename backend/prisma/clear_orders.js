const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning all orders from database...');
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  console.log('✅ ALL DEMO ORDERS DELETED FROM DATABASE!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
