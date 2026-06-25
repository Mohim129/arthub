import { Button } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";

export default function EmptyState({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Subtle icon with background */}
      <div className="mb-6 rounded-full bg-surface-container p-6">
        <Magnifier className="h-12 w-12 text-on-surface-variant" />
      </div>

      <h3 className="text-xl font-semibold text-on-surface dark:text-inverse-on-surface">
        No artworks found
      </h3>
      <p className="mt-2 max-w-[80%] text-sm text-on-surface-variant dark:text-outline-variant">
        We couldn’t find any artworks matching your filters. Try adjusting your
        search or browse all available works.
      </p>

      <Button onPress={onReset} color="primary" className="mt-6">
        Clear Filters
      </Button>
    </div>
  );
}
