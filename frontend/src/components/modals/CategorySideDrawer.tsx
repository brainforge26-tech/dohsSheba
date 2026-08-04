'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronRight,
  Carrot,
  Beef,
  Fish,
  Milk,
  ShoppingBag,
  Zap,
  Flame,
  PhoneCall,
  Star,
  Plus,
  Minus,
  Heart,
} from 'lucide-react';
import { useCategoryDrawerStore } from '@/store/useCategoryDrawerStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useCartStore } from '@/store/useCartStore';

export function CategorySideDrawer() {
  const { isOpen, closeDrawer } = useCategoryDrawerStore();
  const { language } = useLanguageStore();
  const isBn = language === 'BN';
  const { addItem } = useCartStore();

  const [activeCategory, setActiveCategory] = useState<string>('meat');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const categoryMenuList = [
    { id: 'vegetables', name: isBn ? 'Vegetables & Fruits' : 'Vegetables & Fruits', icon: Carrot, slug: 'vegetables' },
    { id: 'meat', name: isBn ? 'Vegan Meat & Poultry' : 'Vegan Meat', icon: Beef, slug: 'meat' },
    { id: 'seafood', name: isBn ? 'Seafood & Fish' : 'Seafood', icon: Fish, slug: 'fish' },
    { id: 'dairy', name: isBn ? 'Milk & Dairy' : 'Dairy', icon: Milk, slug: 'dairy' },
    { id: 'bakery', name: isBn ? 'Bakery & Snacks' : 'Bakery', icon: ShoppingBag, slug: 'bakery' },
    { id: 'beverages', name: isBn ? 'Beverages & Juices' : 'Beverages', icon: Zap, slug: 'beverages' },
    { id: 'offers', name: isBn ? 'Weekly Discounts' : 'Weekly Discounts', icon: Flame, href: '/offers' },
  ];

  // Rich Mega Menu Data for each category (Woodmart exact layout)
  const megaMenuData: Record<
    string,
    {
      title: string;
      subItems: { name: string; image: string; slug: string }[];
      banner: { title: string; link: string; bg: string; image: string };
      products: {
        id: string;
        title: string;
        image: string;
        price: number;
        originalPrice?: number;
        badge?: string;
        rating: number;
        unit: string;
      }[];
    }
  > = {
    meat: {
      title: 'Vegan Meat & Poultry',
      subItems: [
        { name: 'Bacon', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100&auto=format&fit=crop&q=80', slug: 'meat' },
        { name: 'Chicken', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=100&auto=format&fit=crop&q=80', slug: 'meat' },
        { name: 'Deli Meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100&auto=format&fit=crop&q=80', slug: 'meat' },
        { name: 'Burgers', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&auto=format&fit=crop&q=80', slug: 'meat' },
        { name: 'Beef Cut', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100&auto=format&fit=crop&q=80', slug: 'meat' },
      ],
      banner: {
        title: 'Get discount -15% on Plant-Based Nuggets',
        link: '/services/shopping/meat',
        bg: 'bg-[#f9da8b]',
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&auto=format&fit=crop&q=80',
      },
      products: [
        {
          id: 'prod_m1',
          title: 'Plant-Based Nuggets',
          image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&auto=format&fit=crop&q=80',
          price: 280,
          originalPrice: 320,
          badge: '-15%',
          rating: 4.5,
          unit: 'each',
        },
        {
          id: 'prod_m2',
          title: 'Crispy Jack Nuggets',
          image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&auto=format&fit=crop&q=80',
          price: 240,
          originalPrice: 280,
          badge: '-15%',
          rating: 4.9,
          unit: 'each',
        },
        {
          id: 'prod_m3',
          title: 'Rice Nuggets',
          image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&auto=format&fit=crop&q=80',
          price: 180,
          rating: 4.6,
          unit: 'each',
        },
      ],
    },
    vegetables: {
      title: 'Vegetables & Fruits',
      subItems: [
        { name: 'Organic Tomatoes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&auto=format&fit=crop&q=80', slug: 'vegetables' },
        { name: 'Fresh Green Avocado', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&auto=format&fit=crop&q=80', slug: 'vegetables' },
        { name: 'Farm Spinach', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80', slug: 'vegetables' },
        { name: 'Sweet Carrots', image: 'https://images.unsplash.com/photo-1598170845058-128a34a49470?w=100&auto=format&fit=crop&q=80', slug: 'vegetables' },
        { name: 'Fuji Apples', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=100&auto=format&fit=crop&q=80', slug: 'fruits' },
      ],
      banner: {
        title: 'Get discount -10% on Fresh Organic Produce',
        link: '/services/shopping/vegetables',
        bg: 'bg-[#d7e6cd]',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&auto=format&fit=crop&q=80',
      },
      products: [
        {
          id: 'prod_v1',
          title: 'Organic Farm Tomatoes',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
          price: 60,
          originalPrice: 70,
          badge: '-10%',
          rating: 4.8,
          unit: 'KG',
        },
        {
          id: 'prod_v2',
          title: 'Fresh Green Avocado',
          image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80',
          price: 149,
          originalPrice: 200,
          badge: '-25%',
          rating: 4.9,
          unit: 'KG',
        },
        {
          id: 'prod_v3',
          title: 'Fresh Farm Carrots',
          image: 'https://images.unsplash.com/photo-1598170845058-128a34a49470?w=200&auto=format&fit=crop&q=80',
          price: 50,
          rating: 4.7,
          unit: 'KG',
        },
      ],
    },
    seafood: {
      title: 'Seafood & Fresh Fish',
      subItems: [
        { name: 'Fresh Padma Hilsha', image: 'https://images.unsplash.com/photo-1534942519507-769d4679447d?w=100&auto=format&fit=crop&q=80', slug: 'fish' },
        { name: 'Fresh Shellfish & Prawn', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=100&auto=format&fit=crop&q=80', slug: 'fish' },
        { name: 'Frozen Salmon Fillet', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=100&auto=format&fit=crop&q=80', slug: 'fish' },
      ],
      banner: {
        title: 'Fresh Padma River Hilsha Direct From Chandpur',
        link: '/services/shopping/fish',
        bg: 'bg-[#b5d8f7]',
        image: 'https://images.unsplash.com/photo-1534942519507-769d4679447d?w=300&auto=format&fit=crop&q=80',
      },
      products: [
        {
          id: 'prod_f1',
          title: 'Padma Hilsha Fish (Whole)',
          image: 'https://images.unsplash.com/photo-1534942519507-769d4679447d?w=200&auto=format&fit=crop&q=80',
          price: 1400,
          originalPrice: 1600,
          badge: '-12%',
          rating: 4.9,
          unit: 'KG',
        },
        {
          id: 'prod_f2',
          title: 'Fresh Jumbo Prawns',
          image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=200&auto=format&fit=crop&q=80',
          price: 950,
          rating: 4.8,
          unit: 'KG',
        },
      ],
    },
    dairy: {
      title: 'Milk & Dairy',
      subItems: [
        { name: 'Pure Cow Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=80', slug: 'dairy' },
        { name: 'Farm Brown Eggs', image: 'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=100&auto=format&fit=crop&q=80', slug: 'dairy' },
        { name: 'Artisan Butter', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=100&auto=format&fit=crop&q=80', slug: 'dairy' },
      ],
      banner: {
        title: 'Save up 30% on Pure Organic Milk & Eggs',
        link: '/services/shopping/dairy',
        bg: 'bg-[#fde68a]',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80',
      },
      products: [
        {
          id: 'prod_d1',
          title: 'Pure Farm Cow Milk',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80',
          price: 90,
          rating: 4.9,
          unit: 'Litre',
        },
        {
          id: 'prod_d2',
          title: 'Organic Brown Eggs',
          image: 'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?w=200&auto=format&fit=crop&q=80',
          price: 145,
          rating: 4.8,
          unit: 'Dozen',
        },
      ],
    },
  };

  const currentMega = megaMenuData[activeCategory] || megaMenuData['meat'];

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-200 font-sans text-slate-800">
      {/* Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={closeDrawer} />

      {/* Main Drawer + Mega Submenu Flyout Container */}
      <div className="relative flex h-full max-w-[95vw] z-10 animate-in slide-in-from-left duration-300">
        
        {/* ── Left Column: Category List Menu ── */}
        <div className="w-64 sm:w-72 bg-white h-full shadow-2xl flex flex-col shrink-0 border-r border-slate-200">
          <div className="p-4 bg-[#7eb343] text-white flex items-center justify-between font-bold text-sm">
            <div className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              <span>Menu</span>
            </div>
            <button onClick={closeDrawer} className="p-1 hover:bg-[#6c9c36] rounded-md cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 divide-y divide-slate-100">
            {categoryMenuList.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              const linkHref = cat.href || `/services/shopping/${cat.slug}`;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors text-sm font-medium ${
                    isSelected ? 'bg-slate-50 text-[#7eb343] font-bold' : 'text-slate-700 hover:text-[#7eb343] hover:bg-slate-50'
                  }`}
                >
                  <Link
                    href={linkHref}
                    onClick={closeDrawer}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#7eb343]' : 'text-slate-400'}`} />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#7eb343] translate-x-1' : 'text-slate-300'} transition-all`} />
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#7eb343]" />
              <span>DOHS Helpline: (09612) 238-7908</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Mega Subcategory Flyout Panel (100% Woodmart Screenshot Layout) ── */}
        <div className="hidden md:flex flex-col w-[440px] sm:w-[480px] bg-white h-full shadow-2xl overflow-y-auto p-6 space-y-6 animate-in fade-in slide-in-from-left-2 duration-200 border-r border-slate-200">
          {/* 1. Category Title */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-lg text-slate-900">{currentMega.title}</h3>
            <Link
              href={`/services/shopping/${activeCategory}`}
              onClick={closeDrawer}
              className="text-xs font-bold text-[#7eb343] hover:underline"
            >
              View All ➔
            </Link>
          </div>

          {/* 2. Subcategories Grid (Top Grid in Screenshot) */}
          <div className="grid grid-cols-2 gap-3">
            {currentMega.subItems.map((sub, idx) => (
              <Link
                key={idx}
                href={`/services/shopping/${sub.slug}`}
                onClick={closeDrawer}
                className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group"
              >
                <img src={sub.image} alt={sub.name} className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100" />
                <span className="font-bold text-xs text-slate-800 group-hover:text-[#7eb343] truncate">
                  {sub.name}
                </span>
              </Link>
            ))}
          </div>

          {/* 3. Discount Banner Card (Middle Banner in Screenshot) */}
          <div className={`relative rounded-2xl overflow-hidden p-5 ${currentMega.banner.bg} flex items-center justify-between shadow-2xs group`}>
            <div className="max-w-[200px] space-y-2 z-10">
              <h4 className="font-extrabold text-sm text-amber-950 leading-snug">
                {currentMega.banner.title}
              </h4>
              <Link
                href={currentMega.banner.link}
                onClick={closeDrawer}
                className="inline-block px-4 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs shadow-2xs transition-all active:scale-95"
              >
                To Shop
              </Link>
            </div>
            <img
              src={currentMega.banner.image}
              alt=""
              className="w-28 h-28 object-contain group-hover:scale-105 transition-transform shrink-0"
            />
          </div>

          {/* 4. Featured Products Row (Bottom Product Cards in Screenshot) */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Featured Products</h4>
            <div className="grid grid-cols-3 gap-3">
              {currentMega.products.map((prod) => (
                <div
                  key={prod.id}
                  className="group relative rounded-xl border border-slate-100 p-2 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Badge */}
                  {prod.badge && (
                    <span className="absolute top-2 left-2 z-10 bg-[#7eb343] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                      {prod.badge}
                    </span>
                  )}
                  <button className="absolute top-2 right-2 z-10 text-slate-300 hover:text-rose-500 transition-colors">
                    <Heart className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href={`/services/shopping/product/${prod.id}`}
                    onClick={closeDrawer}
                    className="block relative h-24 w-full rounded-lg overflow-hidden bg-slate-50 my-1"
                  >
                    <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </Link>

                  <div className="space-y-1">
                    <h5 className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-[#7eb343] transition-colors">
                      {prod.title}
                    </h5>

                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-extrabold text-[#7eb343]">৳{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="line-through text-slate-400 text-[10px]">৳{prod.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span className="flex items-center gap-0.5 font-bold text-amber-500">
                        {prod.rating} <Star className="w-3 h-3 fill-amber-400" />
                      </span>
                      <button
                        onClick={() =>
                          addItem({
                            id: prod.id,
                            title: prod.title,
                            slug: prod.id,
                            categorySlug: 'groceries',
                            categoryName: 'Grocery',
                            shopName: 'DOHS Market',
                            price: prod.price,
                            unit: prod.unit,
                            rating: prod.rating,
                            reviewCount: 10,
                            image: prod.image,
                            stock: 50,
                          })
                        }
                        className="px-2 py-0.5 rounded-md bg-[#7eb343] hover:bg-[#6c9c36] text-white font-bold text-[10px] cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
