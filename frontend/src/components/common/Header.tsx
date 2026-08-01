'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Wrench,
  ShoppingBag,
  Search,
  MapPin,
  PhoneCall,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap,
  Carrot,
  ShieldCheck,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/constants/services';
import { SHOPPING_CATEGORIES } from '@/constants/products';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useSiteSettingsStore } from '@/store/useSiteSettingsStore';

import { useEffect } from 'react';

export function Header() {
  const { siteName } = useSiteSettingsStore();
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState('Savar DOHS');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<'services' | 'shopping' | null>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState<'service' | 'shopping' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'services' | 'shopping'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const { getTotalCount, openCart } = useCartStore();
  const { user, role, logout } = useAuthStore();
  const { language, toggleLanguage } = useLanguageStore();
  const cartCount = getTotalCount();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border transition-all">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-medium text-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Location:</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              >
                <option value="Savar DOHS" className="bg-slate-900">Savar DOHS</option>
              </select>
            </div>
            <span className="hidden sm:inline text-slate-500">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>DOHS Helpline: <strong>09612-DOHS-SHEBA</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/offers"
              className="flex items-center gap-1 font-bold text-amber-300 hover:underline text-[11px]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Offers & Coupons</span>
            </Link>

            <span className="text-slate-500">|</span>

            {/* Language Toggle EN / BN */}
            <button
              onClick={() => toggleLanguage()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-all border border-white/20 active:scale-95"
              title="Toggle English / Bangla"
            >
              <span>{language === 'EN' ? '🇧🇩 বাংলা' : '🇺🇸 English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            dS
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {siteName}
            </span>
            <span className="block text-[10px] font-medium text-muted-foreground -mt-1 tracking-wider uppercase">
              Services & Grocery
            </span>
          </div>
        </Link>

        {/* Global Live Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xl items-center relative">
          <div className="flex w-full items-center border border-border rounded-2xl bg-secondary/50 focus-within:ring-2 focus-within:ring-primary focus-within:bg-background transition-all overflow-hidden shadow-sm">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value as any)}
              className="bg-transparent text-xs font-semibold px-3 py-2.5 border-r border-border focus:outline-none text-muted-foreground cursor-pointer"
            >
              <option value="all">All Market</option>
              <option value="services">Home Services</option>
              <option value="shopping">Groceries</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Electrician, AC Repair, Fresh Fruits, Rice..."
              className="w-full bg-transparent px-3.5 py-2.5 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
            <Link
              href={`/search?q=${encodeURIComponent(searchQuery)}&cat=${searchCategory}`}
              className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Mega Menu Triggers */}
          <div className="hidden md:flex items-center gap-1">
            <div className="relative" onMouseLeave={() => setMegaMenuOpen(null)}>
              <button
                onMouseEnter={() => setMegaMenuOpen('service')}
                onClick={() => setMegaMenuOpen(megaMenuOpen === 'service' ? null : 'service')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
              >
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Home Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {/* Home Services Dropdown */}
              {megaMenuOpen === 'service' && (
                <div className="absolute top-full left-0 pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 bg-background border border-border rounded-2xl shadow-xl">
                    <div className="text-xs font-bold text-muted-foreground px-3 py-1 uppercase tracking-wider">
                      Service Categories
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {SERVICE_CATEGORIES.slice(0, 6).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/services/home-service/${cat.slug}`}
                          onClick={() => setMegaMenuOpen(null)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg ${cat.colorBg} ${cat.colorText}`}>
                              <Zap className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-xs group-hover:text-primary transition-colors">
                                {cat.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground truncate max-w-[170px]">
                                {cat.description}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onMouseLeave={() => setMegaMenuOpen(null)}>
              <button
                onMouseEnter={() => setMegaMenuOpen('shopping')}
                onClick={() => setMegaMenuOpen(megaMenuOpen === 'shopping' ? null : 'shopping')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Shopping</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {/* Shopping Dropdown */}
              {megaMenuOpen === 'shopping' && (
                <div className="absolute top-full left-0 pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 bg-background border border-border rounded-2xl shadow-xl">
                    <div className="text-xs font-bold text-muted-foreground px-3 py-1 uppercase tracking-wider">
                      Grocery & Daily Needs
                    </div>
                    <div className="grid grid-cols-1 gap-1 mt-1">
                      {SHOPPING_CATEGORIES.slice(0, 6).map((pcat) => (
                        <Link
                          key={pcat.id}
                          href={`/services/shopping/${pcat.slug}`}
                          onClick={() => setMegaMenuOpen(null)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                              <Carrot className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-xs group-hover:text-emerald-600 transition-colors">
                                {pcat.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {pcat.itemCount} items available
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-all flex items-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span className="hidden sm:inline font-bold text-xs">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-background animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth/Role Indicator */}
          {mounted && user ? (
            <div className="flex items-center gap-2">
              <Link
                href={
                  role === 'ADMIN'
                    ? '/admin/dashboard'
                    : role === 'PROVIDER'
                    ? '/provider/dashboard'
                    : role === 'SELLER'
                    ? '/seller/dashboard'
                    : '/dashboard/customer'
                }
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all"
              >
                <User className="w-4 h-4" />
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-xs">{user.name}</div>
                  <div className="text-[9px] uppercase font-semibold text-primary/80">
                    {role}
                  </div>
                </div>
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-foreground hover:bg-secondary"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services or groceries..."
              className="w-full h-10 px-3.5 pr-10 rounded-xl border border-input text-sm bg-secondary"
            />
            <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
              Categories & Navigation
            </div>

            {/* ── Submenu 1: Home Services Accordion ── */}
            <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/50">
              <button
                type="button"
                onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === 'services' ? null : 'services')}
                className="w-full p-3 flex items-center justify-between font-bold text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span>Home Services</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                    mobileSubmenuOpen === 'services' ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              {mobileSubmenuOpen === 'services' && (
                <div className="px-3 pb-3 space-y-1 bg-secondary/30 border-t border-border/50 animate-in fade-in duration-200 pt-2">
                  {SERVICE_CATEGORIES.map((scat) => (
                    <Link
                      key={scat.id}
                      href={`/services/home-service/${scat.slug}`}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileSubmenuOpen(null);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <span>{scat.name}</span>
                      <span className="text-[10px] font-extrabold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Verified</span>
                    </Link>
                  ))}
                  <Link
                    href="/services/home-service"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileSubmenuOpen(null);
                    }}
                    className="block text-center p-2 rounded-xl bg-primary text-primary-foreground font-black text-xs mt-2"
                  >
                    View All Services ➔
                  </Link>
                </div>
              )}
            </div>

            {/* ── Submenu 2: Grocery & Daily Needs Accordion ── */}
            <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/50">
              <button
                type="button"
                onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === 'shopping' ? null : 'shopping')}
                className="w-full p-3 flex items-center justify-between font-bold text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span>Grocery & Daily Needs</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                    mobileSubmenuOpen === 'shopping' ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>

              {mobileSubmenuOpen === 'shopping' && (
                <div className="px-3 pb-3 space-y-1 bg-secondary/30 border-t border-border/50 animate-in fade-in duration-200 pt-2">
                  {SHOPPING_CATEGORIES.map((pcat) => (
                    <Link
                      key={pcat.id}
                      href={`/services/shopping/${pcat.slug}`}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileSubmenuOpen(null);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-foreground hover:bg-emerald-500/10 hover:text-emerald-600 transition-all"
                    >
                      <span>{pcat.name}</span>
                      <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{pcat.itemCount} Items</span>
                    </Link>
                  ))}
                  <Link
                    href="/services/shopping"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileSubmenuOpen(null);
                    }}
                    className="block text-center p-2 rounded-xl bg-emerald-600 text-white font-black text-xs mt-2"
                  >
                    Explore Full Market ➔
                  </Link>
                </div>
              )}
            </div>

            {/* General Direct Links */}
            <Link
              href="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-secondary text-sm font-bold border border-transparent hover:border-border"
            >
              🔥 Special Offers & Discounts
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-secondary text-sm font-bold border border-transparent hover:border-border"
            >
              About dohsSheba
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-3 rounded-2xl hover:bg-secondary text-sm font-bold border border-transparent hover:border-border"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
