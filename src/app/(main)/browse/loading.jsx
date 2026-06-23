import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-lg">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
