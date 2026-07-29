'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { useOrderStore } from '@/store/useOrderStore';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/utils/cn';
import { CustomerEmptyState } from '@/components/dashboard/customer/CustomerEmptyState';
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Download,
  Eye,
  RefreshCcw,
  PackageCheck,
  ChevronRight,
  MapPin,
  CreditCard,
  Copy,
  Check,
  Sparkles,
  FileText,
} from 'lucide-react';

import { fetchApi } from '@/lib/api-client';

export default function CustomerOrdersPage() {
  const { isBn } = useTranslation();
  const { orders: storeOrders } = useOrderStore();
  const { addItem } = useCartStore();

  const [apiOrders, setApiOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [copiedId, setCopiedId] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchApi<any[]>('/orders')
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((o: any) => ({
            id: o.orderNumber || `#ORD-${o.id.slice(0, 6).toUpperCase()}`,
            date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: o.status,
            seller: o.items?.[0]?.product?.sellerProfile?.shopName || 'Marketplace Seller',
            items: (o.items || []).map((i: any) => ({
              id: i.id,
              name: i.product?.name || 'Product',
              qty: i.quantity,
              price: i.price,
              image: i.product?.images?.[0] || '📦',
            })),
            total: o.totalAmount,
            paymentMethod: o.paymentMethod || 'Cash on Delivery',
            deliveryAddress: o.deliveryAddress || 'DOHS Residence',
            estDelivery: '1-2 Days Express',
          }));
          setApiOrders(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Combine DB orders with store orders (avoiding duplicate IDs)
  const storeOrderIds = new Set(storeOrders.map((o) => o.id.toUpperCase()));
  const filteredApiOrders = apiOrders.filter((o) => !storeOrderIds.has(o.id.toUpperCase()));
  const allOrders = [...storeOrders, ...filteredApiOrders];

  const filteredOrders = allOrders.filter((order) => {
    const matchesStatus = activeStatus === 'ALL' || order.status === activeStatus;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isBn ? 'ডেলিভারি সম্পূর্ণ' : 'Delivered'}
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5 animate-pulse shadow-sm">
            <Truck className="w-3.5 h-3.5" />
            {isBn ? 'ডেলিভারিতে আছে' : 'Out for Delivery'}
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
            <PackageCheck className="w-3.5 h-3.5" />
            {isBn ? 'শিপিং সম্পন্ন' : 'Shipped'}
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            {isBn ? 'প্যাকিং চলছে' : 'Processing'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
            <XCircle className="w-3.5 h-3.5" />
            {isBn ? 'বাতিল করা হয়েছে' : 'Cancelled'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            {status}
          </span>
        );
    }
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handleReorderItem = (item: any) => {
    addItem({
      id: item.id || `prod-${Math.random()}`,
      title: item.name,
      slug: (item.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categorySlug: 'groceries',
      categoryName: 'Groceries',
      shopName: 'DOHS Market',
      price: item.price,
      unit: 'pcs',
      rating: 4.8,
      reviewCount: 12,
      image: item.image || '🛒',
      stock: 100,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            {isBn ? 'আমার অর্ডার হিস্ট্রি' : 'My Order History'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isBn
              ? 'আপনার সমস্ত কেনাকাটার বিস্তারিত রসিদ ও ডেলিভারি স্ট্যাটাস ট্র্যাক করুন'
              : 'Track active shipments, view order receipts, and re-order daily essentials'}
          </p>
        </div>

        <Link
          href="/services/shopping"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2 w-fit active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{isBn ? 'নতুন কেনাকাটা করুন' : 'Browse Marketplace'}</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-2xl bg-[#1e1f32] border border-white/10 p-4 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Status Tab Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {[
              { id: 'ALL', label: isBn ? 'সব অর্ডার' : 'All Orders', count: allOrders.length },
              {
                id: 'PROCESSING',
                label: isBn ? 'প্যাকিং চলছে' : 'Processing',
                count: allOrders.filter((o) => o.status === 'PROCESSING').length,
              },
              {
                id: 'OUT_FOR_DELIVERY',
                label: isBn ? 'ডেলিভারিতে আছে' : 'Out for Delivery',
                count: allOrders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
              },
              {
                id: 'DELIVERED',
                label: isBn ? 'সম্পন্ন' : 'Delivered',
                count: allOrders.filter((o) => o.status === 'DELIVERED').length,
              },
              {
                id: 'CANCELLED',
                label: isBn ? 'বাতিল' : 'Cancelled',
                count: allOrders.filter((o) => o.status === 'CANCELLED').length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeStatus === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      activeStatus === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'খুঁজুন Order ID বা প্রোডাক্ট...' : 'Search by Order ID or item name...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Orders List Grid */}
      {filteredOrders.length === 0 ? (
        <CustomerEmptyState
          icon={ShoppingBag}
          title={isBn ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No Orders Found'}
          description={
            isBn
              ? 'আপনার কোনো অর্ডার পাওয়া যায়নি। কোনো কেনাকাটা করতে চাইলে বেছে নিন নিত্যপ্রয়োজনীয় পণ্য।'
              : "We couldn't find any orders matching your selected status filter or search query."
          }
          actionText={isBn ? 'কেনাকাটা শুরু করুন' : 'Browse Marketplace'}
          actionHref="/services/shopping"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl bg-[#1e1f32] border border-white/10 overflow-hidden hover:border-indigo-500/40 transition-all duration-300 space-y-4 p-5 sm:p-6 shadow-xl"
            >
              {/* Card Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono font-black text-sm text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                    <span>#{order.id}</span>
                    <button
                      onClick={() => copyToClipboard(order.id)}
                      className="p-1 hover:text-white transition-colors"
                      title={isBn ? 'আইডি কপি করুন' : 'Copy Order ID'}
                    >
                      {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-slate-400 font-medium">
                    {isBn ? 'তারিখ:' : 'Date:'} <span className="text-slate-200 font-bold">{order.date}</span>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white/5 text-slate-300 hidden sm:inline-block">
                    {isBn ? 'বিক্রেতা:' : 'Seller:'} <span className="text-indigo-300">{order.seller}</span>
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Products Shelf */}
              <div className="space-y-2.5">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 bg-white/5 hover:bg-white/10 p-3.5 rounded-2xl border border-white/5 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Link href={`/services/shopping/product/${item.id || order.id}`} className="shrink-0">
                        {item.image && (item.image.startsWith('http') || item.image.startsWith('/')) ? (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary border border-white/10 hover:scale-105 transition-transform">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-3xl p-2.5 rounded-xl bg-white/5 block hover:scale-105 transition-transform">
                            {item.image || '🛒'}
                          </span>
                        )}
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/services/shopping/product/${item.id || order.id}`}>
                          <h4 className="font-bold text-sm text-white hover:text-indigo-400 transition-colors truncate">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isBn ? 'পরিমাণ:' : 'Qty:'} <span className="text-slate-200 font-bold">{item.qty}</span> × ৳{formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-emerald-400">
                        ৳{formatCurrency(item.qty * item.price)}
                      </span>
                      <button
                        onClick={() => handleReorderItem(item)}
                        className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all"
                        title={isBn ? 'পুনরায় কার্টে যুক্ত করুন' : 'Reorder Item'}
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer Summary & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-white/5">
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate max-w-md">{order.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-300">{order.paymentMethod}</span>
                    </span>
                    <span>•</span>
                    <span>
                      {isBn ? 'ডেলিভারি সময়:' : 'Est. Delivery:'} <span className="text-white font-semibold">{order.estDelivery}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {isBn ? 'মোট পরিশোধিত' : 'Total Payable'}
                    </span>
                    <span className="text-lg font-black text-emerald-400">
                      ৳{formatCurrency(order.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/orders/track?id=${order.id}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ট্র্যাক করুন' : 'Track Order'}</span>
                    </Link>

                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                      title={isBn ? 'রসিদ দেখুন' : 'View Receipt'}
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
