import { CartSkeleton } from '@/components/ui/SkeletonLoaders';

export default function CartLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="h-8 w-36 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <CartSkeleton count={4} />
    </div>
  );
}
