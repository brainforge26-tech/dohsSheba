import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// ── Hero Slides Admin CRUD ──

export const getAdminHeroSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: slides });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const slide = await prisma.heroSlide.create({
      data: {
        title: req.body.title,
        subtitle: req.body.subtitle,
        description: req.body.description,
        buttonText: req.body.buttonText || 'Order Now',
        buttonLink: req.body.buttonLink || '/services/shopping',
        backgroundImage: req.body.backgroundImage,
        badge: req.body.badge,
        discountPercentage: req.body.discountPercentage ? parseFloat(req.body.discountPercentage) : null,
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
        order: req.body.order ? parseInt(req.body.order) : 0,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      },
    });
    res.status(201).json({ success: true, data: slide });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        ...req.body,
        discountPercentage: req.body.discountPercentage !== undefined ? parseFloat(req.body.discountPercentage) : undefined,
        startDate: req.body.startDate ? new Date(req.body.startDate) : req.body.startDate === null ? null : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : req.body.endDate === null ? null : undefined,
      },
    });
    res.json({ success: true, data: slide });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.heroSlide.delete({ where: { id } });
    res.json({ success: true, message: 'Hero slide deleted' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Promo Cards Admin CRUD ──

export const getAdminPromoCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const cards = await prisma.promoCard.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: cards });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createPromoCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const card = await prisma.promoCard.create({
      data: {
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.body.image,
        discount: req.body.discount,
        buttonText: req.body.buttonText || 'Shop Now',
        buttonUrl: req.body.buttonUrl || '/services/shopping',
        backgroundColor: req.body.backgroundColor || '#b5d8f7',
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
        order: req.body.order ? parseInt(req.body.order) : 0,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      },
    });
    res.status(201).json({ success: true, data: card });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updatePromoCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const card = await prisma.promoCard.update({
      where: { id },
      data: req.body,
    });
    res.json({ success: true, data: card });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deletePromoCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.promoCard.delete({ where: { id } });
    res.json({ success: true, message: 'Promo card deleted' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── Featured Shortcuts Admin CRUD ──

export const getAdminShortcuts = async (req: Request, res: Response): Promise<void> => {
  try {
    const shortcuts = await prisma.featuredShortcut.findMany({ orderBy: { priority: 'asc' } });
    res.json({ success: true, data: shortcuts });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createShortcut = async (req: Request, res: Response): Promise<void> => {
  try {
    const shortcut = await prisma.featuredShortcut.create({
      data: {
        title: req.body.title,
        icon: req.body.icon || '🛍️',
        link: req.body.link || '/services/shopping',
        category: req.body.category,
        priority: req.body.priority ? parseInt(req.body.priority) : 0,
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
      },
    });
    res.status(201).json({ success: true, data: shortcut });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateShortcut = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const shortcut = await prisma.featuredShortcut.update({
      where: { id },
      data: req.body,
    });
    res.json({ success: true, data: shortcut });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteShortcut = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.featuredShortcut.delete({ where: { id } });
    res.json({ success: true, message: 'Shortcut deleted' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
