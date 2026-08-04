'use client';

import React, { useState } from 'react';
import { useHomepage } from '@/hooks/useHomepage';
import { HeroSlideData, PromoCardData } from '@/services/homepageService';
import {
  Sliders,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Calendar,
  Save,
  X,
} from 'lucide-react';

export default function AdminHomepageManagementPage() {
  const {
    heroSlides,
    promoCards,
    featuredShortcuts,
    locations,
    isLoading,
    createHero,
    updateHero,
    deleteHero,
    createPromo,
    updatePromo,
    deletePromo,
  } = useHomepage();

  const [activeTab, setActiveTab] = useState<'hero' | 'promo' | 'shortcuts' | 'locations'>('hero');
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [editingHero, setEditingHero] = useState<Partial<HeroSlideData> | null>(null);

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Partial<PromoCardData> | null>(null);

  // Form State for Hero Slide
  const [heroForm, setHeroForm] = useState<Partial<HeroSlideData>>({
    title: '',
    subtitle: '',
    description: '',
    buttonText: 'Order Now',
    buttonLink: '/services/shopping',
    backgroundImage: '',
    badge: '100% Organic',
    discountPercentage: 15,
    isActive: true,
    order: 0,
  });

  // Form State for Promo Card
  const [promoForm, setPromoForm] = useState<Partial<PromoCardData>>({
    title: '',
    subtitle: 'SAVE UP TO 35% ON',
    image: '',
    discount: '-35%',
    buttonText: 'Shop Now',
    buttonUrl: '/services/shopping',
    backgroundColor: '#b5d8f7',
    isActive: true,
    order: 0,
  });

  const handleOpenHeroModal = (slide?: HeroSlideData) => {
    if (slide) {
      setEditingHero(slide);
      setHeroForm(slide);
    } else {
      setEditingHero(null);
      setHeroForm({
        title: '',
        subtitle: '',
        description: '',
        buttonText: 'Order Now',
        buttonLink: '/services/shopping',
        backgroundImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80',
        badge: 'Special Deal',
        discountPercentage: 15,
        isActive: true,
        order: heroSlides.length,
      });
    }
    setShowHeroModal(true);
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHero?.id) {
        await updateHero({ id: editingHero.id, data: heroForm });
      } else {
        await createHero(heroForm);
      }
      setShowHeroModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save slide');
    }
  };

  const handleDeleteHero = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    await deleteHero(id);
  };

  const handleToggleHeroActive = async (slide: HeroSlideData) => {
    await updateHero({ id: slide.id, data: { isActive: !slide.isActive } });
  };

  // Promo Card Actions
  const handleOpenPromoModal = (card?: PromoCardData) => {
    if (card) {
      setEditingPromo(card);
      setPromoForm(card);
    } else {
      setEditingPromo(null);
      setPromoForm({
        title: '',
        subtitle: 'SAVE UP TO 35% ON',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
        discount: '-25%',
        buttonText: 'Shop Now',
        buttonUrl: '/services/shopping',
        backgroundColor: '#b5d8f7',
        isActive: true,
        order: promoCards.length,
      });
    }
    setShowPromoModal(true);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPromo?.id) {
        await updatePromo({ id: editingPromo.id, data: promoForm });
      } else {
        await createPromo(promoForm);
      }
      setShowPromoModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save promo card');
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo card?')) return;
    await deletePromo(id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans text-slate-800">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#7eb343]" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Homepage Management System
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Manage dynamic hero sliders, right-side promotional cards, and location service areas in real-time.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Eye className="w-4 h-4" />
          <span>Live Homepage Preview</span>
        </a>
      </div>

      {/* ── Management Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'hero', label: `Hero Slider (${heroSlides.length})`, icon: Layers },
          { id: 'promo', label: `Promo Cards (${promoCards.length})`, icon: Sparkles },
          { id: 'shortcuts', label: `Shortcuts (${featuredShortcuts.length})`, icon: Tag },
          { id: 'locations', label: `Locations (${locations.length})`, icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#7eb343] text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: HERO SLIDER MANAGEMENT ── */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Dynamic Hero Slides</h2>
            <button
              onClick={() => handleOpenHeroModal()}
              className="px-4 py-2 rounded-xl bg-[#7eb343] hover:bg-[#6c9c36] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroSlides.map((slide) => (
              <div
                key={slide.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={slide.backgroundImage}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      {slide.discountPercentage && (
                        <span className="bg-slate-900 text-white font-black text-[10px] px-2 py-0.5 rounded-md">
                          -{slide.discountPercentage}%
                        </span>
                      )}
                      {slide.badge && (
                        <span className="bg-amber-400 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded-md">
                          {slide.badge}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleHeroActive(slide)}
                      className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer ${
                        slide.isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {slide.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{slide.isActive ? 'Active' : 'Draft'}</span>
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                    {slide.title}
                  </h3>
                  {slide.subtitle && (
                    <p className="text-xs text-slate-500 line-clamp-2">{slide.subtitle}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    Order: #{slide.order}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenHeroModal(slide)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHero(slide.id)}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: PROMO CARDS MANAGEMENT ── */}
      {activeTab === 'promo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Right Side Promo Cards</h2>
            <button
              onClick={() => handleOpenPromoModal()}
              className="px-4 py-2 rounded-xl bg-[#7eb343] hover:bg-[#6c9c36] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Promo Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promoCards.map((card) => (
              <div
                key={card.id}
                style={{ backgroundColor: card.backgroundColor || '#b5d8f7' }}
                className="rounded-2xl p-4 shadow-2xs space-y-3 flex flex-col justify-between min-h-[260px]"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-800">
                    {card.subtitle}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-950">
                    {card.title}
                  </h3>
                </div>

                <div className="h-32 w-full rounded-xl overflow-hidden bg-white/60 p-1">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover rounded-lg" />
                </div>

                <div className="pt-2 border-t border-slate-950/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-slate-900 bg-white/80 px-2 py-0.5 rounded-md">
                    {card.discount || 'Special'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenPromoModal(card)}
                      className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-900 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePromo(card.id)}
                      className="p-1.5 rounded-lg bg-rose-500 text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: HERO SLIDE FORM ── */}
      {showHeroModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingHero?.id ? 'Edit Hero Slide' : 'Create New Hero Slide'}
              </h3>
              <button onClick={() => setShowHeroModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHero} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Slide Title *</label>
                <input
                  type="text"
                  required
                  value={heroForm.title || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  placeholder="e.g. Pure Farm Milk & Organic Daily Eggs"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Tag</label>
                  <input
                    type="text"
                    value={heroForm.badge || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                    placeholder="e.g. Daily Fresh Farm Market"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={heroForm.discountPercentage || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, discountPercentage: parseFloat(e.target.value) })}
                    placeholder="e.g. 15"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Background Image URL *</label>
                <input
                  type="url"
                  required
                  value={heroForm.backgroundImage || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, backgroundImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={heroForm.buttonText || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, buttonText: e.target.value })}
                    placeholder="Order Now"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Link</label>
                  <input
                    type="text"
                    value={heroForm.buttonLink || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, buttonLink: e.target.value })}
                    placeholder="/services/shopping/dairy"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={heroForm.subtitle || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  placeholder="Pure organic dairy delivered straight to your door in 45 minutes."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHeroModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#7eb343] hover:bg-[#6c9c36] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: PROMO CARD FORM ── */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">
                {editingPromo?.id ? 'Edit Promo Card' : 'Create Promo Card'}
              </h3>
              <button onClick={() => setShowPromoModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={promoForm.title || ''}
                  onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                  placeholder="e.g. Energy Drinks"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle Header</label>
                  <input
                    type="text"
                    value={promoForm.subtitle || ''}
                    onChange={(e) => setPromoForm({ ...promoForm, subtitle: e.target.value })}
                    placeholder="SAVE UP TO 35% ON"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={promoForm.backgroundColor || '#b5d8f7'}
                    onChange={(e) => setPromoForm({ ...promoForm, backgroundColor: e.target.value })}
                    className="w-full h-10 p-1 rounded-xl border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={promoForm.image || ''}
                  onChange={(e) => setPromoForm({ ...promoForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7eb343]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#7eb343] hover:bg-[#6c9c36] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Promo Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
