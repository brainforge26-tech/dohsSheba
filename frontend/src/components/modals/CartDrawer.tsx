'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/cn';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal, clearCart } =
    useCartStore();
  const { t, isBn } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 delay-200'
      }`}
    >
      {/* Backdrop Backdrop Fade */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Slide-over Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen max-w-md bg-background shadow-2xl flex flex-col justify-between border-l border-border transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-card shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{isBn ? 'আপনার শপিং বাস্কেট' : 'Your Shopping Basket'}</h2>
                <p className="text-xs text-muted-foreground">
                  {items.length} {isBn ? 'টি পণ্য কার্টে আছে' : items.length === 1 ? 'item in your cart' : 'items in your cart'}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{isBn ? 'আপনার কার্ট খালি' : 'Your cart is empty'}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {isBn ? 'আপনি এখনও কোনো পণ্য কার্টে যুক্ত করেননি।' : "Looks like you haven't added any groceries or daily items yet."}
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                  {isBn ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3 rounded-2xl border border-border/80 bg-card hover:border-primary/30 transition-all"
                >
                  <Link
                    href={`/services/shopping/product/${product.slug || product.id}`}
                    onClick={closeCart}
                    className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0 group"
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/services/shopping/product/${product.slug || product.id}`}
                      onClick={closeCart}
                      className="font-medium text-sm truncate hover:text-primary transition-colors block"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{product.unit}</p>
                    <div className="font-bold text-sm text-primary mt-1">
                      ৳{formatCurrency(product.price * quantity)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 border border-border rounded-xl p-1 bg-secondary/50">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-semibold px-2 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-border bg-card space-y-4 shrink-0">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="font-medium text-foreground">৳{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{isBn ? 'ডেলিভারি চার্জ (ডিএইচএস এলাকা)' : 'Delivery Charge (DOHS Area)'}</span>
                  <span className="font-medium text-foreground">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">{isBn ? 'ফ্রি' : 'FREE'}</span>
                    ) : (
                      `৳${formatCurrency(deliveryFee)}`
                    )}
                  </span>
                </div>
                {subtotal <= 500 && (
                  <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg text-center font-medium">
                    {isBn
                      ? `ফ্রি ডেলিভারির জন্য আরও ৳${formatCurrency(501 - subtotal)} টাকার পণ্য যুক্ত করুন!`
                      : `Add ৳${formatCurrency(501 - subtotal)} more for FREE delivery!`}
                  </p>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                  <span>{isBn ? 'মোট মূল্য' : 'Total Amount'}</span>
                  <span className="text-primary">৳{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={clearCart}
                  className="py-3 px-4 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
                >
                  {isBn ? 'কার্ট খালি করুন' : 'Clear Cart'}
                </button>
                <Link
                  href="/services/shopping/checkout"
                  onClick={closeCart}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md transition-all active:scale-95"
                >
                  <span>{isBn ? 'চেকআউট' : 'Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
