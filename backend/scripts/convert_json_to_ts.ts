import fs from 'fs';
import path from 'path';

// 1. Cooking Dataset
const cookingJsonPath = path.join(__dirname, '../src/data/cooking_products.json');
if (fs.existsSync(cookingJsonPath)) {
  const cookingData = JSON.parse(fs.readFileSync(cookingJsonPath, 'utf-8'));
  const tsContent = `export const cookingDataset = ${JSON.stringify(cookingData, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, '../src/data/cooking_dataset.ts'), tsContent, 'utf-8');
  console.log('✅ Generated backend/src/data/cooking_dataset.ts');
}

// 2. Fruits & Vegetables Dataset
const fruitsJsonPath = path.join(__dirname, '../src/data/fruits_vegetables_products.json');
if (fs.existsSync(fruitsJsonPath)) {
  const fruitsData = JSON.parse(fs.readFileSync(fruitsJsonPath, 'utf-8'));
  const tsContent = `export const fruitsVegetablesDataset = ${JSON.stringify(fruitsData, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, '../src/data/fruits_vegetables_dataset.ts'), tsContent, 'utf-8');
  console.log('✅ Generated backend/src/data/fruits_vegetables_dataset.ts');
}
