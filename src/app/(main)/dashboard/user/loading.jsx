import { Skeleton } from "@heroui/react";

export default function UserDashboardLoading() {
  return (
    <div className="min-h-screen flex relative">
      {/* Sidebar Placeholder */}
      <div className="hidden md:flex flex-shrink-0 w-64 bg-surface-container-low border-r border-outline-variant/30 h-[calc(100vh-80px)] sticky top-20 flex-col p-md justify-between">
        <div className="space-y-lg">
          <div className="flex items-center gap-sm">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-xs">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
          <div className="space-y-sm pt-md">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-md md:p-lg bg-surface max-w-full overflow-x-hidden space-y-xl">
        <div className="max-w-4xl mx-auto space-y-xl">
          {/* Header */}
          <div className="space-y-xs mb-xl">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-5 w-96 rounded-lg" />
          </div>

          {/* Table Container Mockup */}
          <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low">
            <div className="p-md bg-surface-container-low/50 border-b border-outline-variant/30 flex justify-between items-center">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            
            {/* Table rows skeletons */}
            <div className="p-md space-y-md divide-y divide-outline-variant/20">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center pt-md first:pt-0">
                  <div className="flex items-center gap-md">
                    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                    <div className="space-y-xs">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <div className="space-y-xs hidden md:block">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
