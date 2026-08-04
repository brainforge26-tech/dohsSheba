'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/utils/cn';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } =
    useCartStore();

  const handleProceedToCheckout = () => {
    closeCart();
    router.push('/services/shopping/checkout');
  };
  const { isBn } = useTranslation();
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
      {/* Backdrop Fade */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Slide-over Container (Flush zero padding on mobile, no right overflow) */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10 z-50">
        <div
          className={`w-screen max-w-[100vw] sm:max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header (Clean padding and flush close X button) */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-[#7eb343] rounded-xl border border-emerald-100">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg text-slate-900">
                  {isBn ? 'আপনার শপিং বাস্কেট' : 'Your Shopping Basket'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {items.length} {isBn ? 'টি পণ্য কার্টে আছে' : items.length === 1 ? 'item in your cart' : 'items in your cart'}
                </p>
              </div>
            </div>

            {/* Flush Close X Button */}
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-800">
                    {isBn ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    {isBn ? 'আপনি এখনও কোনো পণ্য কার্টে যুক্ত করেননি।' : "Looks like you haven't added any groceries or daily items yet."}
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-xl bg-[#7eb343] hover:bg-[#6c9c36] text-white font-bold text-xs transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  {isBn ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl border border-slate-200 bg-white hover:border-[#7eb343]/40 transition-all overflow-hidden"
                >
                  {/* Image */}
                  <Link
                    href={`/services/shopping/product/${product.slug || product.id}`}
                    onClick={closeCart}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 group block"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    <Link
                      href={`/services/shopping/product/${product.slug || product.id}`}
                      onClick={closeCart}
                      className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1 hover:text-[#7eb343] transition-colors block"
                    >
                      {product.title}
                    </Link>
                    <p className="text-[11px] text-slate-400">{product.unit}</p>
                    <div className="font-extrabold text-xs sm:text-sm text-[#7eb343] mt-0.5">
                      ৳{formatCurrency(product.price * quantity)}
                    </div>
                  </div>

                  {/* Quantity Stepper [- 1 +] */}
                  <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-slate-50 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="text-xs font-bold px-1.5 min-w-[16px] text-center text-slate-800">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  {/* Trash Delete Icon */}
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-4 shrink-0">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="font-bold text-slate-900">৳{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>{isBn ? 'ডেলিভারি চার্জ (ডিএইচএস এলাকা)' : 'Delivery Charge (DOHS Area)'}</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? (
                      <span className="text-[#7eb343] font-extrabold">{isBn ? 'ফ্রি' : 'FREE'}</span>
                    ) : (
                      `৳${formatCurrency(deliveryFee)}`
                    )}
                  </span>
                </div>
                {subtotal <= 500 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg text-center font-bold border border-amber-200">
                    {isBn
                      ? `ফ্রি ডেলিভারির জন্য আরও ৳${formatCurrency(501 - subtotal)} টাকার পণ্য যুক্ত করুন!`
                      : `Add ৳${formatCurrency(501 - subtotal)} more for FREE delivery!`}
                  </p>
                )}
                <div className="border-t border-slate-100 pt-2 flex justify-between font-black text-sm sm:text-base">
                  <span className="text-slate-900">{isBn ? 'মোট মূল্য' : 'Total Amount'}</span>
                  <span className="text-[#7eb343]">৳{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3 rounded-xl bg-[#7eb343] hover:bg-[#6c9c36] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <span>{isBn ? 'চেকআউট করুন' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
