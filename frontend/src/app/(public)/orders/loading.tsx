import { OrderListSkeleton } from '@/components/ui/SkeletonLoaders';

export default function OrdersLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <div className="h-8 w-40 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <OrderListSkeleton count={5} />
    </div>
  );
}
