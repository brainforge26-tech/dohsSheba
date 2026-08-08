import fs from 'fs';
import path from 'path';

const exactSubcategoriesConfig = [
  { folder: 'chaldal_colors_flavours_scrape', name: 'Colors & Flavours', slug: 'colors-flavours', icon: '🎨', image: 'https://chaldn.com/_mpimage/foster-clark-food-color-red-28-ml?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D129377&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_dal_or_lentil_scrape', name: 'Dal or Lentil', slug: 'dal-or-lentil', icon: '🫘', image: 'https://chaldn.com/_mpimage/teer-red-lentil-deshi-musur-dal-500-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_ghee_scrape', name: 'Ghee', slug: 'ghee', icon: '🧈', image: 'https://chaldn.com/_mpimage/aarong-dairy-pure-ghee-200-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D26926&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_oil_scrape', name: 'Oil', slug: 'oil', icon: '🛢️', image: 'https://chaldn.com/_mpimage/rupchanda-fortified-soyabean-oil-5-ltr?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D133985&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_premium_ingredients_scrape', name: 'Premium Ingredients', slug: 'premium-ingredients', icon: '⭐', image: 'https://chaldn.com/_mpimage/golden-grain-poppy-seed-posto-dana-50-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D187931&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_ready_mix_scrape', name: 'Ready Mix', slug: 'ready-mix', icon: '📦', image: 'https://chaldn.com/_mpimage/radhuni-ready-beef-masala-20-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D129377&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_rices_scrape', name: 'Rice', slug: 'rice', icon: '🌾', image: 'https://chaldn.com/_mpimage/aci-aroma-chinigura-rice-1-kg?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_salt_sugar_scrape', name: 'Salt & Sugar', slug: 'salt-sugar', icon: '🧂', image: 'https://chaldn.com/_mpimage/aci-pure-refined-sugar-1-kg?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_shemai_suji_scrape', name: 'Shemai & Suji', slug: 'shemai-suji', icon: '🥣', image: 'https://chaldn.com/_mpimage/radhuni-vermicelli-shemai-200-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_miscellaneous_scrape', name: 'Special Ingredients & Miscellaneous', slug: 'special-ingredients-miscellaneous', icon: '🥄', image: 'https://chaldn.com/_mpimage/foster-clark-baking-powder-100-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1' },
  { folder: 'chaldal_spices_scrape', name: 'Spices', slug: 'spices', icon: '🌶️', image: 'https://chaldn.com/_mpimage/radhuni-chilli-powder-200-gm?src=https%3A%2F%2Feggyolk.chaldal.com%2Fapi%2FPicture%2FRaw%3FpictureId%3D127117&q=low&v=1&m=400&webp=1' }
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

const basePath = 'F:\\Product_listing-master\\cooking';
const outputData: any[] = [];

for (const config of exactSubcategoriesConfig) {
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

const targetFile = path.join(__dirname, '../src/data/cooking_products.json');
const targetDir = path.dirname(targetFile);
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

fs.writeFileSync(targetFile, JSON.stringify(outputData, null, 2), 'utf-8');
console.log(`Generated JSON with ${outputData.length} subcategories at ${targetFile}`);
