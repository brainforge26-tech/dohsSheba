import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exactSubcategoriesConfig = [
  {
    folder: 'chaldal_colors_flavours_scrape',
    name: 'Colors & Flavours',
    slug: 'colors-flavours',
    icon: '🎨',
    image: 'https://chaldn.com/_mpimage/foster-clark-food-color-red-28-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D129377&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_dal_or_lentil_scrape',
    name: 'Dal or Lentil',
    slug: 'dal-or-lentil',
    icon: '🫘',
    image: 'https://chaldn.com/_mpimage/teer-red-lentil-deshi-musur-dal-500-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_ghee_scrape',
    name: 'Ghee',
    slug: 'ghee',
    icon: '🧈',
    image: 'https://chaldn.com/_mpimage/aarong-dairy-pure-ghee-200-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D26926&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_oil_scrape',
    name: 'Oil',
    slug: 'oil',
    icon: '🛢️',
    image: 'https://chaldn.com/_mpimage/rupchanda-fortified-soyabean-oil-5-ltr?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D133985&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_premium_ingredients_scrape',
    name: 'Premium Ingredients',
    slug: 'premium-ingredients',
    icon: '⭐',
    image: 'https://chaldn.com/_mpimage/golden-grain-poppy-seed-posto-dana-50-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D187931&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_ready_mix_scrape',
    name: 'Ready Mix',
    slug: 'ready-mix',
    icon: '📦',
    image: 'https://chaldn.com/_mpimage/radhuni-ready-beef-masala-20-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D129377&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_rices_scrape',
    name: 'Rice',
    slug: 'rice',
    icon: '🌾',
    image: 'https://chaldn.com/_mpimage/aci-aroma-chinigura-rice-1-kg?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_salt_sugar_scrape',
    name: 'Salt & Sugar',
    slug: 'salt-sugar',
    icon: '🧂',
    image: 'https://chaldn.com/_mpimage/aci-pure-refined-sugar-1-kg?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_shemai_suji_scrape',
    name: 'Shemai & Suji',
    slug: 'shemai-suji',
    icon: '🥣',
    image: 'https://chaldn.com/_mpimage/radhuni-vermicelli-shemai-200-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_miscellaneous_scrape',
    name: 'Special Ingredients & Miscellaneous',
    slug: 'special-ingredients-miscellaneous',
    icon: '🥄',
    image: 'https://chaldn.com/_mpimage/foster-clark-baking-powder-100-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_spices_scrape',
    name: 'Spices',
    slug: 'spices',
    icon: '🌶️',
    image: 'https://chaldn.com/_mpimage/radhuni-chilli-powder-200-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  }
];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function extractUnit(name: string): { unit: string; unitAmount?: number } {
  const match = name.match(/(\d+(?:\.\d+)?)\s*(gm|g|kg|ml|ltr|l|pcs|pc|pack|pt)/i);
  if (match) {
    const amount = parseFloat(match[1]);
    const rawUnit = match[2].toLowerCase();
    let unitStr = `${amount} ${rawUnit}`;
    if (rawUnit === 'gm' || rawUnit === 'g') unitStr = `${amount} g`;
    if (rawUnit === 'kg') unitStr = `${amount} kg`;
    if (rawUnit === 'ml') unitStr = `${amount} ml`;
    if (rawUnit === 'ltr' || rawUnit === 'l') unitStr = `${amount} L`;
    return { unit: unitStr, unitAmount: amount };
  }
  return { unit: '1 pcs', unitAmount: 1 };
}

async function main() {
  console.log('🔄 Re-aligning Cooking subcategories with exact names...');

  // 1. Get Seller user
  const seller = await prisma.user.findFirst({
    where: { role: 'SELLER' }
  }) || await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!seller) {
    throw new Error('No SELLER or ADMIN user found in database.');
  }

  // 2. Main Category 'Cooking'
  let mainCooking = await prisma.productCategory.findFirst({
    where: { slug: 'cooking' }
  });

  if (!mainCooking) {
    mainCooking = await prisma.productCategory.create({
      data: {
        name: 'Cooking',
        slug: 'cooking',
        icon: '🍳',
        description: 'Essential cooking ingredients, spices, oils, ghee, dal, rice and baking items.'
      }
    });
  }

  const basePath = 'F:\\Product_listing-master\\cooking';
  const targetSubcatIds: string[] = [];

  // 3. Process each of the 11 exact subcategories
  for (const config of exactSubcategoriesConfig) {
    const csvPath = path.join(basePath, config.folder, 'products.csv');
    if (!fs.existsSync(csvPath)) {
      console.warn(`⚠️ File not found: ${csvPath}, skipping...`);
      continue;
    }

    // Try to find existing subcategory by slug or by name under Cooking
    let subCategory = await prisma.productCategory.findFirst({
      where: {
        OR: [
          { slug: config.slug },
          { name: config.name, parentId: mainCooking.id },
          // also check alternate names like 'Special Ingredients..'
          config.name.startsWith('Special Ingredients') ? { name: { startsWith: 'Special Ingredients' } } : {}
        ]
      }
    });

    if (!subCategory) {
      subCategory = await prisma.productCategory.create({
        data: {
          name: config.name,
          slug: config.slug,
          icon: config.icon,
          image: config.image,
          parentId: mainCooking.id
        }
      });
      console.log(`✨ Created exact Subcategory: "${config.name}" (${subCategory.id})`);
    } else {
      // Update name, slug, image and parentId to match exact target configuration
      subCategory = await prisma.productCategory.update({
        where: { id: subCategory.id },
        data: {
          name: config.name,
          slug: config.slug,
          image: subCategory.image || config.image,
          icon: config.icon,
          parentId: mainCooking.id
        }
      });
      console.log(`✅ Updated Subcategory: "${subCategory.name}" (${subCategory.id})`);
    }

    targetSubcatIds.push(subCategory.id);

    // Read CSV & assign products
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length <= 1) continue;

    const header = parseCsvLine(lines[0]);
    const nameIdx = header.indexOf('name');
    const priceIdx = header.indexOf('price');
    const imageIdx = header.indexOf('image_url');

    let count = 0;
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.length < 2) continue;

      const name = cols[nameIdx >= 0 ? nameIdx : 0]?.trim();
      const rawPrice = cols[priceIdx >= 0 ? priceIdx : 1]?.trim();
      const imageUrl = cols[imageIdx >= 0 ? imageIdx : 3]?.trim() || '';

      if (!name) continue;

      const price = parseFloat(rawPrice) || 0;
      const { unit, unitAmount } = extractUnit(name);
      const baseSlug = slugify(name);

      const images = imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80'];

      const existingProd = await prisma.product.findFirst({
        where: { slug: baseSlug }
      });

      if (existingProd) {
        await prisma.product.update({
          where: { id: existingProd.id },
          data: {
            name,
            categoryId: subCategory.id,
            sellerId: seller.id,
            price,
            images,
            unit,
            unitAmount,
            stock: 100,
            isActive: true
          }
        });
      } else {
        await prisma.product.create({
          data: {
            name,
            slug: baseSlug,
            description: `${name} - Pure and premium quality cooking ingredient available for express delivery in Savar DOHS.`,
            categoryId: subCategory.id,
            sellerId: seller.id,
            price,
            images,
            unit,
            unitAmount,
            stock: 100,
            isActive: true,
            isFeatured: i <= 3
          }
        });
      }
      count++;
    }
    console.log(`   └─ Attached ${count} products to "${subCategory.name}".`);
  }

  // 4. Delete or clean up leftover duplicate subcategories under Cooking that are NOT in targetSubcatIds
  const leftoverSubcats = await prisma.productCategory.findMany({
    where: {
      parentId: mainCooking.id,
      id: { notIn: targetSubcatIds }
    },
    include: { products: true }
  });

  console.log(`\n🧹 Cleaning up ${leftoverSubcats.length} leftover subcategories...`);
  for (const sub of leftoverSubcats) {
    if (sub.products.length > 0) {
      // Find default target subcat (or Oil / Spices)
      const fallbackTarget = targetSubcatIds[0];
      console.log(`   Re-linking ${sub.products.length} products from leftover subcat "${sub.name}" to primary subcategory...`);
      await prisma.product.updateMany({
        where: { categoryId: sub.id },
        data: { categoryId: fallbackTarget }
      });
    }
    await prisma.productCategory.delete({
      where: { id: sub.id }
    });
    console.log(`   🗑️ Deleted leftover subcategory: "${sub.name}" (${sub.slug})`);
  }

  // 5. Deactivate or clean up empty top-level category 'Cooking Oil & Ghee' if present
  const emptyCookingOilGhee = await prisma.productCategory.findFirst({
    where: { slug: 'cooking-oil-ghee' },
    include: { _count: { select: { products: true, children: true } } }
  });

  if (emptyCookingOilGhee) {
    if (emptyCookingOilGhee._count.products === 0 && emptyCookingOilGhee._count.children === 0) {
      await prisma.productCategory.delete({
        where: { id: emptyCookingOilGhee.id }
      });
      console.log('🗑️ Deleted empty top-level category: Cooking Oil & Ghee');
    } else {
      await prisma.productCategory.update({
        where: { id: emptyCookingOilGhee.id },
        data: { isActive: false }
      });
      console.log('🙈 Deactivated empty top-level category: Cooking Oil & Ghee');
    }
  }

  console.log('\n🎉 ALL 11 Cooking Subcategories and Products aligned perfectly!');
}

main()
  .catch(e => {
    console.error('❌ Error during re-alignment:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
