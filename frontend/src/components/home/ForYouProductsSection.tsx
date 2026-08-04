'use client';

import React, { useState } from 'react';
import { ProductCard } from '@/components/common/ProductCard';

export function ForYouProductsSection() {
  const [displayCount, setDisplayCount] = useState(10);

  const initialProducts = [
    {
      id: 'fy_1',
      title: 'Spanish Extra Virgin Olive Oil (250ml)',
      slug: 'spanish-extra-virgin-olive-oil-250ml',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
      price: 790,
      originalPrice: 990,
      badge: 'HOT',
      isHot: true,
      rating: 4.9,
      reviewCount: 18,
      soldCount: 18,
      unit: '250ml',
    },
    {
      id: 'fy_2',
      title: 'Osufi Nourishing Repair Serum (50ml)',
      slug: 'osufi-repair-serum',
      image: 'https://images.unsplash.com/photo-1608248597263-00079996577f?w=400&auto=format&fit=crop&q=80',
      price: 680,
      originalPrice: 980,
      badge: '-30%',
      rating: 4.8,
      reviewCount: 5,
      soldCount: 5,
      unit: '50ml',
    },
    {
      id: 'fy_3',
      title: 'Indian Fair Look Ayurvedic Lotion',
      slug: 'indian-fair-look-lotion',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
      price: 990,
      originalPrice: 1590,
      badge: '-37%',
      rating: 4.7,
      reviewCount: 1,
      soldCount: 1,
      unit: '100g',
    },
    {
      id: 'fy_4',
      title: 'Sensing Wireless Desk Phone Stand BT',
      slug: 'sensing-wireless-phone-stand-bt',
      image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&auto=format&fit=crop&q=80',
      price: 1150,
      originalPrice: 1500,
      badge: '-23%',
      rating: 4.8,
      reviewCount: 2,
      soldCount: 2,
      unit: 'each',
    },
    {
      id: 'fy_5',
      title: '3-in-1 Foldable Mobile Phone Bracket',
      slug: '3-in-1-mobile-phone-bracket',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
      price: 590,
      originalPrice: 900,
      badge: '-34%',
      rating: 4.9,
      reviewCount: 7,
      soldCount: 7,
      unit: 'each',
    },
    {
      id: 'fy_6',
      title: 'Coffee Frother Handheld Electric Whisk',
      slug: 'coffee-frother-electric-whisk',
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&auto=format&fit=crop&q=80',
      price: 890,
      originalPrice: 1290,
      badge: 'HOT',
      isHot: true,
      rating: 4.9,
      reviewCount: 14,
      soldCount: 14,
      unit: 'each',
    },
    {
      id: 'fy_7',
      title: 'Hot Water Bag 2 Liter Rubber Capacity',
      slug: 'hot-water-bag-2L',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
      price: 239,
      originalPrice: 380,
      badge: '-37%',
      rating: 4.6,
      reviewCount: 4,
      soldCount: 4,
      unit: '2L',
    },
    {
      id: 'fy_8',
      title: 'Ergonomic Executive Office Boss Chair',
      slug: 'executive-office-boss-chair',
      image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1276?w=400&auto=format&fit=crop&q=80',
      price: 6000,
      originalPrice: 7000,
      badge: 'HOT',
      isHot: true,
      rating: 5.0,
      reviewCount: 8,
      soldCount: 8,
      unit: 'each',
    },
    {
      id: 'fy_9',
      title: 'Watsons Green Tea Body Wash (1000ml)',
      slug: 'watsons-green-tea-body-wash',
      image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&auto=format&fit=crop&q=80',
      price: 1700,
      originalPrice: 1800,
      badge: '-5%',
      rating: 4.9,
      reviewCount: 22,
      soldCount: 22,
      unit: '1000ml',
    },
    {
      id: 'fy_10',
      title: 'Deep Tissue Mini Muscle Massage Gun',
      slug: 'deep-tissue-massage-gun',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&auto=format&fit=crop&q=80',
      price: 1450,
      originalPrice: 1800,
      badge: '-19%',
      rating: 4.8,
      reviewCount: 12,
      soldCount: 12,
      unit: 'each',
    },
    {
      id: 'fy_11',
      title: 'Organic Extra Virgin Coconut Oil (500ml)',
      slug: 'organic-coconut-oil-500ml',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80',
      price: 450,
      originalPrice: 550,
      badge: '-18%',
      rating: 4.9,
      reviewCount: 30,
      soldCount: 30,
      unit: '500ml',
    },
    {
      id: 'fy_12',
      title: 'Smart LED Desk Lamp with Touch Dimmer',
      slug: 'smart-led-desk-lamp',
      image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&auto=format&fit=crop&q=80',
      price: 1250,
      originalPrice: 1600,
      badge: 'HOT',
      isHot: true,
      rating: 4.8,
      reviewCount: 16,
      soldCount: 16,
      unit: 'each',
    },
  ];

  const visibleProducts = initialProducts.slice(0, displayCount);

  return (
    <section className="py-6 px-4 bg-white font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Section Header with Sparkle Heart Emoji */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="text-xl">💖</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            For You
          </h2>
        </div>

        {/* 5-Column Product Cards Grid (100% Woodmart Card Layout) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {visibleProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              title={prod.title}
              slug={prod.slug}
              price={prod.price}
              originalPrice={prod.originalPrice}
              unit={prod.unit}
              image={prod.image}
              badge={prod.badge}
              isHot={prod.isHot}
              rating={prod.rating}
              soldCount={prod.soldCount}
            />
          ))}
        </div>

        {/* Centered Load More Button */}
        {displayCount < initialProducts.length && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 5)}
              className="px-8 py-2.5 rounded-xl bg-[#7eb343] hover:bg-[#6c9c36] text-white font-extrabold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
