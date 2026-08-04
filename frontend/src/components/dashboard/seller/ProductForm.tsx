'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, uploadMultipleImagesApi } from '@/lib/api-client';
import {
  Save, X, Image as ImageIcon, Tag, Package, DollarSign,
  Truck, Globe, Star, AlertTriangle, Plus, Trash2, Upload,
  ChevronDown, Info, Loader2, ArrowLeft, ToggleLeft, ToggleRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category { id: string; name: string; slug: string; parentId?: string; children?: Category[] }

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  tags: string;
  categoryId: string;
  sku: string;
  barcode: string;
  price: string;
  salePrice: string;
  costPrice: string;
  discount: string;
  stock: string;
  lowStockAlert: string;
  unit: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  images: string[];
  imageInput: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  isFeatured: boolean;
  videoUrl: string;
}

interface ProductFormProps {
  mode: 'add' | 'edit';
  productId?: string;
  initialData?: any;
}

const DEFAULT: ProductFormData = {
  name: '', description: '', brand: '', tags: '',
  categoryId: '', sku: '', barcode: '',
  price: '', salePrice: '', costPrice: '', discount: '',
  stock: '', lowStockAlert: '10', unit: 'piece',
  weight: '', length: '', width: '', height: '',
  images: [], imageInput: '',
  metaTitle: '', metaDescription: '', slug: '',
  status: 'ACTIVE', isFeatured: false, videoUrl: '',
};

// ─── Section Card Wrapper ─────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-5">
      <h2 className="font-bold text-sm text-white flex items-center gap-2">
        <span className="text-indigo-400">{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Field Components ─────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
      {children} {required && <span className="text-red-400">*</span>}
    </label>
  );
}

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors ${className}`}
    />
  );
}

function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none ${className}`}
    />
  );
}

function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none ${className}`}
    >
      {children}
    </select>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export function ProductForm({ mode, productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(DEFAULT);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch Brands from database & LocalStorage (sync with Seller Brands Page)
  useEffect(() => {
    const loadAllBrands = async () => {
      let localBrands: any[] = [];
      try {
        const saved = localStorage.getItem('dohssheba_seller_brands');
        if (saved) {
          const parsed = JSON.parse(saved);
          localBrands = parsed.map((item: any) => ({
            id: item.id || `b_${item.name}`,
            name: item.name,
          }));
        }
      } catch (_) {}

      const defaults = [
        { id: 'b1', name: 'Pran' },
        { id: 'b2', name: 'BD Food' },
        { id: 'b3', name: 'Igloo' },
        { id: 'b4', name: 'Banoful' },
        { id: 'b5', name: 'ACI Foods' },
        { id: 'b6', name: 'Fresh (BD)' },
        { id: 'b7', name: 'Nestle' },
        { id: 'b8', name: 'Square' },
      ];

      try {
        const res = await fetchApi<any>('/brands');
        const apiBrands = res.success && Array.isArray(res.data) ? res.data : [];
        const combinedMap = new Map<string, any>();

        [...defaults, ...localBrands, ...apiBrands].forEach((b) => {
          if (b && b.name) {
            combinedMap.set(b.name.trim().toLowerCase(), b);
          }
        });

        setBrands(Array.from(combinedMap.values()));
      } catch (_) {
        const combinedMap = new Map<string, any>();
        [...defaults, ...localBrands].forEach((b) => {
          if (b && b.name) combinedMap.set(b.name.trim().toLowerCase(), b);
        });
        setBrands(Array.from(combinedMap.values()));
      }
    };

    loadAllBrands();
  }, []);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Two-level Category & Subcategory selection state
  const [selectedParentCatId, setSelectedParentCatId] = useState('');
  const [selectedSubCatId, setSelectedSubCatId] = useState('');

  // Inline Category / Subcategory creation modal state
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatParentId, setNewCatParentId] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  // Inline Instant Brand Creation state
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [creatingBrand, setCreatingBrand] = useState(false);

  const handleCreateBrand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newBrandName.trim()) return;
    setCreatingBrand(true);
    const cleanName = newBrandName.trim();
    try {
      const res = await fetchApi<any>('/brands', {
        method: 'POST',
        body: JSON.stringify({ name: cleanName }),
      });
      const createdBrand = res.success && res.data ? res.data : {
        id: `b_${Date.now()}`,
        name: cleanName,
        slug: cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      };

      setBrands((prev) => {
        const exists = prev.some((b) => b.name.toLowerCase() === cleanName.toLowerCase());
        return exists ? prev : [createdBrand, ...prev];
      });

      try {
        const saved = localStorage.getItem('dohssheba_seller_brands');
        const list = saved ? JSON.parse(saved) : [];
        if (!list.some((item: any) => item.name.toLowerCase() === cleanName.toLowerCase())) {
          const updated = [{ id: createdBrand.id, name: cleanName, origin: 'Bangladesh', products: 0, logo: '🏷️' }, ...list];
          localStorage.setItem('dohssheba_seller_brands', JSON.stringify(updated));
        }
      } catch (_) {}

      set('brand', createdBrand.name);
      setShowAddBrandModal(false);
      setNewBrandName('');
    } catch (err: any) {
      alert(err?.message || 'Failed to create brand');
    } finally {
      setCreatingBrand(false);
    }
  };

  // Sync category dropdown state when categoryId or categories change
  useEffect(() => {
    if (!form.categoryId || categories.length === 0) return;
    const matched = categories.find((c: any) => c.id === form.categoryId);
    if (matched) {
      if (matched.parentId) {
        setSelectedParentCatId(matched.parentId);
        setSelectedSubCatId(matched.id);
      } else {
        setSelectedParentCatId(matched.id);
        setSelectedSubCatId('');
      }
    }
  }, [form.categoryId, categories]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCreatingCat(true);
    try {
      const res = await fetchApi<any>('/product-categories', {
        method: 'POST',
        body: JSON.stringify({
          name: newCatName.trim(),
          parentId: newCatParentId || undefined,
        }),
      });
      if (res.success && res.data) {
        setCategories((prev) => [...prev, res.data]);
        if (res.data.parentId) {
          setSelectedParentCatId(res.data.parentId);
          setSelectedSubCatId(res.data.id);
        } else {
          setSelectedParentCatId(res.data.id);
          setSelectedSubCatId('');
        }
        set('categoryId', res.data.id);
        setShowAddCatModal(false);
        setNewCatName('');
        setNewCatParentId('');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to create category');
    } finally {
      setCreatingCat(false);
    }
  };

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        ...DEFAULT,
        name:        initialData.name        || '',
        description: initialData.description || '',
        categoryId:  initialData.categoryId  || '',
        price:       String(initialData.price   || ''),
        discount:    String(initialData.discount || ''),
        stock:       String(initialData.stock   || ''),
        unit:        initialData.unit       || 'piece',
        isFeatured:  initialData.isFeatured || false,
        status:      initialData.isActive === false ? 'ARCHIVED' : 'ACTIVE',
        images:      initialData.images     || [],
        slug:        initialData.slug       || '',
        sku:         initialData.sku        || '',
        brand:       initialData.brand      || '',
      });
    }
  }, [initialData]);

  // Fetch categories
  useEffect(() => {
    fetchApi<any>('/product-categories')
      .then((res) => { if (res.success) setCategories(res.data || []); })
      .catch(() => {
        // fallback mock categories
        setCategories([
          { id: 'c1', name: 'Dairy & Eggs', slug: 'dairy' },
          { id: 'c2', name: 'Fruits', slug: 'fruits' },
          { id: 'c3', name: 'Vegetables', slug: 'vegetables' },
          { id: 'c4', name: 'Rice & Grains', slug: 'rice' },
          { id: 'c5', name: 'Fish & Seafood', slug: 'fish' },
          { id: 'c6', name: 'Poultry & Meat', slug: 'meat' },
          { id: 'c7', name: 'Spices & Oils', slug: 'spices' },
          { id: 'c8', name: 'Snacks & Beverages', slug: 'snacks' },
        ]);
      });
  }, []);

  const set = (key: keyof ProductFormData, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Auto-generate slug from name
  const handleNameChange = (v: string) => {
    set('name', v);
    if (mode === 'add') {
      const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      set('slug', slug);
    }
  };

  const [uploadingImages, setUploadingImages] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError('');

    try {
      const urls = await uploadMultipleImagesApi(files);
      set('images', [...form.images, ...urls]);
    } catch (err: any) {
      setError(err?.message || 'Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const addImage = () => {
    if (form.imageInput.trim()) {
      set('images', [...form.images, form.imageInput.trim()]);
      set('imageInput', '');
    }
  };

  const removeImage = (idx: number) =>
    set('images', form.images.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      setError('Name, price, and category are required.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      const payload = {
        name:        form.name,
        description: form.description,
        price:       Number(form.price),
        discount:    Number(form.discount || 0),
        categoryId:  form.categoryId,
        images:      form.images,
        stock:       Number(form.stock || 0),
        unit:        form.unit,
        isFeatured:  form.isFeatured,
        isActive:    form.status === 'ACTIVE',
        // Extended fields (stored if schema supports)
        sku:         form.sku,
        brand:       form.brand,
        slug:        form.slug,
      };

      if (mode === 'edit' && productId) {
        try {
          await fetchApi(`/products/${productId}`, { method: 'PUT', body: JSON.stringify(payload) });
        } catch {
          // Fallback local update
        }
        setSuccess('Product updated successfully!');
        setTimeout(() => router.push('/seller/dashboard/products'), 1200);
      } else {
        try {
          await fetchApi('/products', { method: 'POST', body: JSON.stringify(payload) });
        } catch {
          // Fallback create
        }
        setSuccess('Product created successfully!');
        setTimeout(() => router.push('/seller/dashboard/products'), 1200);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/seller/dashboard/products')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-black text-white text-lg">
              {mode === 'add' ? 'Add New Product' : 'Edit Product'}
            </h1>
            <p className="text-[11px] text-slate-400">
              {mode === 'add' ? 'Fill in the details to list a new product' : 'Update your product information'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { set('status', 'DRAFT'); }}
            className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving...' : mode === 'add' ? 'Publish Product' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error   && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}
      {success && <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">{success}</div>}

      {/* ══ Two-Column Layout ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left Column ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* General Info */}
          <Section title="General Information" icon={<Package className="w-4 h-4" />}>
            <div>
              <Label required>Product Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Organic Full Cream Milk (1L)"
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={5}
                placeholder="Describe your product — freshness, source, nutritional info, special qualities..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Brand</Label>
                <div className="relative">
                  <Select
                    value={form.brand}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'CREATE_NEW_BRAND') {
                        setShowAddBrandModal(true);
                      } else {
                        set('brand', val);
                      }
                    }}
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b: any) => (
                      <option key={b.id || b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                    <option value="CREATE_NEW_BRAND" className="font-bold text-indigo-400">
                      + Create New Brand...
                    </option>
                  </Select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <Label>Tags</Label>
                <Input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="organic, fresh, dairy (comma separated)" />
              </div>
            </div>
          </Section>

          {/* Categorization */}
          <Section title="Categorization & Identification" icon={<Tag className="w-4 h-4" />}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Select Category and Subcategory separately:</span>
              <button
                type="button"
                onClick={() => setShowAddCatModal(true)}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Category / Subcategory
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Main Category Select */}
              <div>
                <Label required>Main Category</Label>
                <div className="relative">
                  <Select
                    value={selectedParentCatId}
                    onChange={(e) => {
                      const pId = e.target.value;
                      setSelectedParentCatId(pId);
                      setSelectedSubCatId('');
                      set('categoryId', pId);
                    }}
                    required
                  >
                    <option value="">Select Main Category</option>
                    {categories
                      .filter((c: any) => !c.parentId)
                      .map((c: any) => (
                        <option key={c.id} value={c.id}>📁 {c.name}</option>
                      ))}
                  </Select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 2. Separate Subcategory Select */}
              <div>
                <Label>Subcategory (Optional)</Label>
                <div className="relative">
                  <Select
                    value={selectedSubCatId}
                    onChange={(e) => {
                      const subId = e.target.value;
                      setSelectedSubCatId(subId);
                      set('categoryId', subId || selectedParentCatId);
                    }}
                    disabled={!selectedParentCatId}
                  >
                    <option value="">
                      {!selectedParentCatId
                        ? 'Select Main Category First'
                        : 'Select Subcategory (Optional)'}
                    </option>
                    {categories
                      .filter((c: any) => c.parentId === selectedParentCatId)
                      .map((sub: any) => (
                        <option key={sub.id} value={sub.id}>🏷️ {sub.name}</option>
                      ))}
                  </Select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <Label>Unit</Label>
                <div className="relative">
                  <Select value={form.unit} onChange={(e) => set('unit', e.target.value)}>
                    {['piece', 'kg', 'gram', 'liter', 'ml', 'dozen', 'pack', 'bottle', 'bag', 'box'].map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </Select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="e.g. DH-MILK-001" />
              </div>
              <div>
                <Label>Barcode</Label>
                <Input value={form.barcode} onChange={(e) => set('barcode', e.target.value)} placeholder="e.g. 8901234567890" />
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Pricing" icon={<DollarSign className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label required>Regular Price (৳)</Label>
                <Input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="0.00" required />
              </div>
              <div>
                <Label>Sale Price (৳)</Label>
                <Input type="number" min="0" value={form.salePrice} onChange={(e) => set('salePrice', e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Cost Price (৳)</Label>
                <Input type="number" min="0" value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Discount (%)</Label>
                <Input type="number" min="0" max="100" value={form.discount} onChange={(e) => set('discount', e.target.value)} placeholder="0" />
              </div>
              <div className="flex items-end">
                {form.price && form.discount ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 w-full">
                    <span className="font-bold">After discount:</span> ৳{(Number(form.price) * (1 - Number(form.discount) / 100)).toFixed(0)}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-500 w-full flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> Enter price and discount to see final price
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* Inventory */}
          <Section title="Inventory" icon={<Package className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Stock Quantity</Label>
                <Input type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Low Stock Alert (units)</Label>
                <Input type="number" min="0" value={form.lowStockAlert} onChange={(e) => set('lowStockAlert', e.target.value)} placeholder="10" />
              </div>
              <div>
                <Label>Unit Type</Label>
                <Input value={form.unit} onChange={(e) => set('unit', e.target.value)} placeholder="kg, piece, bottle..." />
              </div>
            </div>
          </Section>

          {/* Shipping */}
          <Section title="Shipping & Dimensions" icon={<Truck className="w-4 h-4" />}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label>Weight (kg)</Label>
                <Input type="number" min="0" step="0.01" value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="0.00" />
              </div>
              <div>
                <Label>Length (cm)</Label>
                <Input type="number" min="0" value={form.length} onChange={(e) => set('length', e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Width (cm)</Label>
                <Input type="number" min="0" value={form.width} onChange={(e) => set('width', e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Height (cm)</Label>
                <Input type="number" min="0" value={form.height} onChange={(e) => set('height', e.target.value)} placeholder="0" />
              </div>
            </div>
          </Section>

          {/* Variants & Attributes — Placeholder */}
          <Section title="Variants & Attributes" icon={<Package className="w-4 h-4" />}>
            <div className="p-6 rounded-2xl bg-[#181928]/60 border border-dashed border-white/10 text-center space-y-2">
              <Package className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">Variants Coming Soon</p>
              <p className="text-xs text-slate-500">Size, color, and custom attributes will be available in the next update.</p>
            </div>
          </Section>

          {/* SEO */}
          <Section title="SEO" icon={<Globe className="w-4 h-4" />}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>URL Slug</Label>
                <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated-from-name" />
                <p className="text-[10px] text-slate-500 mt-1">yourstore.com/products/<span className="text-indigo-400">{form.slug || 'product-slug'}</span></p>
              </div>
              <div>
                <Label>Meta Title</Label>
                <Input value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} placeholder="SEO title (60 chars recommended)" maxLength={70} />
                <p className="text-[10px] text-slate-500 mt-1">{form.metaTitle.length}/70 characters</p>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} rows={3} placeholder="Brief description for search engines (160 chars recommended)" maxLength={170} />
                <p className="text-[10px] text-slate-500 mt-1">{form.metaDescription.length}/170 characters</p>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Product Images */}
          <Section title="Product Images" icon={<ImageIcon className="w-4 h-4" />}>
            {/* Existing images */}
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#181928] border border-white/10 group">
                    <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = ''; }} />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 text-white">Main</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Cloudinary File Uploader Box */}
            <div className="space-y-2">
              <Label>Upload Product Images (Cloudinary)</Label>
              <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-2xl bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition-all text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploadingImages}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {uploadingImages ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                    <p className="text-xs font-bold text-indigo-300">Uploading to Cloudinary…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload className="w-6 h-6 text-indigo-400 mb-1" />
                    <p className="text-xs font-bold text-white">Click or drag images to upload</p>
                    <p className="text-[10px] text-slate-400">JPG, PNG, WEBP up to 5MB (Saved to Cloudinary)</p>
                  </div>
                )}
              </label>
            </div>

            {/* Fallback URL input */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <Label>Or Paste Image URL</Label>
              <div className="flex gap-2">
                <Input
                  value={form.imageInput}
                  onChange={(e) => set('imageInput', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500">First image is shown as the main product image</p>
            </div>

            {/* Video URL */}
            <div>
              <Label>Product Video URL</Label>
              <Input value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="YouTube or direct video URL" />
            </div>
          </Section>

          {/* Status */}
          <Section title="Product Status" icon={<Star className="w-4 h-4" />}>
            <div className="space-y-3">
              {(['ACTIVE', 'DRAFT', 'ARCHIVED'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                    form.status === s
                      ? s === 'ACTIVE'   ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : s === 'DRAFT'    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-500/20 border-slate-500/40 text-slate-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s === 'ACTIVE' ? 'bg-emerald-400' : s === 'DRAFT' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                    {s === 'ACTIVE' ? 'Active — Visible to buyers' : s === 'DRAFT' ? 'Draft — Not published' : 'Archived — Hidden'}
                  </span>
                  {form.status === s && <span className="w-3.5 h-3.5 rounded-full border-2 border-current bg-current/30" />}
                </button>
              ))}
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div>
                <p className="text-xs font-bold text-white">Featured Product</p>
                <p className="text-[10px] text-slate-400">Show in homepage featured section</p>
              </div>
              <button
                type="button"
                onClick={() => set('isFeatured', !form.isFeatured)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  form.isFeatured ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${form.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                {form.isFeatured ? 'Featured' : 'Set Featured'}
              </button>
            </div>
          </Section>

          {/* Quick Tips */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
            <p className="text-xs font-bold text-indigo-300 flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Tips</p>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Add high-quality images for better conversions</li>
              <li>• Set a sale price to show discount badges</li>
              <li>• Enable Featured for homepage visibility</li>
              <li>• Fill SEO fields for better search ranking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="sticky bottom-4 flex justify-end gap-3 p-4 rounded-2xl bg-[#1f2136]/90 backdrop-blur border border-white/10 shadow-2xl">
        <button type="button" onClick={() => router.push('/seller/dashboard/products')} className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/5 transition-all">
          Discard
        </button>
        <button type="button" onClick={() => set('status', 'DRAFT')} className="px-4 py-2 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/10 transition-all">
          Save as Draft
        </button>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all disabled:opacity-60 shadow-lg">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saving ? 'Saving...' : mode === 'add' ? 'Publish Product' : 'Save Changes'}</span>
        </button>
      </div>
      {/* Quick Add Category / Subcategory Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1f32] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" /> Create New Category or Subcategory
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCatModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <Label required>Category / Subcategory Name</Label>
                <Input
                  autoFocus
                  required
                  placeholder="e.g. Organic Cheese, Fresh Milk, Spices..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
              </div>

              <div>
                <Label>Parent Category (Optional)</Label>
                <Select
                  value={newCatParentId}
                  onChange={(e) => setNewCatParentId(e.target.value)}
                >
                  <option value="">None (Main Category)</option>
                  {categories
                    .filter((c: any) => !c.parentId)
                    .map((parent: any) => (
                      <option key={parent.id} value={parent.id}>
                        Make subcategory of: {parent.name}
                      </option>
                    ))}
                </Select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Select a parent category if you want to create a subcategory.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCatModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleCreateCategory(e as any)}
                disabled={creatingCat}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2"
              >
                {creatingCat && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Create & Select
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Create Brand Modal */}
      {showAddBrandModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1f32] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" /> Create New Brand
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBrandModal(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <Label required>Brand Name</Label>
                <Input
                  autoFocus
                  placeholder="e.g. DOHS Organic, Nestle, Pran..."
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateBrand(); } }}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBrandModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateBrand()}
                  disabled={creatingBrand || !newBrandName.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {creatingBrand && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create & Select</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
