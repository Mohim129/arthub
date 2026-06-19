"use client";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "@gravity-ui/icons";

export default function Pagination({
  currentPage = 1,
  totalPages = 12,
  onPageChange,
}) {
  const pages = [];
  // Generate page numbers with ellipsis
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="mt-xl flex justify-center items-center gap-sm">
      <Button
        isIconOnly
        disabled={currentPage === 1}
        onPress={() => onPageChange?.(currentPage - 1)}
        className="w-10 h-10 rounded-lg border border-outline-variant dark:border-outline-variant/30 flex items-center justify-center hover:bg-surface-variant dark:hover:bg-inverse-surface/60 transition-colors disabled:opacity-30 dark:text-inverse-on-surface"
      >
        <ChevronLeft />
      </Button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-xs text-outline dark:text-outline-variant">
            ...
          </span>
        ) : (
          <Button
            key={idx}
            onPress={() => onPageChange?.(page)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              page === currentPage
                ? "bg-primary text-on-primary"
                : "border border-outline-variant dark:border-outline-variant/30 hover:bg-surface-variant dark:hover:bg-inverse-surface/60 transition-colors dark:text-inverse-on-surface"
            }`}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        isIconOnly
        disabled={currentPage === totalPages}
        onPress={() => onPageChange?.(currentPage + 1)}
        className="w-10 h-10 rounded-lg border border-outline-variant dark:border-outline-variant/30 flex items-center justify-center hover:bg-surface-variant dark:hover:bg-inverse-surface/60 transition-colors disabled:opacity-30 dark:text-inverse-on-surface"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
