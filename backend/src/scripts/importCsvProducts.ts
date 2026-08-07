import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const csvPath = `C:\\Users\\Hp ZBooK 15U G6\\Downloads\\products (2).csv`;
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  console.log(`📖 Reading CSV file from: ${csvPath}`);
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n').filter((l) => l.trim());

  // 1. Get or create a default Seller user
  let seller = await prisma.user.findFirst({
    where: { role: 'SELLER' },
  });

  if (!seller) {
    seller = await prisma.user.findFirst({
      where: { role: { in: ['SUPER_ADMIN', 'ADMIN'] } },
    });
  }

  if (!seller) {
    console.error('No seller or admin user found in database.');
    process.exit(1);
  }

  console.log(`👤 Using Seller/Vendor: ${seller.name} (ID: ${seller.id})`);

  // 2. Get or Create Main Category: "Cooking Oil & Ghee" (or "Oil & Edibles")
  const mainCatName = 'Cooking Oil & Ghee';
  const mainCatSlug = generateSlug(mainCatName);

  let mainCategory = await prisma.productCategory.findUnique({
    where: { slug: mainCatSlug },
  });

  if (!mainCategory) {
    mainCategory = await prisma.productCategory.create({
      data: {
        name: mainCatName,
        slug: mainCatSlug,
        description: 'Premium Cooking Oil, Mustard Oil, Olive Oil & Edible Oils',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
      },
    });
    console.log(`✅ Created Main Category: ${mainCategory.name}`);
  } else {
    console.log(`ℹ️ Found Existing Main Category: ${mainCategory.name}`);
  }

  // Subcategories mapping
  const subCats = [
    'Mustard Oil',
    'Soyabean Oil',
    'Olive Oil',
    'Rice Bran Oil',
    'Sunflower Oil',
    'Coconut Oil',
    'Other Oils',
  ];

  const subCatMap: Record<string, any> = {};

  for (const subName of subCats) {
    const subSlug = generateSlug(`${mainCatName}-${subName}`);
    let subCategory = await prisma.productCategory.findUnique({
      where: { slug: subSlug },
    });

    if (!subCategory) {
      subCategory = await prisma.productCategory.create({
        data: {
          name: subName,
          slug: subSlug,
          description: `${subName} for daily cooking`,
          parentId: mainCategory.id,
        },
      });
      console.log(`   └─ Created Subcategory: ${subCategory.name}`);
    }
    subCatMap[subName] = subCategory;
  }

  // Parse CSV records
  let createdCount = 0;
  let skippedCount = 0;

  // Header line 0: name,price,currency,image_url,image_location
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser supporting quotes
    const parts: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    parts.push(cur.trim());

    const name = parts[0]?.replace(/^"|"$/g, '');
    const priceStr = parts[1];
    const imageUrl = parts[3]?.replace(/^"|"$/g, '');

    if (!name || !priceStr) {
      // Row like "Oil,," header or empty price
      console.log(`Skipping header/empty row ${i}: "${name}"`);
      skippedCount++;
      continue;
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      console.log(`Skipping invalid price row ${i}: "${name}" price="${priceStr}"`);
      skippedCount++;
      continue;
    }

    // Determine subcategory based on product name keywords
    let targetSubCat = subCatMap['Other Oils'];
    const lowerName = name.toLowerCase();

    if (lowerName.includes('mustard')) {
      targetSubCat = subCatMap['Mustard Oil'];
    } else if (lowerName.includes('soyabean') || lowerName.includes('soybean')) {
      targetSubCat = subCatMap['Soyabean Oil'];
    } else if (lowerName.includes('olive')) {
      targetSubCat = subCatMap['Olive Oil'];
    } else if (lowerName.includes('rice bran')) {
      targetSubCat = subCatMap['Rice Bran Oil'];
    } else if (lowerName.includes('sunflower')) {
      targetSubCat = subCatMap['Sunflower Oil'];
    } else if (lowerName.includes('coconut')) {
      targetSubCat = subCatMap['Coconut Oil'];
    }

    // Extract unit & quantity (e.g. "1 ltr", "500 ml", "5 ltr")
    let unit = 'ltr';
    const unitMatch = name.match(/(\d+(?:\.\d+)?\s*(?:ltr|ml|kg|gm))/i);
    if (unitMatch) {
      unit = unitMatch[1];
    }

    const productSlug = generateSlug(`${name}-${i}`);

    const existingProduct = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          sellerId: seller.id,
          categoryId: targetSubCat.id,
          name: name,
          slug: productSlug,
          description: `Authentic ${name}. Category: ${targetSubCat.name}. High quality edible cooking oil for home and commercial kitchen.`,
          price: price,
          discount: 0,
          images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'],
          stock: 100,
          unit: unit,
          isActive: true,
          isFeatured: true,
        },
      });
      console.log(`✨ Created Product [${targetSubCat.name}]: ${name} -> ৳${price}`);
      createdCount++;
    } else {
      console.log(`ℹ️ Existing Product: ${name}`);
    }
  }

  console.log(`\n🎉 CSV Import Complete! Total Created: ${createdCount}, Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error('CSV Import Failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
