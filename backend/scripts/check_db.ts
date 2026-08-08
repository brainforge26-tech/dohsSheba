import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allCats = await prisma.productCategory.findMany({
    include: { parent: true, children: true }
  });
  console.log('All Categories:');
  for (const c of allCats) {
    console.log(`- [${c.id}] ${c.name} (slug: ${c.slug}), parentId: ${c.parentId ? c.parent?.name : 'NONE'}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
