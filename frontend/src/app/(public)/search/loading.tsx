import { SearchResultSkeleton } from '@/components/ui/SkeletonLoaders';

export default function SearchLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse" aria-hidden="true" />
      <SearchResultSkeleton count={6} />
    </div>
  );
}
