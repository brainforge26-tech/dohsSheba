import { DashboardGridSkeleton, TableSkeleton } from '@/components/ui/SkeletonLoaders';

export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Stat cards */}
      <DashboardGridSkeleton count={4} />
      {/* Recent orders table */}
      <TableSkeleton rows={5} cols={5} />
    </div>
  );
}
