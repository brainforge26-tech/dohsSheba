import { OrderListSkeleton } from '@/components/ui/SkeletonLoaders';

export default function DashboardOrdersLoading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-36 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <OrderListSkeleton count={6} />
    </div>
  );
}
