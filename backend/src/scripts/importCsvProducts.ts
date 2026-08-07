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
  const possiblePaths = [
    path.join(process.cwd(), 'data', 'products.csv'),
    path.join(__dirname, '../../data/products.csv'),
    `C:\\Users\\Hp ZBooK 15U G6\\Downloads\\products (2).csv`,
  ];

  const csvPath = possiblePaths.find((p) => fs.existsSync(p));
  if (!csvPath) {
    console.error(`CSV file not found in any of: ${possiblePaths.join(', ')}`);
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

  // 2. Target Main Category: "Cooking"
  let mainCategory = await prisma.productCategory.findFirst({
    where: {
      OR: [
        { name: { equals: 'Cooking', mode: 'insensitive' } },
        { slug: 'cooking' },
      ],
      parentId: null,
    },
  });

  if (!mainCategory) {
    mainCategory = await prisma.productCategory.create({
      data: {
        name: 'Cooking',
        slug: 'cooking',
        description: 'Explore top quality items under Cooking. Fast 45-min delivery in DOHS.',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
      },
    });
    console.log(`✅ Created Main Category: ${mainCategory.name}`);
  } else {
    console.log(`ℹ️ Found Existing Main Category: ${mainCategory.name} (ID: ${mainCategory.id})`);
  }

  // 3. Target Subcategory: "Oil" under "Cooking"
  let oilSubCategory = await prisma.productCategory.findFirst({
    where: {
      parentId: mainCategory.id,
      OR: [
        { name: { equals: 'Oil', mode: 'insensitive' } },
        { slug: 'oil' },
        { slug: 'cooking-oil' },
      ],
    },
  });

  if (!oilSubCategory) {
    oilSubCategory = await prisma.productCategory.create({
      data: {
        name: 'Oil',
        slug: 'cooking-oil',
        description: 'Edible Cooking Oil, Mustard Oil, Soyabean Oil, Olive Oil & Sunflower Oil',
        parentId: mainCategory.id,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500',
      },
    });
    console.log(`✅ Created Subcategory: ${oilSubCategory.name} under ${mainCategory.name}`);
  } else {
    console.log(`ℹ️ Found Existing Subcategory: ${oilSubCategory.name} (ID: ${oilSubCategory.id})`);
  }

  // Sub-types under Oil subcategory (Mustard Oil, Soyabean Oil, Olive Oil, etc.)
  const subTypes = [
    'Mustard Oil',
    'Soyabean Oil',
    'Olive Oil',
    'Rice Bran Oil',
    'Sunflower Oil',
    'Coconut Oil',
    'Other Oils',
  ];

  const subTypeMap: Record<string, any> = {};

  for (const subName of subTypes) {
    const subSlug = generateSlug(`cooking-oil-${subName}`);
    let subCategory = await prisma.productCategory.findFirst({
      where: {
        OR: [{ slug: subSlug }, { name: subName }],
      },
    });

    if (!subCategory) {
      subCategory = await prisma.productCategory.create({
        data: {
          name: subName,
          slug: subSlug,
          description: `${subName} for daily cooking`,
          parentId: oilSubCategory.id,
        },
      });
      console.log(`   └─ Created Child Subcategory: ${subCategory.name} under Oil`);
    } else if (subCategory.parentId !== oilSubCategory.id) {
      // Re-parent subcategory to Oil under Cooking
      await prisma.productCategory.update({
        where: { id: subCategory.id },
        data: { parentId: oilSubCategory.id },
      });
    }
    subTypeMap[subName] = subCategory;
  }

  // Parse CSV records & import/assign products to Oil subcategory
  let importedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

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
      skippedCount++;
      continue;
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) {
      skippedCount++;
      continue;
    }

    // Determine target subcategory under Oil
    let targetCategory = oilSubCategory; // Default to main Oil subcategory
    const lowerName = name.toLowerCase();

    if (lowerName.includes('mustard')) {
      targetCategory = subTypeMap['Mustard Oil'] || oilSubCategory;
    } else if (lowerName.includes('soyabean') || lowerName.includes('soybean')) {
      targetCategory = subTypeMap['Soyabean Oil'] || oilSubCategory;
    } else if (lowerName.includes('olive')) {
      targetCategory = subTypeMap['Olive Oil'] || oilSubCategory;
    } else if (lowerName.includes('rice bran')) {
      targetCategory = subTypeMap['Rice Bran Oil'] || oilSubCategory;
    } else if (lowerName.includes('sunflower')) {
      targetCategory = subTypeMap['Sunflower Oil'] || oilSubCategory;
    } else if (lowerName.includes('coconut')) {
      targetCategory = subTypeMap['Coconut Oil'] || oilSubCategory;
    }

    let unit = 'ltr';
    const unitMatch = name.match(/(\d+(?:\.\d+)?\s*(?:ltr|ml|kg|gm))/i);
    if (unitMatch) {
      unit = unitMatch[1];
    }

    const productSlug = generateSlug(`${name}-${i}`);

    // Check existing by name or slug
    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: productSlug },
        ],
      },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: {
          sellerId: seller.id,
          categoryId: targetCategory.id,
          name: name,
          slug: productSlug,
          description: `Authentic ${name}. Main Category: Cooking ➔ Subcategory: Oil. High quality edible cooking oil for home and commercial kitchen.`,
          price: price,
          discount: 0,
          images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500'],
          stock: 100,
          unit: unit,
          isActive: true,
          isFeatured: true,
        },
      });
      console.log(`✨ Created Product under Cooking ➔ Oil [${targetCategory.name}]: ${name} -> ৳${price}`);
      importedCount++;
    } else {
      // Re-assign product category to Oil subcategory
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          categoryId: targetCategory.id,
          price: price,
          isActive: true,
          images: imageUrl ? [imageUrl] : existingProduct.images,
        },
      });
      console.log(`🔄 Re-assigned Product to Cooking ➔ Oil [${targetCategory.name}]: ${name}`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 CSV Import Complete! Created: ${importedCount}, Updated/Re-assigned: ${updatedCount}, Skipped: ${skippedCount}`);
}

main()
  .catch((e) => {
    console.error('CSV Import Failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
