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
interface Brand { id: string; name: string; slug: string }

interface ProductFormData {
  name: string;
  description: string;
  brand: string;
  brandId?: string;
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
  name: '', description: '', brand: '', brandId: '', tags: '',
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
  const [brands, setBrands] = useState<Brand[]>([]);

  const [saving, setSaving] = useState(false);
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

  // Inline Instant Brand Creation modal state
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [creatingBrand, setCreatingBrand] = useState(false);

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
      const createdBrand: Brand = res.success && res.data ? res.data : {
        id: `b_${Date.now()}`,
        name: cleanName,
        slug: cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      };

      setBrands((prev) => {
        const exists = prev.some((b) => b.name.toLowerCase() === cleanName.toLowerCase());
        return exists ? prev : [createdBrand, ...prev];
      });

      // Sync to Brands Page LocalStorage
      try {
        const saved = localStorage.getItem('dohssheba_seller_brands');
        const list = saved ? JSON.parse(saved) : [];
        if (!list.some((item: any) => item.name.toLowerCase() === cleanName.toLowerCase())) {
          const updated = [{ id: createdBrand.id, name: cleanName, origin: 'Bangladesh', products: 0, logo: '🏷️' }, ...list];
          localStorage.setItem('dohssheba_seller_brands', JSON.stringify(updated));
        }
      } catch (_) {}

      set('brand', createdBrand.name);
      set('brandId', createdBrand.id);
      setShowAddBrandModal(false);
      setNewBrandName('');
    } catch (err: any) {
      alert(err?.message || 'Failed to create brand');
    } finally {
      setCreatingBrand(false);
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
        brandId:     initialData.brandId     || '',
        price:       String(initialData.price   || ''),
        discount:    String(initialData.discount || ''),
        stock:       String(initialData.stock   || ''),
        unit:        initialData.unit       || 'piece',
        isFeatured:  initialData.isFeatured || false,
        status:      initialData.isActive === false ? 'ARCHIVED' : 'ACTIVE',
        images:      initialData.images     || [],
        slug:        initialData.slug       || '',
        sku:         initialData.sku        || '',
        brand:       initialData.brand?.name || initialData.brand || '',
      });
    }
  }, [initialData]);

  // Fetch categories
  useEffect(() => {
    fetchApi<any>('/product-categories')
      .then((res) => { if (res.success) setCategories(res.data || []); })
      .catch(() => {
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

  // Fetch Brands from database & LocalStorage (sync with Seller Brands Page)
  useEffect(() => {
    const loadAllBrands = async () => {
      let localBrands: Brand[] = [];
      try {
        const saved = localStorage.getItem('dohssheba_seller_brands');
        if (saved) {
          const parsed = JSON.parse(saved);
          localBrands = parsed.map((item: any) => ({
            id: item.id || `b_${item.name}`,
            name: item.name,
            slug: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          }));
        }
      } catch (err) {
        console.warn('LocalStorage brands error', err);
      }

      const defaults: Brand[] = [
        { id: 'b1', name: 'Pran', slug: 'pran' },
        { id: 'b2', name: 'BD Food', slug: 'bd-food' },
        { id: 'b3', name: 'Igloo', slug: 'igloo' },
        { id: 'b4', name: 'Banoful', slug: 'banoful' },
        { id: 'b5', name: 'ACI Foods', slug: 'aci-foods' },
        { id: 'b6', name: 'Fresh (BD)', slug: 'fresh-bd' },
        { id: 'b7', name: 'Nestle', slug: 'nestle' },
        { id: 'b8', name: 'Square', slug: 'square' },
      ];

      try {
        const res = await fetchApi<any>('/brands');
        const apiBrands: Brand[] = res.success && Array.isArray(res.data) ? res.data : [];
        const combinedMap = new Map<string, Brand>();

        [...defaults, ...localBrands, ...apiBrands].forEach((b) => {
          if (b && b.name) {
            combinedMap.set(b.name.trim().toLowerCase(), b);
          }
        });

        setBrands(Array.from(combinedMap.values()));
      } catch (err) {
        const combinedMap = new Map<string, Brand>();
        [...defaults, ...localBrands].forEach((b) => {
          if (b && b.name) combinedMap.set(b.name.trim().toLowerCase(), b);
        });
        setBrands(Array.from(combinedMap.values()));
      }
    };

    loadAllBrands();
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

  const handleAddImageUrl = () => {
    if (!form.imageInput.trim()) return;
    set('images', [...form.images, form.imageInput.trim()]);
    set('imageInput', '');
  };

  const handleRemoveImage = (idx: number) => {
    set('images', form.images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) return setError('Product name is required');
    if (!form.categoryId) return setError('Please select a category');
    if (!form.price || isNaN(Number(form.price))) return setError('Valid price is required');

    setSaving(true);

    const payload = {
      name:        form.name,
      description: form.description,
      categoryId:  form.categoryId,
      brandId:     form.brandId || undefined,
      brand:       form.brand,
      price:       Number(form.price),
      discount:    Number(form.discount || 0),
      stock:       Number(form.stock || 0),
      unit:        form.unit,
      isFeatured:  form.isFeatured,
      isActive:    form.status === 'ACTIVE',
      images:      form.images,
    };

    try {
      let res: any;
      if (mode === 'add') {
        res = await fetchApi('/products', { method: 'POST', body: JSON.stringify(payload) });
      } else {
        res = await fetchApi(`/products/${productId}`, { method: 'PUT', body: JSON.stringify(payload) });
      }

      if (res.success) {
        setSuccess(mode === 'add' ? 'Product created successfully!' : 'Product updated successfully!');
        setTimeout(() => router.push('/seller/dashboard/products'), 1000);
      } else {
        setError(res.message || 'Operation failed');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 pb-20 font-sans text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2.5 rounded-2xl bg-[#1f2136] border border-white/10 hover:bg-[#282a44] text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {mode === 'add' ? 'Add New Product' : `Edit Product`}
            </h1>
            <p className="text-xs text-slate-400">Fill in the details to publish your product on Savar DOHS Marketplace</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{mode === 'add' ? 'Publish Product' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information */}
          <Section title="General Information" icon={<Package className="w-4 h-4" />}>
            <div>
              <Label required>Product Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Fresh Organic Tomatoes 1kg"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={5}
                placeholder="Describe your product — freshness, source, nutritional info..."
              />
            </div>

            {/* Brand Dropdown & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dynamic Brand Select Dropdown with Instant Brand Creation */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label>Brand</Label>
                  <button
                    type="button"
                    onClick={() => setShowAddBrandModal(true)}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Create Brand
                  </button>
                </div>
                <div className="relative">
                  <Select
                    value={form.brand}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'CREATE_NEW') {
                        setShowAddBrandModal(true);
                      } else {
                        const matched = brands.find((b) => b.name === val);
                        set('brand', val);
                        set('brandId', matched ? matched.id : '');
                      }
                    }}
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        🏷️ {b.name}
                      </option>
                    ))}
                    <option value="CREATE_NEW" className="font-bold text-indigo-400">+ Add / Create New Brand...</option>
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
              <span className="text-xs text-slate-400 font-medium">Select Category and Subcategory:</span>
              <button
                type="button"
                onClick={() => setShowAddCatModal(true)}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Category / Subcategory
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <option value="">Select Subcategory</option>
                    {categories
                      .filter((c: any) => c.parentId === selectedParentCatId)
                      .map((c: any) => (
                        <option key={c.id} value={c.id}>↳ {c.name}</option>
                      ))}
                  </Select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </Section>

          {/* Pricing & Stock */}
          <Section title="Pricing & Inventory" icon={<DollarSign className="w-4 h-4" />}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label required>Price (৳)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={form.discount}
                  onChange={(e) => set('discount', e.target.value)}
                  placeholder="e.g. 15"
                />
              </div>

              <div>
                <Label>Stock Quantity</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Unit of Measurement</Label>
                <Select value={form.unit} onChange={(e) => set('unit', e.target.value)}>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="gram">Gram (g)</option>
                  <option value="liter">Liter (L)</option>
                  <option value="piece">Piece (pc)</option>
                  <option value="pack">Pack</option>
                  <option value="box">Box</option>
                </Select>
              </div>
            </div>
          </Section>

          {/* Product Media */}
          <Section title="Product Images" icon={<ImageIcon className="w-4 h-4" />}>
            <div className="space-y-4">
              {/* File Upload Zone */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-indigo-500/50 bg-[#181928] text-center transition-colors">
                <input
                  type="file"
                  id="product-images-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="product-images-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-indigo-400">Click to upload images</span>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </label>
                {uploadingImages && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-indigo-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading images...</span>
                  </div>
                )}
              </div>

              {/* URL Fallback */}
              <div className="flex gap-2">
                <Input
                  value={form.imageInput}
                  onChange={(e) => set('imageInput', e.target.value)}
                  placeholder="Or paste image URL (https://...)"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  Add Image URL
                </button>
              </div>

              {/* Image Previews */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative h-24 rounded-xl overflow-hidden border border-white/10 group bg-[#181928]">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

        </div>

        {/* Right Column (1 Col Sidebar) */}
        <div className="space-y-6">
          <Section title="Publishing Status" icon={<Globe className="w-4 h-4" />}>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="ACTIVE">🟢 Active (Visible on Market)</option>
                <option value="DRAFT">🟡 Draft (Hidden)</option>
                <option value="ARCHIVED">🔴 Archived</option>
              </Select>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-white block">Featured Product</span>
                <span className="text-[11px] text-slate-400 block">Showcase in top section</span>
              </div>
              <button
                type="button"
                onClick={() => set('isFeatured', !form.isFeatured)}
                className={`p-1 rounded-full transition-colors cursor-pointer ${
                  form.isFeatured ? 'text-indigo-400' : 'text-slate-600'
                }`}
              >
                {form.isFeatured ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
          </Section>
        </div>

      </div>

      {/* ── Modal: Instant Create New Category / Subcategory ── */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1f2136] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" /> Create New Category
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCatModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <Label required>Category Name</Label>
                <Input
                  autoFocus
                  required
                  placeholder="e.g. Organic Cheese, Fresh Milk..."
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
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCat}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  {creatingCat && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Instant Create New Brand ── */}
      {showAddBrandModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1f2136] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" /> Create New Brand
              </h3>
              <button
                type="button"
                onClick={() => setShowAddBrandModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div>
                <Label required>Brand Name</Label>
                <Input
                  type="text"
                  required
                  autoFocus
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. DOHS Organic, Nestle, Pran"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBrandModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBrand || !newBrandName.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {creatingBrand ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Save & Select Brand</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </form>
  );
}
