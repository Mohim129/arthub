"use client";
import { useState } from "react";
import { browseArtworks } from "@/data/browseArtworks";
import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { Card, Button } from "@heroui/react";
import { Heart, ShoppingCart } from "@gravity-ui/icons";

const ITEMS_PER_PAGE = 8;

export default function BrowsePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredArtworks, setFilteredArtworks] = useState(browseArtworks);
  const [showEmpty, setShowEmpty] = useState(false);

  const handleFilterChange = (filters) => {
    let results = [...browseArtworks];

    // Search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (art) =>
          art.title.toLowerCase().includes(term) ||
          art.artist.toLowerCase().includes(term),
      );
      // Demo: typing "empty" shows empty state
      if (
        filters.searchTerm.toLowerCase() === "empty" ||
        filters.searchTerm.toLowerCase() === "none"
      ) {
        setShowEmpty(true);
        return;
      }
    }

    // Category filter
    if (filters.category && filters.category !== "All Media") {
      results = results.filter((art) => art.category === filters.category);
    }

    // Price range
    if (filters.priceMin) {
      results = results.filter((art) => art.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      results = results.filter((art) => art.price <= Number(filters.priceMax));
    }

    // Sort
    if (filters.sortBy === "Price: Low to High") {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "Price: High to Low") {
      results.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "Popularity") {
      // mock popularity
      results.sort((a, b) => (a.id % 2) - (b.id % 2));
    }

    setShowEmpty(results.length === 0);
    setFilteredArtworks(results);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilteredArtworks(browseArtworks);
    setShowEmpty(false);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
  const paginatedArtworks = filteredArtworks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className="max-w-container-max mx-auto px-gutter bg-surface dark:bg-inverse-surface min-h-screen">
        {/* Browse Header */}
        <header className="mb-lg">
          <h1 className="font-h1-desktop text-h1-desktop text-on-surface dark:text-inverse-on-surface">
            Explore Curated Collections
          </h1>
          <p className="font-body-large text-body-large text-on-surface-variant dark:text-outline-variant mt-base">
            Discover masterpieces from emerging and established digital artists
            worldwide.
          </p>
        </header>

        <FilterBar onFilterChange={handleFilterChange} />

        {showEmpty ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
              {paginatedArtworks.map((artwork) => (
                <Card
                  key={artwork.id}
                  className="art-card-hover art-card-img-scale bg-surface-container-lowest dark:bg-inverse-surface/40 rounded-xl overflow-hidden transition-all duration-300 border border-outline-variant/20 dark:border-outline-variant/10 shadow-sm group cursor-pointer"
                  shadow="none"
                >
                  <div className="relative aspect-square overflow-hidden bg-surface-variant">
                    <img
                      alt={artwork.title}
                      src={artwork.image}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        isIconOnly
                        className="w-10 h-10 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-on-surface dark:text-inverse-on-surface hover:text-error transition-colors"
                        variant="light"
                      >
                        <Heart />
                      </Button>
                    </div>
                  </div>
                  <div className="p-md">
                    <span className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed mb-xs block">
                      {artwork.category}
                    </span>
                    <h3 className="font-h3 text-h3 text-on-surface dark:text-inverse-on-surface group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors truncate">
                      {artwork.title}
                    </h3>
                    <p className="font-body-small text-body-small text-on-surface-variant dark:text-outline-variant mt-xs">
                      by {artwork.artist}
                    </p>
                    <div className="mt-md pt-md border-t border-outline-variant dark:border-outline-variant/20 flex justify-between items-center">
                      <span className="font-h3 text-h3 text-on-surface dark:text-inverse-on-surface">
                        ${artwork.price.toLocaleString()}
                      </span>
                      <Button
                        isIconOnly
                        variant="light"
                        className="text-primary dark:text-primary-fixed-dim"
                      >
                        <ShoppingCart />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
