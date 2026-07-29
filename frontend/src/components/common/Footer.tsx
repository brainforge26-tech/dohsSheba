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

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top Value Proposition Bar */}
      <div className="border-b border-slate-800 py-8 px-4 bg-slate-900/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Verified Professionals</h4>
              <p className="text-xs text-slate-400">Background checked technicians</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Fast DOHS Delivery</h4>
              <p className="text-xs text-slate-400">Groceries delivered in 45 mins</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Secure Payments</h4>
              <p className="text-xs text-slate-400">SSLCommerz, bKash & Cash on Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">24/7 DOHS Support</h4>
              <p className="text-xs text-slate-400">Dedicated resident customer help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand & Newsletter */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              dS
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                dohsSheba
              </span>
              <span className="block text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                Home Services & Shopping Platform
              </span>
            </div>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            dohsSheba is the premier hyper-local marketplace dedicated to DOHS residents. From electrical repairs and AC servicing to fresh daily vegetables and groceries delivered to your door.
          </p>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white block">
              Subscribe for Weekly DOHS Deals & Discounts
            </label>
            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 flex-shrink-0">
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Home Services Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider text-xs">
            Home Services
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/services/home-service/ac-service" className="hover:text-blue-400 transition-colors">
                AC Servicing & Gas Refill
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/electrician" className="hover:text-blue-400 transition-colors">
                Electrician & Wiring
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/plumber" className="hover:text-blue-400 transition-colors">
                Plumbing & Leak Repair
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/cleaner" className="hover:text-blue-400 transition-colors">
                House & Sofa Deep Cleaning
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/pest-control" className="hover:text-blue-400 transition-colors">
                Pest Control Treatment
              </Link>
            </li>
            <li>
              <Link href="/services/home-service/carpenter" className="hover:text-blue-400 transition-colors">
                Furniture & Woodworking
              </Link>
            </li>
          </ul>
        </div>

        {/* Shopping Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider text-xs">
            Daily Shopping
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/services/shopping/vegetables" className="hover:text-emerald-400 transition-colors">
                Fresh Vegetables
              </Link>
            </li>
            <li>
              <Link href="/services/shopping/fruits" className="hover:text-emerald-400 transition-colors">
                Organic Fruits
              </Link>
            </li>
            <li>
              <Link href="/services/shopping/meat" className="hover:text-emerald-400 transition-colors">
                Fresh Meat & Poultry
              </Link>
            </li>
            <li>
              <Link href="/services/shopping/fish" className="hover:text-emerald-400 transition-colors">
                Fresh River Fish
              </Link>
            </li>
            <li>
              <Link href="/services/shopping/dairy" className="hover:text-emerald-400 transition-colors">
                Milk & Dairy Products
              </Link>
            </li>
            <li>
              <Link href="/services/shopping/rice" className="hover:text-emerald-400 transition-colors">
                Rice, Oil & Spices
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="font-bold text-sm text-white uppercase tracking-wider text-xs">
            Contact DOHS Hub
          </h4>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>House 14, Road 3, Mohakhali DOHS, Dhaka 1206</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>+880 1700-112233</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>support@dohssheba.com</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="text-[11px] font-semibold text-slate-400 mb-1">We Accept:</div>
            <div className="flex items-center gap-1.5 font-bold text-[10px] text-slate-300">
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">bKash</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">Nagad</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">SSLCommerz</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">COD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-6 px-4 text-xs text-center text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} dohsSheba Ltd. All rights reserved. Designed for DOHS Community.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/faq" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              Refund & Cancellation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
