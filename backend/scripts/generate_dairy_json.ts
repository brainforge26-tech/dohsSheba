import fs from 'fs';
import path from 'path';

const configList = [
  {
    folder: 'chaldal_liquid_uht_milk_scrape',
    name: 'Liquid & UHT Milk',
    slug: 'liquid-uht-milk',
    icon: '🥛',
    image: 'https://chaldn.com/_mpimage/aarong-dairy-pasteurized-liquid-milk-1-ltr?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_powder_milk_scrape',
    name: 'Powder Milk',
    slug: 'powder-milk',
    icon: '🍼',
    image: 'https://chaldn.com/_mpimage/dano-full-cream-milk-powder-1-kg?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_yogurt_scrape',
    name: 'Yogurt & Curd',
    slug: 'yogurt-curd',
    icon: '🍧',
    image: 'https://chaldn.com/_mpimage/aarong-dairy-sweet-yogurt-500-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_butter_sour_cream_scrape',
    name: 'Butter & Sour Cream',
    slug: 'butter-sour-cream',
    icon: '🧈',
    image: 'https://chaldn.com/_mpimage/aarong-dairy-salted-butter-200-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_cheeses_scrape',
    name: 'Cheese',
    slug: 'cheeses',
    icon: '🧀',
    image: 'https://chaldn.com/_mpimage/happy-cow-cheese-8-slices-133-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_condensed_milk_cream_scrape',
    name: 'Condensed Milk & Cream',
    slug: 'condensed-milk-cream',
    icon: '🍦',
    image: 'https://chaldn.com/_mpimage/danish-sweetened-condensed-milk-397-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  },
  {
    folder: 'chaldal_eggs_scrape',
    name: 'Eggs',
    slug: 'eggs',
    icon: '🥚',
    image: 'https://chaldn.com/_mpimage/farm-egg-red-12-pcs?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1'
  }
];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else current += char;
  }
  result.push(current.trim());
  return result;
}

const basePath = 'F:\\Product_listing-master\\dairy';
const outputData: any[] = [];

for (const config of configList) {
  const csvPath = path.join(basePath, config.folder, 'products.csv');
  if (!fs.existsSync(csvPath)) continue;

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) continue;

  const header = parseCsvLine(lines[0]);
  const nameIdx = header.indexOf('name');
  const priceIdx = header.indexOf('price');
  const imageIdx = header.indexOf('image_url');

  const products: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 2) continue;
    const name = cols[nameIdx >= 0 ? nameIdx : 0]?.trim();
    const rawPrice = cols[priceIdx >= 0 ? priceIdx : 1]?.trim();
    const imageUrl = cols[imageIdx >= 0 ? imageIdx : 3]?.trim() || '';

    if (!name) continue;
    const price = parseFloat(rawPrice) || 0;
    products.push({ name, price, imageUrl });
  }

  outputData.push({
    name: config.name,
    slug: config.slug,
    icon: config.icon,
    image: config.image,
    products
  });
}

const targetFile = path.join(__dirname, '../src/data/dairy_products.json');
const targetDir = path.dirname(targetFile);
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

fs.writeFileSync(targetFile, JSON.stringify(outputData, null, 2), 'utf-8');
console.log(`Generated Dairy JSON with ${outputData.length} subcategories at ${targetFile}`);
