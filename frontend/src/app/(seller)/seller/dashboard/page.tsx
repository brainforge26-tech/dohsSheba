'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { formatCurrency } from '@/utils/cn';
import { useOrderStore } from '@/store/useOrderStore';
import {
  DollarSign, ShoppingBag, Package, AlertTriangle, Users,
  TrendingUp, TrendingDown, Star, Clock, CheckCircle2, XCircle,
  RefreshCw, Wallet, ArrowUpRight, Plus, Eye, BarChart2,
  Layers, PlusCircle, ArrowDownCircle, Activity, Bell, Zap,
  ChevronRight, RotateCcw, Truck,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalRevenue: number;
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  yearlySales: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  refundRequests: number;
  walletBalance: number;
  withdrawableBalance: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
}


const MOCK_CATEGORIES = [
  { name: 'Dairy & Eggs', sales: 58, color: 'bg-blue-500', pct: 35 },
  { name: 'Fruits', sales: 42, color: 'bg-amber-500', pct: 25 },
  { name: 'Rice & Grains', sales: 31, color: 'bg-emerald-500', pct: 19 },
  { name: 'Fish & Seafood', sales: 24, color: 'bg-purple-500', pct: 14 },
  { name: 'Spices & Oils', sales: 18, color: 'bg-pink-500', pct: 11 },
];

const MOCK_ACTIVITIES = [
  { icon: '🛒', text: 'New order #ORD-9946 received from Sharmin', time: '2m ago', color: 'text-emerald-400' },
  { icon: '⭐', text: 'New 5-star review on Organic Milk', time: '15m ago', color: 'text-amber-400' },
  { icon: '📦', text: 'Order #ORD-9938 marked as packed', time: '32m ago', color: 'text-indigo-400' },
  { icon: '⚠️', text: 'Low stock alert: Deshi Ghee (3 left)', time: '1h ago', color: 'text-red-400' },
  { icon: '💰', text: 'Payment of ৳18,340 settled to wallet', time: '3h ago', color: 'text-emerald-400' },
  { icon: '🚚', text: 'Order #ORD-9930 delivered successfully', time: '5h ago', color: 'text-blue-400' },
];

// ─── Helper: Status Badge ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING: { label: 'Pending', cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    PROCESSING: { label: 'Processing', cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    PACKED: { label: 'Packed', cls: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    SHIPPED: { label: 'Shipped', cls: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    DELIVERED: { label: 'Delivered', cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    CANCELLED: { label: 'Cancelled', cls: 'bg-red-500/20 text-red-300 border-red-500/30' },
    RETURNED: { label: 'Returned', cls: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  };
  const s = map[status] ?? { label: status, cls: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: 'up' | 'down' | 'neutral';
}

function KpiCard({ label, value, sub, subColor = 'text-emerald-400', icon, iconBg, trend }: KpiCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-[#1f2136] border border-white/10 shadow-lg flex items-center gap-4 hover:border-indigo-500/30 transition-all group">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400 font-semibold truncate">{label}</p>
        <p className="text-lg font-black text-white leading-tight">{value}</p>
        {sub && (
          <p className={`text-[10px] font-bold flex items-center gap-0.5 ${subColor}`}>
            {trend === 'up' && <TrendingUp className="w-2.5 h-2.5" />}
            {trend === 'down' && <TrendingDown className="w-2.5 h-2.5" />}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────────

function BarChart({ data, color = '#6366f1' }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="h-40 flex items-end gap-1.5 pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
          <div className="relative w-full flex items-end justify-center" style={{ height: '128px' }}>
            <div
              className="w-full rounded-t-md transition-all duration-500 group-hover:opacity-90"
              style={{ height: `${Math.max((d.value / max) * 100, 4)}%`, backgroundColor: color, opacity: 0.75 + (i / data.length) * 0.25 }}
            />
            {/* Tooltip */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#0f0f1a] text-white text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap z-10 border border-white/10">
              {formatCurrency(d.value)}
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stars ─────────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
      ))}
    </div>
  );
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Main Page ─────────────────────────────────────────────────────────────────

import { useSocket } from '@/hooks/useSocket';

export default function SellerDashboardPage() {
  const { orders: storeOrders } = useOrderStore();
  const { socket } = useSocket();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChart] = useState<any[]>([]);
  const [recentOrders, setOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [walletData, setWalletData] = useState<{ balance: number; transactions: any[] } | null>(null);
  const [inventoryStats, setInventoryStats] = useState<{
    active: number; outOfStock: number; lowStock: number; products: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Live Revenue Stats from storeOrders ────────────────────────────────────
  const liveStats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
    const lastWeekAgo = new Date(now); lastWeekAgo.setDate(now.getDate() - 14);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    let totalRevenue = 0, todaySales = 0, yesterdaySales = 0;
    let weeklySales = 0, lastWeeklySales = 0, monthlySales = 0, lastMonthlySales = 0, yearlySales = 0;
    let totalOrders = 0, pendingOrders = 0, processingOrders = 0, deliveredOrders = 0, cancelledOrders = 0;
    const uniqueCustomers = new Set<string>();

    // Monthly breakdown for chart (current year)
    const monthlyBreakdown: number[] = Array(12).fill(0);

    storeOrders.forEach((o) => {
      const d = new Date(o.date);
      const dStr = d.toDateString();
      totalRevenue += o.total;
      totalOrders++;

      if (dStr === todayStr) todaySales += o.total;
      if (dStr === yesterdayStr) yesterdaySales += o.total;
      if (d >= weekAgo) weeklySales += o.total;
      if (d >= lastWeekAgo && d < weekAgo) lastWeeklySales += o.total;
      if (d >= monthStart) monthlySales += o.total;
      if (d >= lastMonthStart && d <= lastMonthEnd) lastMonthlySales += o.total;
      if (d >= yearStart) yearlySales += o.total;

      if (d.getFullYear() === now.getFullYear()) {
        monthlyBreakdown[d.getMonth()] += o.total;
      }

      const st = o.status?.toUpperCase();
      if (st === 'PENDING' || st === 'CONFIRMED') pendingOrders++;
      else if (st === 'PROCESSING') processingOrders++;
      else if (st === 'DELIVERED') deliveredOrders++;
      else if (st === 'CANCELLED') cancelledOrders++;

      uniqueCustomers.add(o.id.split('-')[0]);
    });

    // Trend %
    const todayTrend = yesterdaySales > 0
      ? Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100)
      : todaySales > 0 ? 100 : 0;
    const weekTrend = lastWeeklySales > 0
      ? Math.round(((weeklySales - lastWeeklySales) / lastWeeklySales) * 100)
      : weeklySales > 0 ? 100 : 0;
    const monthTrend = lastMonthlySales > 0
      ? Math.round(((monthlySales - lastMonthlySales) / lastMonthlySales) * 100)
      : monthlySales > 0 ? 100 : 0;

    // Chart: last 7 months
    const chartSlice: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const mi = (now.getMonth() - i + 12) % 12;
      chartSlice.push({ label: MONTH_LABELS[mi], value: monthlyBreakdown[mi] });
    }

    // Recent orders (last 5)
    const recent = [...storeOrders].slice(0, 5).map((o) => ({
      id: o.id.slice(-8).toUpperCase(),
      customer: 'Customer',
      items: o.items.map((i: any) => i.name).join(', '),
      total: o.total,
      status: o.status.replace('OUT_FOR_DELIVERY', 'SHIPPED').replace('CONFIRMED', 'PENDING'),
    }));

    // Activity feed from real orders
    const activities = storeOrders.slice(0, 6).map((o) => {
      const statusMap: Record<string, { icon: string; color: string; verb: string }> = {
        PENDING:           { icon: '🛒', color: 'text-amber-400',  verb: 'New order placed' },
        CONFIRMED:         { icon: '✅', color: 'text-emerald-400', verb: 'Order confirmed' },
        PROCESSING:        { icon: '📦', color: 'text-blue-400',    verb: 'Order processing' },
        SHIPPED:           { icon: '🚚', color: 'text-cyan-400',    verb: 'Order shipped' },
        OUT_FOR_DELIVERY:  { icon: '🚴', color: 'text-indigo-400',  verb: 'Out for delivery' },
        DELIVERED:         { icon: '✅', color: 'text-emerald-400', verb: 'Order delivered' },
        CANCELLED:         { icon: '❌', color: 'text-red-400',     verb: 'Order cancelled' },
      };
      const meta = statusMap[o.status] ?? { icon: '📋', color: 'text-slate-400', verb: 'Order updated' };
      const mins = Math.round((Date.now() - new Date(o.date).getTime()) / 60000);
      const timeStr = mins < 60 ? `${mins}m ago` : mins < 1440 ? `${Math.round(mins/60)}h ago` : `${Math.round(mins/1440)}d ago`;
      return {
        icon: meta.icon,
        text: `${meta.verb} — ${o.items[0]?.name ?? 'Item'} (${formatCurrency(o.total)})`,
        time: timeStr,
        color: meta.color,
      };
    });

    return {
      totalRevenue, todaySales, weeklySales, monthlySales, yearlySales,
      totalOrders, pendingOrders, processingOrders, deliveredOrders, cancelledOrders,
      totalCustomers: uniqueCustomers.size,
      todayTrend, weekTrend, monthTrend,
      chart: chartSlice,
      recent,
      activities,
    };
  }, [storeOrders]);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      // Fetch main dashboard + wallet + inventory in parallel
      const [dashRes, walletRes, productsRes] = await Promise.allSettled([
        fetchApi<any>('/seller/dashboard'),
        fetchApi<any>('/wallet'),
        fetchApi<any>('/products/seller/my-products'),
      ]);

      // ── Main Dashboard ──
      if (dashRes.status === 'fulfilled' && dashRes.value.success && dashRes.value.data) {
        const d = dashRes.value.data;
        setStats(d.stats);
        setChart(d.monthlySalesChart ?? []);

        const mappedOrders = (d.recentOrders ?? []).map((o: any) => ({
          id: o.id?.slice(0, 10) || o.id,
          customer: o.customer?.name || o.customer || 'Customer',
          items: o.items?.map((i: any) => i.product?.name).filter(Boolean).join(', ') || o.items || 'Items',
          total: o.totalAmount ?? o.total ?? 0,
          status: o.status || 'PENDING',
        }));
        setOrders(mappedOrders);

        const mappedLowStock = (d.lowStockAlerts ?? []).map((p: any) => ({
          id: p.id, name: p.name,
          category: typeof p.category === 'object' ? p.category?.name : (p.category || 'Category'),
          stock: p.stock ?? 0,
        }));
        setLowStock(mappedLowStock);

        const mappedTopProducts = (d.topProducts ?? []).map((p: any) => {
          const soldCount = p._count?.orderItems ?? p.sold ?? 0;
          return {
            id: p.id, name: p.name,
            category: typeof p.category === 'object' ? p.category?.name : (p.category || 'Category'),
            sold: soldCount,
            revenue: p.revenue ?? ((p.price || 0) * soldCount),
            rating: p.rating ?? 5,
          };
        });
        setTopProducts(mappedTopProducts);

        const mapped = (d.recentReviews ?? []).map((r: any) => ({
          id: r.id,
          customer: r.user?.name || 'Anonymous',
          product: typeof r.product === 'object' ? (r.product?.name || 'Product') : (r.product || 'Product'),
          productImage: typeof r.product === 'object' ? (r.product?.images?.[0] || null) : null,
          rating: r.rating ?? 5,
          comment: r.comment || '',
          date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            : 'Recent',
        }));
        setReviews(mapped);
      }

      // ── Wallet ──
      if (walletRes.status === 'fulfilled' && walletRes.value.success && walletRes.value.data) {
        const w = walletRes.value.data;
        setWalletData({
          balance:      Number(w.balance ?? 0),
          transactions: w.transactions ?? [],
        });
      }

      // ── Inventory (Seller Products) ──
      if (productsRes.status === 'fulfilled' && productsRes.value.success) {
        const allProducts: any[] = productsRes.value.data?.products
          ?? productsRes.value.data
          ?? [];
        const active     = allProducts.filter((p: any) => p.isActive !== false && p.stock > 0).length;
        const outOfStock = allProducts.filter((p: any) => p.stock === 0 || p.stock == null).length;
        const lowStockCount = allProducts.filter((p: any) => p.stock > 0 && p.stock <= 10).length;

        // Low stock items for the alert panel
        const lowStockItems = allProducts
          .filter((p: any) => p.stock != null && p.stock <= 10)
          .sort((a: any, b: any) => (a.stock ?? 0) - (b.stock ?? 0))
          .slice(0, 8)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            category: typeof p.category === 'object' ? p.category?.name : (p.category || 'Category'),
            stock: p.stock ?? 0,
          }));

        setInventoryStats({ active, outOfStock, lowStock: lowStockCount, products: allProducts });
        // Override low stock alert panel if inventory API returned items
        if (lowStockItems.length > 0) setLowStock(lowStockItems);
      }

    } catch (err: any) {
      console.warn('Dashboard load error:', err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => { load(false); };
    socket.on('ORDER_CREATED', handleUpdate);
    socket.on('ORDER_STATUS_UPDATED', handleUpdate);
    return () => {
      socket.off('ORDER_CREATED', handleUpdate);
      socket.off('ORDER_STATUS_UPDATED', handleUpdate);
    };
  }, [socket]);

  // ─── Merge: API + wallet + inventory + store ─────────────────────────────────
  const s = stats;

  // Real wallet balance (API > store-derived revenue)
  const realWalletBalance     = walletData?.balance ?? ((s?.walletBalance || 0) > 0 ? s!.walletBalance : liveStats.totalRevenue);
  const realWithdrawable      = walletData ? Math.floor(walletData.balance * 0.9) : ((s?.withdrawableBalance || 0) > 0 ? s!.withdrawableBalance : Math.round(liveStats.totalRevenue * 0.9));

  // Real inventory counts (API > API dashboard stats)
  const realActiveProducts    = inventoryStats?.active     ?? (s?.activeProducts     ?? 0);
  const realOutOfStock        = inventoryStats?.outOfStock ?? (s?.outOfStockProducts ?? 0);
  const realLowStock          = inventoryStats?.lowStock   ?? (s?.lowStockProducts   ?? 0);

  const merged = {
    totalRevenue:         (s?.totalRevenue   || 0) > 0 ? s!.totalRevenue   : liveStats.totalRevenue,
    todaySales:           (s?.todaySales     || 0) > 0 ? s!.todaySales     : liveStats.todaySales,
    weeklySales:          (s?.weeklySales    || 0) > 0 ? s!.weeklySales    : liveStats.weeklySales,
    monthlySales:         (s?.monthlySales   || 0) > 0 ? s!.monthlySales   : liveStats.monthlySales,
    yearlySales:          (s?.yearlySales    || 0) > 0 ? s!.yearlySales    : liveStats.yearlySales,
    totalOrders:          (s?.totalOrders    || 0) > 0 ? s!.totalOrders    : liveStats.totalOrders,
    pendingOrders:        (s?.pendingOrders  || 0) > 0 ? s!.pendingOrders  : liveStats.pendingOrders,
    processingOrders:     (s?.processingOrders || 0) > 0 ? s!.processingOrders : liveStats.processingOrders,
    deliveredOrders:      (s?.deliveredOrders || 0) > 0 ? s!.deliveredOrders  : liveStats.deliveredOrders,
    cancelledOrders:      (s?.cancelledOrders || 0) > 0 ? s!.cancelledOrders  : liveStats.cancelledOrders,
    refundRequests:       s?.refundRequests  ?? 0,
    walletBalance:        realWalletBalance,
    withdrawableBalance:  realWithdrawable,
    activeProducts:       realActiveProducts,
    outOfStockProducts:   realOutOfStock,
    lowStockProducts:     realLowStock,
    totalCustomers:       (s?.totalCustomers || 0) > 0 ? s!.totalCustomers : liveStats.totalCustomers,
  };

  // Dynamic chart: prefer API chart, else use store-derived monthly chart
  const finalChart = chartData.length > 0 ? chartData : liveStats.chart;

  // Dynamic recent orders: prefer API, else use store-derived
  const finalRecentOrders = recentOrders.length > 0 ? recentOrders : liveStats.recent;

  // Dynamic activity: use real store order events
  const finalActivities = liveStats.activities;

  // Trend label helpers
  const trendLabel = (pct: number) =>
    pct === 0 ? 'No change' : pct > 0 ? `+${pct}% vs prev` : `${pct}% vs prev`;
  const trendDir = (pct: number): 'up' | 'down' | 'neutral' =>
    pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral';

  // ─── Skeleton ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array(18).fill(0).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-[#1f2136] border border-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-64 rounded-3xl bg-[#1f2136] border border-white/5" />
          <div className="lg:col-span-4 h-64 rounded-3xl bg-[#1f2136] border border-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Commerce Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time insights for Fresh Bazaar</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/*  ROW 1 — 18 KPI CARDS  (3 rows of 6)                   */}
      {/* ════════════════════════════════════════════════════════ */}

      {/* Revenue Cards */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Revenue</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Total Revenue" value={formatCurrency(merged.totalRevenue)} sub={`${merged.totalOrders} total orders`} trend="up" icon={<DollarSign className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" subColor="text-emerald-400" />
          <KpiCard label="Today's Sales" value={formatCurrency(merged.todaySales)} sub={trendLabel(liveStats.todayTrend)} trend={trendDir(liveStats.todayTrend)} icon={<TrendingUp className="w-5 h-5 text-cyan-400" />} iconBg="bg-cyan-500/10" subColor={liveStats.todayTrend >= 0 ? 'text-cyan-400' : 'text-red-400'} />
          <KpiCard label="This Week" value={formatCurrency(merged.weeklySales)} sub={trendLabel(liveStats.weekTrend)} trend={trendDir(liveStats.weekTrend)} icon={<BarChart2 className="w-5 h-5 text-indigo-400" />} iconBg="bg-indigo-500/10" subColor={liveStats.weekTrend >= 0 ? 'text-indigo-400' : 'text-red-400'} />
          <KpiCard label="This Month" value={formatCurrency(merged.monthlySales)} sub={trendLabel(liveStats.monthTrend)} trend={trendDir(liveStats.monthTrend)} icon={<Layers className="w-5 h-5 text-purple-400" />} iconBg="bg-purple-500/10" subColor={liveStats.monthTrend >= 0 ? 'text-purple-400' : 'text-red-400'} />
          <KpiCard label="This Year" value={formatCurrency(merged.yearlySales)} sub="Annual total" trend="neutral" icon={<Activity className="w-5 h-5 text-pink-400" />} iconBg="bg-pink-500/10" subColor="text-slate-400" />
          <KpiCard label="Total Customers" value={`${merged.totalCustomers} Buyers`} sub="Unique buyers" trend="up" icon={<Users className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10" subColor="text-blue-400" />
        </div>
      </section>

      {/* Order Cards */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Orders</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Total Orders" value={`${merged.totalOrders}`} sub="All time" icon={<ShoppingBag className="w-5 h-5 text-white" />} iconBg="bg-slate-600/40" />
          <KpiCard label="Pending" value={`${merged.pendingOrders}`} sub="Awaiting confirmation" icon={<Clock className="w-5 h-5 text-amber-400" />} iconBg="bg-amber-500/10" subColor="text-amber-400" />
          <KpiCard label="Processing" value={`${merged.processingOrders}`} sub="Being prepared" icon={<RefreshCw className="w-5 h-5 text-blue-400" />} iconBg="bg-blue-500/10" subColor="text-blue-400" />
          <KpiCard label="Delivered" value={`${merged.deliveredOrders}`} sub="Successfully delivered" trend="up" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" subColor="text-emerald-400" />
          <KpiCard label="Cancelled" value={`${merged.cancelledOrders}`} sub="Cancelled by buyer" icon={<XCircle className="w-5 h-5 text-red-400" />} iconBg="bg-red-500/10" subColor="text-red-400" />
          <KpiCard label="Refund Requests" value={`${merged.refundRequests}`} sub="Pending review" icon={<RotateCcw className="w-5 h-5 text-orange-400" />} iconBg="bg-orange-500/10" subColor="text-orange-400" />
        </div>
      </section>

      {/* Finance + Inventory Cards */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Finance & Inventory</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard label="Wallet Balance" value={formatCurrency(merged.walletBalance)} sub="Available funds" icon={<Wallet className="w-5 h-5 text-indigo-400" />} iconBg="bg-indigo-500/10" subColor="text-indigo-400" />
          <KpiCard label="Withdrawable" value={formatCurrency(merged.withdrawableBalance)} sub="Ready to withdraw" trend="up" icon={<ArrowDownCircle className="w-5 h-5 text-emerald-400" />} iconBg="bg-emerald-500/10" subColor="text-emerald-400" />
          <KpiCard label="Active Products" value={`${merged.activeProducts}`} sub="In your store" icon={<Package className="w-5 h-5 text-purple-400" />} iconBg="bg-purple-500/10" subColor="text-slate-400" />
          <KpiCard label="Out of Stock" value={`${merged.outOfStockProducts}`} sub="Needs restocking" icon={<AlertTriangle className="w-5 h-5 text-red-400" />} iconBg="bg-red-500/10" subColor="text-red-400" />
          <KpiCard label="Low Stock" value={`${merged.lowStockProducts}`} sub="≤10 units left" icon={<AlertTriangle className="w-5 h-5 text-amber-400" />} iconBg="bg-amber-500/10" subColor="text-amber-400" />
          <KpiCard label="Total Sales Count" value={`${merged.totalOrders} Orders`} sub="All time orders" icon={<Truck className="w-5 h-5 text-cyan-400" />} iconBg="bg-cyan-500/10" subColor="text-slate-400" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════ */}
      {/*  ROW 2 — Charts + Quick Actions                         */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Monthly Sales Bar Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">Monthly Revenue Chart</h3>
              <p className="text-[11px] text-slate-400">Last 12 months income performance</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-indigo-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" /> Revenue
              </span>
              <span className={`font-bold flex items-center gap-1 ${liveStats.monthTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {liveStats.monthTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {liveStats.monthTrend > 0 ? '+' : ''}{liveStats.monthTrend}% MoM
              </span>
            </div>
          </div>
          <BarChart data={finalChart} color="#6366f1" />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Quick Actions
          </h3>
          <div className="space-y-2.5">
            {[
              { label: 'Add New Product', icon: <PlusCircle className="w-4 h-4" />, href: '/seller/dashboard/products/add', color: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
              { label: 'Manage Orders', icon: <ShoppingBag className="w-4 h-4" />, href: '/seller/dashboard/orders', color: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
              { label: 'Withdraw Money', icon: <Wallet className="w-4 h-4" />, href: '/seller/dashboard/finance/withdraw', color: 'bg-purple-600 hover:bg-purple-700 text-white' },
              { label: 'View Analytics', icon: <BarChart2 className="w-4 h-4" />, href: '/seller/dashboard/analytics', color: 'bg-[#252740] hover:bg-[#2e3154] text-slate-200 border border-white/10' },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition-all ${a.color}`}
              >
                <span className="flex items-center gap-2">{a.icon}{a.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </Link>
            ))}
          </div>

          {/* Revenue mini-summary */}
          <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Withdrawable Balance</span>
              <span className="font-black text-emerald-400">{formatCurrency(merged.withdrawableBalance)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Wallet Total</span>
              <span className="font-black text-white">{formatCurrency(merged.walletBalance)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Total Revenue</span>
              <span className="font-black text-indigo-400">{formatCurrency(merged.totalRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/*  ROW 3 — Recent Orders + Activity Feed                  */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Orders Table */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">Recent Orders</h3>
              <p className="text-[11px] text-slate-400">Latest incoming grocery orders</p>
            </div>
            <Link href="/seller/dashboard/orders" className="flex items-center gap-1 text-indigo-400 text-xs font-bold hover:underline">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2 text-left">Order ID</th>
                  <th className="pb-3 px-2 text-left">Customer</th>
                  <th className="pb-3 px-2 text-left hidden md:table-cell">Items</th>
                  <th className="pb-3 px-2 text-right">Amount</th>
                  <th className="pb-3 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {finalRecentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">No orders yet. Customer orders will appear here.</td>
                  </tr>
                ) : finalRecentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-mono font-bold text-indigo-400 whitespace-nowrap">{o.id}</td>
                    <td className="py-3 px-2 font-semibold text-white whitespace-nowrap">{o.customer}</td>
                    <td className="py-3 px-2 text-slate-400 hidden md:table-cell max-w-[180px] truncate">{o.items}</td>
                    <td className="py-3 px-2 font-black text-emerald-400 text-right whitespace-nowrap">{formatCurrency(o.total)}</td>
                    <td className="py-3 px-2 text-center"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {(finalActivities.length > 0 ? finalActivities : [
              { icon: '📋', text: 'No activity yet — orders will appear here', time: '', color: 'text-slate-400' },
            ]).map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <span className="text-base leading-none shrink-0 mt-0.5">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${a.color}`}>{a.text}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/*  ROW 4 — Top Products + Low Stock + Categories          */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Top Products */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Top Products</h3>
            <Link href="/seller/dashboard/products" className="text-indigo-400 text-xs font-bold hover:underline flex items-center gap-1">
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#181928]/60 border border-white/5 hover:border-indigo-500/20 transition-all">
                <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center font-black text-xs text-indigo-300 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-xs truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.category} · {p.sold} sold</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-emerald-400 text-xs">{formatCurrency(p.revenue)}</p>
                  <Stars rating={p.rating} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Low Stock Alerts
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
              {lowStock.length} Items
            </span>
          </div>
          <div className="space-y-2.5">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#181928]/60 border border-red-500/10 hover:border-red-500/25 transition-all">
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400">{p.category}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-black text-red-400 text-sm">{p.stock}</span>
                  <p className="text-[10px] text-slate-500">left</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/seller/dashboard/inventory" className="flex items-center justify-center gap-1 w-full py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition-all">
            <Eye className="w-3.5 h-3.5" /> View Inventory
          </Link>
        </div>

        {/* Best Selling Categories */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white">Best Categories</h3>
          <div className="space-y-3">
            {MOCK_CATEGORIES.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">{c.name}</span>
                  <span className="font-bold text-white">{c.sales} sales</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/*  ROW 5 — Recent Reviews + Notifications                 */}
      {/* ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Reviews */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Recent Reviews
            </h3>
            <Link href="/seller/dashboard/reviews" className="text-indigo-400 text-xs font-bold hover:underline flex items-center gap-1">
              All Reviews <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {reviews.map((r: any) => {
              const customerName = r.user?.name || r.customer || 'Anonymous Customer';
              const productName = typeof r.product === 'object' ? (r.product?.name ?? 'Product') : (r.product || 'Product');
              const productImage = r.productImage || (typeof r.product === 'object' ? r.product?.images?.[0] : null);
              const dateText = r.createdAt
                ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                : (r.date || 'Recent');
              const initials = customerName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={r.id} className="p-4 rounded-2xl bg-[#181928]/60 border border-white/5 space-y-2 hover:border-amber-500/20 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Customer Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">{customerName}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {productImage && (
                            <img src={productImage} alt={productName} className="w-3.5 h-3.5 rounded object-cover" />
                          )}
                          <p className="text-[10px] text-slate-400 truncate">{productName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Stars rating={r.rating ?? 5} />
                      <p className="text-[10px] text-slate-500 mt-0.5">{dateText}</p>
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-[11px] text-slate-300 italic leading-relaxed pl-10.5">"{r.comment}"</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications Panel */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1f2136] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" /> Notifications
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              3 New
            </span>
          </div>
          <div className="space-y-2.5">
            {[
              { title: 'New Order Received', desc: '#ORD-9946 — Sharmin Sultana', color: 'border-l-emerald-500', dot: 'bg-emerald-500', time: '2m ago' },
              { title: 'Low Stock Warning', desc: 'Deshi Ghee has only 3 units left', color: 'border-l-amber-500', dot: 'bg-amber-500', time: '45m ago' },
              { title: 'Payment Settled', desc: '৳18,340 credited to your wallet', color: 'border-l-indigo-500', dot: 'bg-indigo-500', time: '3h ago' },
              { title: 'Order Delivered', desc: '#ORD-9930 delivered successfully', color: 'border-l-blue-500', dot: 'bg-blue-500', time: '5h ago' },
              { title: 'New 5-Star Review', desc: 'Organic Milk rated 5 stars', color: 'border-l-purple-500', dot: 'bg-purple-500', time: '1d ago' },
            ].map((n, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl bg-[#181928]/60 border-l-2 ${n.color} hover:bg-white/5 transition-all cursor-pointer`}>
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-xs">{n.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{n.desc}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
