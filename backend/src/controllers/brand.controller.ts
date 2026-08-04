import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getBrands = async (_req: Request, res: Response): Promise<void> => {
  try {
    let brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });

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

export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    // Check if brand is assigned to any active products
    const productCount = await prisma.product.count({
      where: {
        OR: [
          { brandId: id },
          { brandName: { equals: existing.name, mode: 'insensitive' } },
        ],
      },
    });

    if (productCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete brand "${existing.name}". It is currently assigned to ${productCount} active product(s). Please reassign or delete those products first.`,
      });
      return;
    }

    await prisma.brand.delete({ where: { id } });
    res.json({ success: true, message: `Brand "${existing.name}" deleted successfully` });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
