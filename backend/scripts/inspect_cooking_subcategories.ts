import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cookingMain = await prisma.productCategory.findFirst({
    where: { slug: 'cooking' },
    include: {
      children: {
        include: {
          products: true
        }
      }
    }
  });

  console.log('Main Category:', cookingMain?.name, cookingMain?.id);
  console.log('Subcategories under Cooking:');
  for (const child of cookingMain?.children || []) {
    console.log(`- ID: ${child.id} | Name: "${child.name}" | Slug: "${child.slug}" | Product Count: ${child.products.length}`);
  }

  // Also check if there are other subcategories or orphaned categories
  const allSubcats = await prisma.productCategory.findMany({
    where: { parentId: { not: null } },
    include: { parent: true, _count: { select: { products: true } } }
  });
  console.log('\nAll Subcategories in DB:');
  for (const s of allSubcats) {
    console.log(`- Parent: "${s.parent?.name}" (${s.parentId}) | Subcat: "${s.name}" (${s.slug}) | ID: ${s.id} | Products: ${s._count.products}`);
  }
}

main().finally(() => prisma.$disconnect());
