import { Button } from "@heroui/react";
import { Magnifier, Paintbrush } from "@gravity-ui/icons";

export default function EmptyState({ onReset }) {
  return (
    <div className="py-xl flex flex-col items-center text-center">
      <div className="w-64 h-64 mb-md relative flex items-center justify-center">
        <div className="absolute inset-0 bg-surface-container rounded-full opacity-30 animate-pulse"></div>
        <Magnifier className="text-[120px] text-outline-variant" />
        <Paintbrush className="text-[60px] text-primary absolute bottom-12 right-12" />
      </div>
      <h2 className="font-h2 text-h2 text-on-surface dark:text-inverse-on-surface">No results found</h2>
      <p className="font-body-large text-body-large text-on-surface-variant dark:text-outline-variant max-w-md mt-base">
        We couldn&apos;t find any artworks matching your current filters. Try
        adjusting your search criteria or price range.
      </p>
      <Button
        onPress={onReset}
        className="mt-lg px-lg py-md bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-opacity"
      >
        Reset All Filters
      </Button>
    </div>
  );
}
