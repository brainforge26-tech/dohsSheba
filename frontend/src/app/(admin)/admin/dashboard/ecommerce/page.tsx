'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useLanguageStore } from '@/store/useLanguageStore';
import {
  ShoppingBag, Package, Tag, Store, Search, Filter, Plus,
  Edit2, Trash2, Eye, Download, CheckCircle2, Clock, AlertCircle,
  Truck, ArrowUpRight, Check, X, RefreshCw, Loader2, DollarSign, Bike, UserCheck
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  { id: 'p1', name: 'Organic Full Cream Milk 2L', category: 'Dairy & Eggs', price: 180, stock: 45, seller: 'DOHS Dairy Store', status: 'Active', sales: 120 },
  { id: 'p2', name: 'Premium Basmati Rice 5kg', category: 'Rice & Grains', price: 650, stock: 18, seller: 'Super Bazaar DOHS', status: 'Active', sales: 85 },
  { id: 'p3', name: 'Fresh Hilsa Fish (800g)', category: 'Fish & Seafood', price: 1250, stock: 5, seller: 'Padma Fresh Fish', status: 'Low Stock', sales: 42 },
  { id: 'p4', name: 'Cold Pressed Mustard Oil 1L', category: 'Spices & Oils', price: 320, stock: 0, seller: 'Shuddh Masola Shop', status: 'Out of Stock', sales: 95 },
  { id: 'p5', name: 'Fuji Red Apple 1kg', category: 'Fruits & Veggies', price: 280, stock: 60, seller: 'Green Agro DOHS', status: 'Active', sales: 150 },
];

const INITIAL_CATEGORIES = [
  { id: 'c1', name: 'Dairy & Eggs', slug: 'dairy-eggs', count: 24, status: 'Active' },
  { id: 'c2', name: 'Rice & Grains', slug: 'rice-grains', count: 32, status: 'Active' },
  { id: 'c3', name: 'Fish & Seafood', slug: 'fish-seafood', count: 18, status: 'Active' },
  { id: 'c4', name: 'Spices & Oils', slug: 'spices-oils', count: 40, status: 'Active' },
  { id: 'c5', name: 'Fruits & Veggies', slug: 'fruits-veggies', count: 55, status: 'Active' },
];

import { useSocket } from '@/hooks/useSocket';

export default function AdminEcommercePage() {
  const { language } = useLanguageStore();
  const { socket } = useSocket();
  const isBn = language === 'BN';

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories'>('products');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<any[]>([]);
  const [availableRiders, setAvailableRiders] = useState<any[]>([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Rider assign modal state
  const [assignModalOrder, setAssignModalOrder] = useState<any | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Modal / Action states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Dairy & Eggs');
  const [newProdStock, setNewProdStock] = useState('50');

  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'orders') setActiveTab('orders');
        else if (hash === 'categories') setActiveTab('categories');
        else if (hash === 'products') setActiveTab('products');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Load products + categories
  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      fetchApi<any[]>('/products').catch(() => null),
      fetchApi<any[]>('/product-categories').catch(() => null),
    ]).then(([prodRes, catRes]) => {
      if (prodRes.status === 'fulfilled' && prodRes.value?.success && Array.isArray(prodRes.value.data)) {
        const mapped = prodRes.value.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category?.name || 'General',
          price: p.price || 0,
          stock: p.stock || 0,
          seller: p.sellerProfile?.shopName || 'DOHS Merchant',
          status: p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'Active',
          sales: p.salesCount || Math.floor(Math.random() * 50) + 10,
        }));
        if (mapped.length > 0) setProducts(mapped);
      }
    }).finally(() => setLoading(false));
  }, []);

  // Load orders from admin API (dynamic)
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetchApi<any>('/admin/orders?limit=50').catch(() => null);
      if (res?.success && Array.isArray(res.data)) {
        const mapped = res.data.map((o: any) => ({
          id: o.id,
          displayId: `#ORD-${o.id.slice(-5).toUpperCase()}`,
          customer: o.customer?.name || 'Resident Customer',
          customerPhone: o.customer?.phone || '',
          store: o.items?.[0]?.product?.name ? `${o.items.length} item(s)` : 'DOHS Store',
          items: o.items?.length || 1,
          total: o.totalAmount || 0,
          status: o.status || 'PENDING',
          riderId: o.riderId || null,
          riderName: o.rider?.name || o.riderName || null,
          riderPhone: o.rider?.phone || null,
          date: new Date(o.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          rawData: o,
        }));
        setOrders(mapped);
      }
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Load available riders from admin API (dynamic)
  const loadAvailableRiders = useCallback(async () => {
    try {
      const res = await fetchApi<any>('/admin/riders/available').catch(() => null);
      if (res?.success && Array.isArray(res.data)) {
        setAvailableRiders(res.data);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadOrders();
    loadAvailableRiders();
  }, [loadOrders, loadAvailableRiders]);

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => {
      loadOrders();
      loadAvailableRiders();
    };
    socket.on('ORDER_CREATED', handleRefresh);
    socket.on('ORDER_STATUS_UPDATED', handleRefresh);
    socket.on('RIDER_ACCEPTED', handleRefresh);
    return () => {
      socket.off('ORDER_CREATED', handleRefresh);
      socket.off('ORDER_STATUS_UPDATED', handleRefresh);
      socket.off('RIDER_ACCEPTED', handleRefresh);
    };
  }, [socket, loadOrders, loadAvailableRiders]);

  const handleDeleteProduct = (id: string) => {
    if (!confirm(isBn ? 'আপনি কি এই পণ্যটি মুছে ফেলতে চান?' : 'Delete this product?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // ── Rider Assign ──────────────────────────────────────────────────────────
  const openAssignModal = (order: any) => {
    setAssignModalOrder(order);
    setSelectedRiderId(order.riderId || '');
    setAssignError('');
    loadAvailableRiders();
  };

  const handleAssignRider = async () => {
    if (!selectedRiderId || !assignModalOrder) return;
    setAssigning(true);
    setAssignError('');
    try {
      const res = await fetchApi<any>(`/admin/orders/${assignModalOrder.id}/assign-rider`, {
        method: 'PATCH',
        body: JSON.stringify({ riderId: selectedRiderId }),
      });
      if (res?.success) {
        const assignedRider = availableRiders.find((r: any) => r.id === selectedRiderId);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === assignModalOrder.id
              ? { ...o, riderId: selectedRiderId, riderName: assignedRider?.name || 'Rider', status: 'RIDER_ASSIGNED' }
              : o
          )
        );
        setAssignModalOrder(null);
      } else {
        setAssignError(res?.message || 'Failed to assign rider.');
      }
    } catch {
      setAssignError('Network error. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const handleAddProduct = () => {
    if (!newProdName.trim() || !newProdPrice) return;
    const newP = {
      id: `p_${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory,
      price: Number(newProdPrice),
      stock: Number(newProdStock) || 10,
      seller: 'DOHS Central Store',
      status: 'Active',
      sales: 0,
    };
    setProducts((prev) => [newP, ...prev]);
    setNewProdName('');
    setNewProdPrice('');
    setShowAddModal(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.seller.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.store.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-indigo-400 font-semibold mb-0.5">Admin / Commerce Hub</p>
          <h1 className="font-black text-white text-2xl flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            <span>{isBn ? 'ই-কমার্স কমান্ড সেন্টার' : 'Ecommerce Command Center'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn ? 'ডিএইচএস মার্কেটপ্লেসের পণ্য, অর্ডার এবং ক্যাটালগ সমূহের ওভারভিউ' : 'Comprehensive management of products, marketplace orders, and store categories'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isBn ? 'নতুন পণ্য যোগ করুন' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'মোট বিক্রয়' : 'Ecommerce GMV'}</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">৳১,৪২,৮০০</div>
          <div className="text-[11px] text-emerald-400 font-bold">+28% this month</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'মোট পণ্য তালিকা' : 'Active Products'}</span>
            <Package className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{products.length} {isBn ? 'টি পণ্য' : 'Items'}</div>
          <div className="text-[11px] text-indigo-300 font-bold">5 Main Categories</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'মোট আদেশ' : 'Marketplace Orders'}</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{orders.length} {isBn ? 'টি অর্ডার' : 'Orders'}</div>
          <div className="text-[11px] text-slate-400 font-bold">Live Tracked</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1f2136] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{isBn ? 'গড় অর্ডার মূল্য' : 'Avg Order Value'}</span>
            <Tag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">৳৩৮০.৮</div>
          <div className="text-[11px] text-slate-400 font-bold">Per Resident Order</div>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-[#1e1f32] border border-white/10">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#181928] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'products' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{isBn ? 'পণ্য তালিকা' : 'Products & Inventory'}</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{isBn ? 'অর্ডার সমূহ' : 'Marketplace Orders'}</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'categories' ? 'bg-indigo-600 text-white font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isBn ? 'ক্যাটাগরি সমূহ' : 'Categories'}</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBn ? 'খুঁজুন…' : 'Search catalog…'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#181928] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* ── PRODUCTS TAB CONTENT ── */}
      {activeTab === 'products' && (
        <div className="rounded-3xl bg-[#1e1f32] border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181928] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-4">{isBn ? 'পণ্য' : 'Product'}</th>
                  <th className="p-4">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                  <th className="p-4">{isBn ? 'বিক্রেতা' : 'Store Merchant'}</th>
                  <th className="p-4">{isBn ? 'মূল্য' : 'Price'}</th>
                  <th className="p-4">{isBn ? 'স্টক' : 'Stock'}</th>
                  <th className="p-4">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="p-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.sales} {isBn ? 'টি বিক্রি হয়েছে' : 'sold'}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[11px] font-bold border border-indigo-500/20">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-semibold">{p.seller}</td>
                    <td className="p-4 font-black text-emerald-400">৳{formatCurrency(p.price)}</td>
                    <td className="p-4 font-mono font-bold text-white">{p.stock}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          p.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : p.status === 'Low Stock'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ORDERS TAB CONTENT ── */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 font-semibold">
              <span>{orders.length}</span> <span>{isBn ? 'টি অর্ডার পাওয়া গেছে' : 'orders found'}</span>
            </p>
            <button
              onClick={() => { loadOrders(); loadAvailableRiders(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-semibold transition-all border border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              <span>{isBn ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No orders found. Place an order from the customer dashboard to see it here.'}</span>
            </div>
          ) : (
          <div className="rounded-3xl bg-[#1e1f32] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#181928] text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">{isBn ? 'অর্ডার আইডি' : 'Order ID'}</th>
                    <th className="p-4">{isBn ? 'গ্রাহক' : 'Customer'}</th>
                    <th className="p-4">{isBn ? 'আইটেম' : 'Items'}</th>
                    <th className="p-4">{isBn ? 'মোট মূল্য' : 'Total'}</th>
                    <th className="p-4">{isBn ? 'অ্যাসাইনড রাইডার' : 'Assigned Rider'}</th>
                    <th className="p-4">{isBn ? 'অবস্থা' : 'Status'}</th>
                    <th className="p-4 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {orders.filter(o =>
                    !search ||
                    o.displayId?.toLowerCase().includes(search.toLowerCase()) ||
                    o.customer?.toLowerCase().includes(search.toLowerCase())
                  ).map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-indigo-400">{o.displayId}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{o.customer}</div>
                        {o.customerPhone && <div className="text-[10px] text-slate-400">{o.customerPhone}</div>}
                      </td>
                      <td className="p-4 text-slate-400"><span>{o.items}</span> <span>{isBn ? 'টি আইটেম' : 'items'}</span></td>
                      <td className="p-4 font-black text-emerald-400">৳{formatCurrency(o.total)}</td>
                      <td className="p-4">
                        {o.riderName ? (
                          <div className="flex items-center gap-1.5">
                            <Bike className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-cyan-300 font-bold">{o.riderName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[10px]">Not Assigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            o.status === 'DELIVERED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : o.status === 'SHIPPED'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : o.status === 'RIDER_ASSIGNED'
                              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                              : o.status === 'PROCESSING'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : o.status === 'CANCELLED'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {['PENDING', 'PROCESSING'].includes(o.status) ? (
                          <button
                            onClick={() => openAssignModal(o)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-bold text-[10px] border border-indigo-500/30 transition-all ml-auto"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            {isBn ? 'রাইডার অ্যাসাইন' : 'Assign Rider'}
                          </button>
                        ) : o.status === 'RIDER_ASSIGNED' ? (
                          <button
                            onClick={() => openAssignModal(o)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 font-bold text-[10px] border border-cyan-500/30 transition-all ml-auto"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            {isBn ? 'রাইডার পরিবর্তন' : 'Change Rider'}
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      )}

      {/* ── CATEGORIES TAB CONTENT ── */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="p-5 rounded-3xl bg-[#1e1f32] border border-white/10 flex items-center justify-between hover:border-indigo-500/40 transition-all">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  {c.slug}
                </span>
                <h3 className="font-bold text-white text-base">{c.name}</h3>
                <p className="text-xs text-slate-400">{c.count} {isBn ? 'টি প্রোডাক্ট যুক্ত আছে' : 'Products listed'}</p>
              </div>
              <span className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── RIDER ASSIGN MODAL ── */}
      {assignModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1f2136] border border-cyan-500/30 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Bike className="w-5 h-5 text-cyan-400" />
                  {isBn ? 'রাইডার অ্যাসাইন করুন' : 'Assign Rider'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isBn ? 'অর্ডার' : 'Order'}: <span className="text-indigo-400 font-bold">{assignModalOrder.displayId}</span>
                  {' — '}{assignModalOrder.customer}
                </p>
              </div>
              <button onClick={() => setAssignModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignError && (
              <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {assignError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold block">{
                isBn ? 'উপলব্ধ রাইডার বাছাই করুন' : 'Select Available Rider'
              }</label>
              {availableRiders.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-xs">
                  {isBn ? 'কোনো উপলব্ধ রাইডার নেই।' : 'No available riders online right now.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableRiders.map((rider: any) => (
                    <label
                      key={rider.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedRiderId === rider.id
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="rider"
                        value={rider.id}
                        checked={selectedRiderId === rider.id}
                        onChange={() => setSelectedRiderId(rider.id)}
                        className="accent-cyan-500"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-xs">{rider.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {rider.riderProfile?.vehicleType} · {rider.phone || rider.email}
                          {rider.riderProfile?.rating && ` · ⭐ ${rider.riderProfile.rating}`}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ONLINE
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAssignRider}
                disabled={!selectedRiderId || assigning}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                {isBn ? 'রাইডার নিশ্চিত করুন' : 'Confirm Assign'}
              </button>
              <button
                onClick={() => setAssignModalOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD PRODUCT MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1f2136] border border-indigo-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">{isBn ? 'নতুন পণ্য যুক্ত করুন' : 'Add New Product'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'পণ্যের নাম' : 'Product Name'}</label>
                <input
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Organic Dairy Butter 200g"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'মূল্য (৳)' : 'Price (৳)'}</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="250"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'স্টক পরিমাণ' : 'Stock Quantity'}</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">{isBn ? 'ক্যাটাগরি' : 'Category'}</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181928] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddProduct}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
              >
                {isBn ? 'পণ্য সংরক্ষণ করুন' : 'Save Product'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
