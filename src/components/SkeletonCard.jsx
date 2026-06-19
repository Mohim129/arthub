import { Card, Skeleton } from "@heroui/react";

export default function SkeletonCard() {
  return (
    <Card
      className="bg-surface rounded-xl overflow-hidden shadow-sm"
      shadow="none"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-6 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
        <div className="flex justify-between w-full pt-4">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </Card>
  );
}
