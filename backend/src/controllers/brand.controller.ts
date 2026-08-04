import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getBrands = async (_req: Request, res: Response): Promise<void> => {
  try {
    let brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    // Default seed brands if empty
    if (brands.length === 0) {
      const defaultBrandNames = ['Nestle', 'Pran', 'Square', 'AACI', 'Unilever', 'DOHS Organic', 'Fresh', 'Teer', 'Radhuni'];
      const created = [];
      for (const bName of defaultBrandNames) {
        const slug = bName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const b = await prisma.brand.upsert({
          where: { slug },
          update: {},
          create: { name: bName, slug },
        });
        created.push(b);
      }
      brands = created;
    }

    res.json({ success: true, data: brands });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, logo, description } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ success: false, message: 'Brand name is required' });
      return;
    }

    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Check if brand already exists
    const existing = await prisma.brand.findFirst({
      where: {
        OR: [{ slug }, { name: { equals: cleanName, mode: 'insensitive' } }],
      },
    });

    if (existing) {
      res.status(200).json({ success: true, data: existing, message: 'Existing brand returned' });
      return;
    }

    const brand = await prisma.brand.create({
      data: {
        name: cleanName,
        slug,
        logo: logo || null,
        description: description || null,
        isActive: true,
      },
    });

    res.status(201).json({ success: true, data: brand, message: 'Brand created successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
