import { CategoryRailSkeleton, ProductGridSkeleton } from '@/components/ui/SkeletonLoaders';

export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="h-8 w-48 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <CategoryRailSkeleton />
      <ProductGridSkeleton count={12} />
    </div>
  );
}
