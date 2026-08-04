import { DashboardGridSkeleton, TableSkeleton } from '@/components/ui/SkeletonLoaders';

export default function SellerLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-44 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <DashboardGridSkeleton count={4} />
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
