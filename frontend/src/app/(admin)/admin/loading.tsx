import { DashboardGridSkeleton, TableSkeleton } from '@/components/ui/SkeletonLoaders';

export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-48 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <DashboardGridSkeleton count={6} />
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
