import { NotificationSkeleton } from '@/components/ui/SkeletonLoaders';

export default function NotificationsLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="h-8 w-40 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <NotificationSkeleton count={6} />
    </div>
  );
}
