import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Subcategory definitions for Cooking main category
const subcategoriesConfig = [
  {
    folder: 'chaldal_ghee_scrape',
    name: 'Ghee & Butter',
    slug: 'ghee-butter',
    icon: '🧈',
    description: 'Pure Ghee, Butter and Dairy Fats for Cooking'
  },
  {
    folder: 'chaldal_oil_scrape',
    name: 'Edible Oils',
    slug: 'edible-oils',
    icon: '🛢️',
    description: 'Soyabean Oil, Mustard Oil, Rice Bran Oil, Sunflower Oil and Olive Oil'
  },
  {
    folder: 'chaldal_spices_scrape',
    name: 'Spices & Masalas',
    slug: 'spices-masalas',
    icon: '🌶️',
    description: 'Whole and Ground Spices, Turmeric, Chilli, Cumin, Coriander and Garam Masala'
  },
  {
    folder: 'chaldal_dal_or_lentil_scrape',
    name: 'Dal & Pulses',
    slug: 'dal-pulses',
    icon: '🫘',
    description: 'Moong Dal, Musur Dal, Chana Dal, Anchor Dal and Pulses'
  },
  {
    folder: 'chaldal_rices_scrape',
    name: 'Rice & Grains',
    slug: 'rice-grains',
    icon: '🌾',
    description: 'Miniket, Nazirshail, Katari Bhog, Basmati, Chinigura and Brown Rice'
  },
  {
    folder: 'chaldal_salt_sugar_scrape',
    name: 'Salt & Sugar',
    slug: 'salt-sugar',
    icon: '🧂',
    description: 'Iodized Salt, White Sugar, Brown Sugar and Gur (Jaggery)'
  },
  {
    folder: 'chaldal_shemai_suji_scrape',
    name: 'Shemai, Suji & Flour',
    slug: 'shemai-suji-flour',
    icon: '🥣',
    description: 'Suji, Shemai, Lachha Shemai, Atta, Maida and Besan'
  },
  {
    folder: 'chaldal_ready_mix_scrape',
    name: 'Ready Mix Spices',
    slug: 'ready-mix-spices',
    icon: '📦',
    description: 'Biryani Mix, Roast Masala, Meat Masala, Fish Masala and Haleem Mix'
  },
  {
    folder: 'chaldal_colors_flavours_scrape',
    name: 'Food Colors & Flavors',
    slug: 'colors-flavors',
    icon: '🎨',
    description: 'Food Colors, Kewra Water, Rose Water, Vanilla Essence and Food Flavors'
  },
  {
    folder: 'chaldal_premium_ingredients_scrape',
    name: 'Premium Ingredients',
    slug: 'premium-ingredients',
    icon: '⭐',
    description: 'Premium Saffron, Nutmeg, Mace, Organic Herbs and Imported Cooking Essentials'
  },
  {
    folder: 'chaldal_miscellaneous_scrape',
    name: 'Miscellaneous Cooking',
    slug: 'miscellaneous-cooking',
    icon: '🥄',
    description: 'Baking Powder, Soda, Vinegar, Tamarind and Other Cooking Accessories'
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
  console.log('🚀 Starting Cooking Products Upload Process...');

  // 1. Get Seller user
  const seller = await prisma.user.findFirst({
    where: { role: 'SELLER' }
  }) || await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!seller) {
    throw new Error('No SELLER or ADMIN user found in database to assign products to.');
  }

  console.log(`👤 Using Seller User: ${seller.name} (${seller.id})`);

  // 2. Ensure Main Category 'Cooking' exists
  let mainCategory = await prisma.productCategory.findFirst({
    where: { slug: 'cooking' }
  });

  if (!mainCategory) {
    mainCategory = await prisma.productCategory.create({
      data: {
        name: 'Cooking',
        slug: 'cooking',
        icon: '🍳',
        description: 'Essential cooking ingredients, spices, oils, ghee, dal, rice and baking items.'
      }
    });
    console.log(`📁 Created Main Category: Cooking (${mainCategory.id})`);
  } else {
    console.log(`📁 Found Main Category: Cooking (${mainCategory.id})`);
  }

  const basePath = 'F:\\Product_listing-master\\cooking';
  let totalProductsAdded = 0;
  let totalProductsUpdated = 0;

  // 3. Loop through each subcategory configuration
  for (const config of subcategoriesConfig) {
    const csvPath = path.join(basePath, config.folder, 'products.csv');
    if (!fs.existsSync(csvPath)) {
      console.warn(`⚠️ File not found: ${csvPath}, skipping...`);
      continue;
    }

    // Ensure subcategory exists under main Cooking category
    let subCategory = await prisma.productCategory.findFirst({
      where: { slug: config.slug }
    });

    if (!subCategory) {
      subCategory = await prisma.productCategory.create({
        data: {
          name: config.name,
          slug: config.slug,
          icon: config.icon,
          description: config.description,
          parentId: mainCategory.id
        }
      });
      console.log(`   └─ Created Subcategory: ${config.name} (${subCategory.id})`);
    } else {
      // Update parentId to ensure it belongs to Cooking category
      if (subCategory.parentId !== mainCategory.id) {
        subCategory = await prisma.productCategory.update({
          where: { id: subCategory.id },
          data: { parentId: mainCategory.id }
        });
      }
      console.log(`   └─ Found Subcategory: ${config.name} (${subCategory.id})`);
    }

    // Read CSV file
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

    if (lines.length <= 1) {
      console.warn(`   └─ CSV ${config.folder}/products.csv is empty or has only header.`);
      continue;
    }

    const header = parseCsvLine(lines[0]);
    const nameIdx = header.indexOf('name');
    const priceIdx = header.indexOf('price');
    const imageIdx = header.indexOf('image_url');

    let categoryProductsCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.length < 2) continue;

      const name = cols[nameIdx >= 0 ? nameIdx : 0]?.trim();
      const rawPrice = cols[priceIdx >= 0 ? priceIdx : 1]?.trim();
      const imageUrl = cols[imageIdx >= 0 ? imageIdx : 3]?.trim() || '';

      if (!name) continue;

      const price = parseFloat(rawPrice) || 0;
      const { unit, unitAmount } = extractUnit(name);

      // Unique slug for product
      const baseSlug = slugify(name);
      // Try to find by slug first
      let product = await prisma.product.findFirst({
        where: { slug: baseSlug }
      });

      const images = imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80'];

      if (product) {
        await prisma.product.update({
          where: { id: product.id },
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
        totalProductsUpdated++;
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
            isFeatured: i <= 3 // Feature top 3 items per category
          }
        });
        totalProductsAdded++;
      }
      categoryProductsCount++;
    }

    console.log(`      ✓ Added/Updated ${categoryProductsCount} products in "${config.name}".`);
  }

  console.log(`\n🎉 Upload Completed Successfully!`);
  console.log(`   - New Products Added: ${totalProductsAdded}`);
  console.log(`   - Existing Products Updated: ${totalProductsUpdated}`);
  console.log(`   - Total Processed: ${totalProductsAdded + totalProductsUpdated}`);
}

main()
  .catch(e => {
    console.error('❌ Error uploading products:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
