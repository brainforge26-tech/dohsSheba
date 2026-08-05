'use client';

import React from 'react';
import Link from 'next/link';

interface SubCategoryCardProps {
  subcategory: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    _count?: {
      products?: number;
    };
  };
  parentSlug: string;
  basePath?: string;
}

const FALLBACK_SUB_IMAGES: Record<string, string> = {
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
  oil: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
  salt: 'https://images.unsplash.com/photo-1518110168401-f282472fc750?w=400&auto=format&fit=crop&q=80',
  dal: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
};

export function SubCategoryCard({ subcategory, parentSlug, basePath = '/category' }: SubCategoryCardProps) {
  const imgSrc = subcategory.image || FALLBACK_SUB_IMAGES[subcategory.slug] || FALLBACK_SUB_IMAGES.spices;
  const href = `${basePath}/${parentSlug}/${subcategory.slug}`;

  return (
    <Link
      href={href}
      className="group block p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-0.5 text-center"
    >
      <div className="relative w-full aspect-4/3 max-h-32 mb-2.5 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
        <img
          src={imgSrc}
          alt={subcategory.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <h4 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-purple-700 transition-colors line-clamp-1">
        {subcategory.name}
      </h4>
      {subcategory._count && (
        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
          {subcategory._count.products || 0} items
        </p>
      )}
    </Link>
  );
}
