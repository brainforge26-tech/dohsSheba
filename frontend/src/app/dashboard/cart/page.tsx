'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/cn';
import { CustomerEmptyState } from '@/components/dashboard/customer/CustomerEmptyState';
import { useCartStore } from '@/store/useCartStore';
import {
  ShoppingCart,
  Trash2,
  Bookmark,
  Plus,
  Minus,
  Tag,
  ArrowRight,
} from 'lucide-react';

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'RESIDENT50') {
      setAppliedDiscount(50);
      setCouponMsg('৳50 Resident Coupon Applied!');
    } else if (couponCode.toUpperCase() === 'DOHS100') {
      setAppliedDiscount(100);
      setCouponMsg('৳100 DOHS Super Coupon Applied!');
    } else {
      setCouponMsg('Invalid coupon code. Try RESIDENT50 or DOHS100');
    }
  };

  const subtotal = getSubtotal();
  const shipping = cartItems.length > 0 ? 60 : 0;
  const tax = subtotal * 0.05;
  const total = Math.max(0, subtotal + shipping + tax - appliedDiscount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-cyan-400" /> Shopping Cart
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Review items in your cart, apply discount coupons, and proceed to checkout</p>
      </div>

      {cartItems.length === 0 ? (
        <CustomerEmptyState
          icon={ShoppingCart}
          title="Your Cart is Empty"
          description="Looks like you haven't added any items to your shopping cart yet."
          actionText="Start Shopping"
          actionHref="/services/shopping"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="rounded-2xl bg-[#1e1f32] border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                    {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      product.image || '📦'
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{product.title}</h3>
                    <p className="text-xs text-slate-400">Seller: <span className="text-indigo-300">{product.shopName || 'DOHS Seller'}</span></p>
                    <p className="text-xs font-black text-emerald-400 mt-1">৳{formatCurrency(product.price)}</p>
                  </div>
                </div>

                {/* Quantity Controls & Action Buttons */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeItem(product.id)}
                      title="Remove Item"
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout & Coupon Sidebar Summary */}
          <div className="space-y-4">
            {/* Coupon Code Card */}
            <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" /> Apply Coupon
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. RESIDENT50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white uppercase placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs ${appliedDiscount > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400'}`}>
                  {couponMsg}
                </p>
              )}
            </div>

            {/* Price Summary Card */}
            <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-5 space-y-3">
              <h3 className="font-bold text-white text-sm mb-2">Order Summary</h3>

              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">৳{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Shipping Charge</span>
                <span className="text-white font-semibold">৳{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Estimated Tax (5%)</span>
                <span className="text-white font-semibold">৳{formatCurrency(tax)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-400 font-bold">
                  <span>Coupon Discount</span>
                  <span>-৳{formatCurrency(appliedDiscount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between text-base font-black text-white">
                <span>Total</span>
                <span className="text-emerald-400">৳{formatCurrency(total)}</span>
              </div>

              <Link
                href="/services/shopping/checkout"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
