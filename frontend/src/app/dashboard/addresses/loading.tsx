import { AddressSkeleton } from '@/components/ui/SkeletonLoaders';

export default function AddressesLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <div className="h-8 w-44 bg-slate-100 rounded-full animate-pulse" aria-hidden="true" />
      <AddressSkeleton count={3} />
    </div>
  );
}
