import { Skeleton } from "@heroui/react";

export default function AdminDashboardLoading() {
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
        {/* Header */}
        <div className="flex justify-between items-center mb-xl">
          <div className="space-y-xs">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-5 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>

        {/* Analytics Charts Mock */}
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </main>
    </div>
  );
}
