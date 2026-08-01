'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductItem } from '@/types/shopping';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatCurrency } from '@/utils/cn';
import {
  Star,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Store,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: ProductItem;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // Save viewed product to recently-viewed localStorage history
  React.useEffect(() => {
    if (!product || !product.id) return;
    try {
      const stored = localStorage.getItem('dohssheba-recently-viewed');
      const list = stored ? JSON.parse(stored) : [];
      const itemToSave = {
        id: product.id,
        name: product.title || (product as any).name,
        price: product.price,
        seller: product.shopName || 'DOHS Market',
        image: product.image,
        rating: product.rating || 4.8,
        slug: product.slug,
      };
      const filtered = list.filter((item: any) => item.id !== product.id);
      const updated = [itemToSave, ...filtered].slice(0, 10);
      localStorage.setItem('dohssheba-recently-viewed', JSON.stringify(updated));
    } catch (_) {}
  }, [product]);

  const isFavorite = isInWishlist(product.id);
  const images = product.galleryImages || [product.image];

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/services/shopping" className="hover:text-emerald-600">Shopping</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/services/shopping/${product.categorySlug}`} className="hover:text-emerald-600">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-bold">{product.title}</span>
      </nav>

      {/* Main Product Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xl">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-secondary border border-border">
            <Image
              src={images[activeImageIndex] || product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-2.5 rounded-full transition-all shadow-md ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-background/80 backdrop-blur-md text-muted-foreground hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-emerald-600 scale-105 shadow-md'
                      : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={product.title} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Buying Controls */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-600 uppercase tracking-wider">
                {product.categoryName}
              </span>
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-muted-foreground font-normal">({product.reviewCount} Reviews)</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Sold by: <strong className="text-foreground">{product.shopName}</strong></span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">In Stock ({product.stock} items)</span>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/60 border border-border flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-600">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span className="text-xs text-muted-foreground">/ {product.unit}</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {product.description || 'Fresh grocery item delivered directly from DOHS bazaar shops in 45 minutes.'}
            </p>

            {/* Quantity Stepper */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quantity
              </span>
              <div className="flex items-center gap-2 border border-border rounded-xl p-1 bg-secondary/50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg hover:bg-background text-foreground"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold px-3 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg hover:bg-background text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions & Delivery Guarantee */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket ({formatCurrency(product.price * quantity)})</span>
              </button>
              <Link
                href="/services/shopping/checkout"
                onClick={handleAddToCart}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm text-center shadow-md transition-all hover:opacity-95"
              >
                Buy Now Express
              </Link>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Truck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              <span>45-Minute Doorstep Delivery within Mohakhali, Baridhara & Mirpur DOHS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
