import { ProductGridSkeleton } from '@/components/ui/SkeletonLoaders';

export default function ShoppingLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Banner placeholder */}
      <div className="h-48 sm:h-64 rounded-3xl bg-slate-100 animate-pulse" aria-hidden="true" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
