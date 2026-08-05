import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Syncing unit amounts for all existing products...');

  const products = await prisma.product.findMany();
  let updatedCount = 0;

  for (const p of products) {
    let amount: number | null = p.unitAmount;
    let cleanUnit: string = p.unit || 'unit';

    // Extract amount if unit string contains numbers (e.g., "1 Liter", "500 g", "2 kg", "250 ml")
    if (amount === null || amount === undefined) {
      const match = cleanUnit.match(/^([\d.]+)\s*(.*)$/);
      if (match) {
        const parsedAmt = parseFloat(match[1]);
        if (!isNaN(parsedAmt)) {
          amount = parsedAmt;
          cleanUnit = match[2].trim() || 'unit';
        }
      }
    }

    // Standardize unit names
    const lowerUnit = cleanUnit.toLowerCase();
    if (lowerUnit.includes('liter') || lowerUnit.includes('ltr')) cleanUnit = 'liter';
    else if (lowerUnit.includes('kg')) cleanUnit = 'kg';
    else if (lowerUnit.includes('gram') || lowerUnit === 'g') cleanUnit = 'gram';
    else if (lowerUnit.includes('ml')) cleanUnit = 'ml';
    else if (lowerUnit.includes('pc') || lowerUnit.includes('piece')) cleanUnit = 'piece';
    else if (lowerUnit.includes('bunch')) cleanUnit = 'pack';
    else if (lowerUnit.includes('box')) cleanUnit = 'box';

    // Fallback amount if still null
    if (amount === null || amount === undefined) {
      amount = 1;
    }

    await prisma.product.update({
      where: { id: p.id },
      data: {
        unitAmount: amount,
        unit: cleanUnit,
      },
    });

    updatedCount++;
    console.log(`  ✓ Updated product "${p.name}": amount = ${amount}, unit = ${cleanUnit}`);
  }

  console.log(`✨ Successfully updated ${updatedCount} products with unit amounts!`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
