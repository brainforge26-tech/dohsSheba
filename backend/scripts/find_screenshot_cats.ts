import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.productCategory.findMany({
    where: {
      name: {
        in: [
          'Colors & Flavours', 'Dal or Lentil', 'Ghee', 'Oil',
          'Premium Ingredients', 'Ready Mix', 'Rice', 'Salt & Sugar',
          'Shemai & Suji', 'Special Ingredients', 'Spices'
        ]
      }
    },
    include: {
      parent: true,
      _count: { select: { products: true } }
    }
  });

  console.log('Found categories by exact names:', JSON.stringify(categories, null, 2));
}

main().finally(() => prisma.$disconnect());
