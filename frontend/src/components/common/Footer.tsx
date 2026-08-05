'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  ShoppingBag,
  MapPin,
  Mail,
  PhoneCall,
  ShieldCheck,
  Headphones,
  Truck,
  CreditCard,
  Heart,
  ArrowRight,
} from 'lucide-react';

import { useSiteSettingsStore } from '@/store/useSiteSettingsStore';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const { siteName } = useSiteSettingsStore();
  const { isBn } = useTranslation();

  return (
    <footer className="bg-white text-slate-700 border-t border-slate-200 font-sans">
      {/* Top Value Proposition Bar */}
      <div className="border-b border-slate-100 py-8 px-2 sm:px-3 bg-slate-50/80">
        <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-[#7eb343]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{isBn ? 'যাচাইকৃত টেকনিশিয়ান' : 'Verified Professionals'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'ব্যাকগ্রাউন্ড চেক সম্পন্ন টেকনিশিয়ান' : 'Background checked technicians'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-[#7eb343]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{isBn ? 'দ্রুত ডিএইচএস ডেলিভারি' : 'Fast DOHS Delivery'}</h4>
              <p className="text-xs text-slate-500">{isBn ? '৪৫ মিনিটে বাসা পর্যন্ত ডেলিভারি' : 'Groceries delivered in 45 mins'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{isBn ? 'নিরাপদ পেমেন্ট' : 'Secure Payments'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'ক্যাশ অন ডেলিভারি ও বিকাশ' : 'Cash on Delivery & bKash'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 text-[#7eb343]">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">{isBn ? '২৪/৭ সাপোর্ট' : '24/7 DOHS Support'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'ডেডিকেটেড রেসিডেন্ট সহায়তা' : 'Dedicated resident customer help'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand & Newsletter */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#7eb343] flex items-center justify-center text-white font-black text-xl shadow-sm">
              {siteName.charAt(0)}
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#7eb343]">
                {siteName}
              </span>
              <span className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Home Services & Shopping Platform
              </span>
            </div>
          </Link>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
            {siteName} is the premier hyper-local marketplace dedicated to DOHS residents. From electrical repairs and AC servicing to fresh daily vegetables and groceries delivered to your door.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              Subscribe for Weekly DOHS Deals & Discounts
            </label>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full h-10 px-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#7eb343]"
              />
              <button className="h-10 px-4 rounded-lg bg-[#7eb343] hover:bg-[#6c9c36] text-white font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Home Services Links */}
        <div className="space-y-3">
          <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
            Home Services
          </h4>
          <ul className="space-y-2 text-xs font-medium text-slate-600">
            <li>
              <Link href="/services/home-service/ac-service" className="hover:text-[#7eb343] transition-colors">
                AC Servicing & Gas Refill
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/electrician" className="hover:text-[#7eb343] transition-colors">
                Electrician & Wiring
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/plumber" className="hover:text-[#7eb343] transition-colors">
                Plumbing & Leak Repair
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/cleaner" className="hover:text-[#7eb343] transition-colors">
                House & Sofa Deep Cleaning
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/pest-control" className="hover:text-[#7eb343] transition-colors">
                Pest Control Treatment
              </Link>
            </li>
          </ul>
        </div>

        {/* Shopping Links */}
        <div className="space-y-3">
          <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
            Daily Shopping
          </h4>
          <ul className="space-y-2 text-xs font-medium text-slate-600">
            <li>
              <Link href="/category/fresh-fruits-vegetables" className="hover:text-[#7eb343] transition-colors">
                Fresh Vegetables & Fruits
              </Link>
            </li>
            <li>
              <Link href="/category/meat-fish-seafood" className="hover:text-[#7eb343] transition-colors">
                Fresh Meat & Poultry
              </Link>
            </li>
            <li>
              <Link href="/category/meat-fish-seafood" className="hover:text-[#7eb343] transition-colors">
                Fresh River Fish
              </Link>
            </li>
            <li>
              <Link href="/category/dairy-eggs-bakery" className="hover:text-[#7eb343] transition-colors">
                Milk & Dairy Products
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-[#7eb343] transition-colors font-extrabold text-[#7eb343] flex items-center gap-1.5 py-0.5">
                <Truck className="w-3.5 h-3.5" /> <span>Track Parcel / Order</span>
              </Link>
            </li>
            <li>
              <Link href="/category/household-daily-cleaning" className="hover:text-[#7eb343] transition-colors">
                Rice, Oil & Spices
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
            Contact DOHS Hub
          </h4>
          <div className="space-y-2.5 text-xs text-slate-600 font-medium">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#7eb343] flex-shrink-0 mt-0.5" />
              <span>Savar DOHS, Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#7eb343] flex-shrink-0" />
              <span>+880 (09612) 238-7908</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#7eb343] flex-shrink-0" />
              <span>support@dohssheba.com</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-500 mb-1">We Accept:</div>
            <div className="flex items-center gap-1.5 font-bold text-[10px] text-slate-700">
              <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded">bKash</span>
              <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded">Nagad</span>
              <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded">Cards</span>
              <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded">COD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-100 py-6 px-2 sm:px-3 text-xs text-center text-slate-500 bg-slate-50">
        <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} dohsSheba Ltd. All rights reserved. Designed for DOHS Community.
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <Link href="/faq" className="hover:text-[#7eb343] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="hover:text-[#7eb343] transition-colors">
              Terms of Service
            </Link>
            <Link href="/faq" className="hover:text-[#7eb343] transition-colors">
              Refund & Cancellation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
