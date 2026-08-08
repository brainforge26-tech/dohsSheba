import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    take: 10,
    select: { id: true, name: true, isActive: true, categoryId: true, category: { select: { name: true, slug: true, isActive: true } } }
  });
  console.log('Sample products:', JSON.stringify(products, null, 2));

  const totalProducts = await prisma.product.count();
  const activeProducts = await prisma.product.count({ where: { isActive: true } });
  console.log(`Total Products: ${totalProducts} | Active Products: ${activeProducts}`);

  const subcats = await prisma.productCategory.findMany({
    where: { parentId: { not: null } },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      _count: {
        select: {
          products: true
        }
      }
    }
  });
  console.log('Subcats with counts:', JSON.stringify(subcats, null, 2));
}

main().finally(() => prisma.$disconnect());
