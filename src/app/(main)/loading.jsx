import { Skeleton } from "@heroui/react";
import SkeletonCard from "@/components/SkeletonCard";

export default function HomeLoading() {
  return (
    <div className="space-y-xl pb-xl bg-surface dark:bg-inverse-surface min-h-screen">
      {/* Hero Carousel Skeleton */}
      <div className="relative w-full h-[400px] md:h-[550px] bg-surface-container-low overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter h-full flex flex-col justify-end pb-xl space-y-md">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-16 w-3/4 md:w-1/2 rounded-lg" />
          <Skeleton className="h-6 w-1/2 md:w-1/3 rounded-lg" />
          <div className="flex gap-sm">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Category Section Skeleton */}
      <section className="max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </section>

      {/* Featured Artworks Skeleton */}
      <section className="py-xl bg-surface-container-lowest dark:bg-inverse-surface/20 transition-colors duration-300">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-lg">
            <div className="space-y-xs">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-10 w-64 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Artists Skeleton */}
      <section className="py-xl max-w-container-max mx-auto px-gutter">
        <div className="space-y-xs mb-lg text-center flex flex-col items-center">
          <Skeleton className="h-10 w-72 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center p-lg space-y-md border border-outline-variant/30 rounded-xl bg-surface-container-low">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
