'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, PackageX, Search, Heart, MapPin, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  type?: 'cart' | 'orders' | 'wishlist' | 'search' | 'address' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const configs = {
    cart: {
      icon: <ShoppingBag className="w-10 h-10 text-[#0E7A45]" />,
      title: title || 'Your Shopping Cart is Empty',
      description: description || 'Looks like you haven’t added any items to your cart yet. Explore local DOHS vendors and fresh groceries now.',
      actionLabel: actionLabel || 'Start Shopping',
      actionHref: actionHref || '/services/shopping',
    },
    orders: {
      icon: <PackageX className="w-10 h-10 text-[#0E7A45]" />,
      title: title || 'No Orders Placed Yet',
      description: description || 'You haven’t placed any orders with DOHS Sheba yet. Place your first order to enjoy 45-min express doorstep delivery!',
      actionLabel: actionLabel || 'Explore Markets',
      actionHref: actionHref || '/services/shopping',
    },
    wishlist: {
      icon: <Heart className="w-10 h-10 text-rose-500" />,
      title: title || 'Your Wishlist is Empty',
      description: description || 'Save your favorite items here to easily order them whenever you need.',
      actionLabel: actionLabel || 'Browse Products',
      actionHref: actionHref || '/services/shopping',
    },
    search: {
      icon: <Search className="w-10 h-10 text-amber-500" />,
      title: title || 'No Results Found',
      description: description || 'We couldn’t find anything matching your search query. Try searching with different keywords.',
      actionLabel: actionLabel || 'Clear Search',
      actionHref: actionHref || '/services/shopping',
    },
    address: {
      icon: <MapPin className="w-10 h-10 text-[#0E7A45]" />,
      title: title || 'No Saved Delivery Addresses',
      description: description || 'Add your DOHS house, road, and sector address to enable quick 1-click checkout.',
      actionLabel: actionLabel || 'Add Address',
      actionHref: actionHref || '/profile/addresses',
    },
    generic: {
      icon: <AlertCircle className="w-10 h-10 text-slate-400" />,
      title: title || 'No Data Available',
      description: description || 'There is no information to display here at the moment.',
      actionLabel: actionLabel || 'Return to Home',
      actionHref: actionHref || '/',
    },
  };

  const current = configs[type];

  return (
    <div className="w-full py-14 px-6 text-center flex flex-col items-center justify-center space-y-4 bg-slate-50/60 rounded-3xl border border-slate-100/80 shadow-2xs max-w-lg mx-auto">
      <div className="p-4 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
        {current.icon}
      </div>

      <div className="space-y-1.5">
        <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">
          {current.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
          {current.description}
        </p>
      </div>

      {(current.actionLabel || onAction) && (
        <div className="pt-2">
          {onAction ? (
            <button
              onClick={onAction}
              className="px-5 py-2.5 rounded-xl bg-[#0E7A45] text-white font-bold text-xs shadow-md hover:bg-[#095A32] transition-colors cursor-pointer"
            >
              {current.actionLabel}
            </button>
          ) : (
            <Link
              href={current.actionHref}
              className="inline-block px-5 py-2.5 rounded-xl bg-[#0E7A45] text-white font-bold text-xs shadow-md hover:bg-[#095A32] transition-colors"
            >
              {current.actionLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
