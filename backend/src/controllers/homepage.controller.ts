import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * Public GET /api/v1/homepage/full
 * Aggregated endpoint returning active hero slides, promo cards, shortcuts, categories, and locations.
 */
export const getHomepageData = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    // 1. Hero Slides
    let heroSlides = await prisma.heroSlide.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
        ],
      },
      orderBy: { order: 'asc' },
    });

    // Default seed fallback if database table is empty
    if (heroSlides.length === 0) {
      heroSlides = [
        {
          id: 'hs_1',
          title: 'Pure Farm Milk & Organic Daily Eggs',
          subtitle: 'Save 15%',
          description: 'Pure organic dairy & daily essentials delivered straight to your door in 45 minutes.',
          buttonText: 'Order Now',
          buttonLink: '/services/shopping/dairy',
          backgroundImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1000&auto=format&fit=crop&q=80',
          badge: 'Daily Fresh Farm Market',
          discountPercentage: 15,
          isActive: true,
          order: 0,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'hs_2',
          title: 'Farm Fresh Organic Vegetables & Fruits',
          subtitle: 'Direct from Savar Farms',
          description: '100% chemical-free organic produce harvested daily for DOHS residents.',
          buttonText: 'Explore Produce',
          buttonLink: '/services/shopping/vegetables',
          backgroundImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80',
          badge: '100% Organic',
          discountPercentage: 20,
          isActive: true,
          order: 1,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'hs_3',
          title: 'Master AC Servicing & Appliance Fix',
          subtitle: 'Expert Technicians in 30 Mins',
          description: 'Certified background-checked local repairmen for all DOHS household needs.',
          buttonText: 'Book Service',
          buttonLink: '/services/home-service',
          backgroundImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&auto=format&fit=crop&q=80',
          badge: 'Verified Experts',
          discountPercentage: null,
          isActive: true,
          order: 2,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
      ];
    }

    // 2. Promo Cards (Right Side Banners)
    let promoCards = await prisma.promoCard.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      orderBy: { order: 'asc' },
    });

    if (promoCards.length === 0) {
      promoCards = [
        {
          id: 'pc_1',
          title: 'Energy Drinks',
          subtitle: 'SAVE UP TO 35% ON',
          image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
          discount: '-35%',
          buttonText: 'Shop Now',
          buttonUrl: '/services/shopping/beverages',
          backgroundColor: '#b5d8f7',
          isActive: true,
          order: 0,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'pc_2',
          title: 'Plant Nuggets',
          subtitle: 'GET DISCOUNT -15% ON',
          image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=80',
          discount: '-15%',
          buttonText: 'Buy Now',
          buttonUrl: '/services/shopping/meat',
          backgroundColor: '#f9da8b',
          isActive: true,
          order: 1,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
      ];
    }

    // 3. Featured Shortcuts (Top Circular Highlights)
    let featuredShortcuts = await prisma.featuredShortcut.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });

    if (featuredShortcuts.length === 0) {
      featuredShortcuts = [
        {
          id: 'fs_1',
          title: '-35% on Energy Drinks',
          icon: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&auto=format&fit=crop&q=80',
          link: '/services/shopping/beverages',
          category: 'Beverages',
          priority: 0,
          isActive: true,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'fs_2',
          title: 'New Frozen Veg',
          icon: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80',
          link: '/services/shopping/vegetables',
          category: 'Vegetables',
          priority: 1,
          isActive: true,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'fs_3',
          title: 'Save up 30% on milk',
          icon: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=80',
          link: '/services/shopping/dairy',
          category: 'Dairy',
          priority: 2,
          isActive: true,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'fs_4',
          title: 'Free Delivery',
          icon: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80',
          link: '/offers',
          category: 'Offers',
          priority: 3,
          isActive: true,
          startDate: null,
          endDate: null,
          createdAt: now,
          updatedAt: now,
        },
      ];
    }

    // 4. Locations
    let locations = await prisma.location.findMany({
      where: { isAvailable: true },
      orderBy: { priority: 'asc' },
    });

    if (locations.length === 0) {
      locations = [
        { id: 'loc_1', name: 'Savar DOHS', slug: 'savar-dohs', city: 'Dhaka', isAvailable: true, priority: 0, createdAt: now, updatedAt: now },
        { id: 'loc_2', name: 'Mirpur DOHS', slug: 'mirpur-dohs', city: 'Dhaka', isAvailable: true, priority: 1, createdAt: now, updatedAt: now },
        { id: 'loc_3', name: 'Mohakhali DOHS', slug: 'mohakhali-dohs', city: 'Dhaka', isAvailable: true, priority: 2, createdAt: now, updatedAt: now },
        { id: 'loc_4', name: 'Baridhara DOHS', slug: 'baridhara-dohs', city: 'Dhaka', isAvailable: true, priority: 3, createdAt: now, updatedAt: now },
      ];
    }

    res.status(200).json({
      success: true,
      data: {
        heroSlides,
        promoCards,
        featuredShortcuts,
        locations,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
