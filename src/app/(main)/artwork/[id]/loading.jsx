import { Skeleton } from "@heroui/react";

export default function ArtworkDetailLoading() {
  return (
    <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-start">
        {/* Left image block skeleton */}
        <div className="relative rounded-xl bg-surface-container-low shadow-sm aspect-4/5 w-full">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>

        {/* Right detail text block skeleton */}
        <div className="flex flex-col gap-md">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-sm">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <Skeleton className="h-12 w-3/4 rounded-lg mt-xs" />
            <div className="flex items-center gap-sm mt-xs">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-5 w-40 rounded" />
            </div>
          </div>

          {/* Price & Purchase Card skeleton */}
          <div className="p-md bg-surface-container-low rounded-xl border border-surface-variant/30 flex flex-col gap-sm">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="w-full h-12 rounded-xl mt-xs" />
            <div className="flex items-center justify-center py-xs mt-xs">
              <Skeleton className="h-5 w-48 rounded" />
            </div>
          </div>

          {/* Description skeleton */}
          <div className="flex flex-col gap-sm">
            <Skeleton className="h-6 w-24 rounded border-b pb-xs" />
            <div className="space-y-xs">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
          </div>

          {/* Comments section placeholder */}
          <div className="flex flex-col gap-md mt-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
            <div className="space-y-sm">
              <div className="flex gap-sm items-start">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="space-y-xs w-full">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
