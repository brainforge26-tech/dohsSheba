import { WishlistSkeleton } from '@/components/ui/SkeletonLoaders';

export default function WishlistLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <div className="h-8 w-32 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <WishlistSkeleton count={6} />
    </div>
  );
}
