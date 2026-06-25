"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import { Card, Button, Input } from "@heroui/react";
import {
  Heart,
  ShoppingCart,
  Magnifier,
  Sliders,
  Xmark,
} from "@gravity-ui/icons";
import Link from "next/link";
import { getAllArtworks } from "@/lib/api/artworks";

const ITEMS_PER_PAGE = 8;

const categories = [
  "All Media",
  "Digital Painting",
  "3D Abstract",
  "Generative Art",
  "Photography",
  "Digital Illustration",
  "Painting",
  "Mixed Media",
];

export default function BrowsePage() {
  const [artworks, setArtworks] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmpty, setShowEmpty] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Media");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debounceRef = useRef(null);

  const getSortParams = () => {
    if (sortBy === "Price: Low to High")
      return { sortBy: "price", sortOrder: "asc" };
    if (sortBy === "Price: High to Low")
      return { sortBy: "price", sortOrder: "desc" };
    if (sortBy === "Newest First")
      return { sortBy: "createdAt", sortOrder: "desc" };
    if (sortBy === "Popularity")
      return { sortBy: "createdAt", sortOrder: "desc" };
    return { sortBy: "createdAt", sortOrder: "desc" };
  };

  // ✅ Safely fetches artworks with fallbacks
  const fetchArtworks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { sortBy: apiSort, sortOrder } = getSortParams();
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        category: category !== "All Media" ? category : undefined,
        minPrice: priceMin || undefined,
        maxPrice: priceMax || undefined,
        search: searchTerm || undefined,
        sortBy: apiSort,
        sortOrder,
      };
      const data = await getAllArtworks(params);

      // Safe extraction with defaults
      const artworksList = data?.artworks ?? [];
      const totalCount = data?.total ?? 0;

      setArtworks(artworksList);
      setTotal(totalCount);
      setShowEmpty(artworksList.length === 0);
    } catch (error) {
      console.error("Fetch artworks error:", error);
      // On error, reset to safe state
      setArtworks([]);
      setTotal(0);
      setShowEmpty(true);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, category, priceMin, priceMax, searchTerm, sortBy]);

  // Debounced fetch on filter changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchArtworks();
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, category, priceMin, priceMax, sortBy]);

  // Fetch on page change
  useEffect(() => {
    fetchArtworks();
  }, [currentPage]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("All Media");
    setPriceMin("");
    setPriceMax("");
    setSortBy("Newest First");
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="max-w-container-max mx-auto px-gutter bg-surface dark:bg-inverse-surface min-h-screen">
      {/* Header */}
      <header className="mb-lg">
        <h1 className="font-h1-desktop text-h1-desktop text-on-surface dark:text-inverse-on-surface">
          Explore Curated Collections
        </h1>
        <p className="font-body-large text-body-large text-on-surface-variant dark:text-outline-variant mt-base">
          Discover masterpieces from emerging and established digital artists
          worldwide.
        </p>
      </header>

      {/* Search & Sort Topbar */}
      <div className="flex flex-col md:flex-row gap-sm md:gap-md items-center justify-between bg-surface-container-low dark:bg-inverse-surface/40 rounded-xl p-sm md:p-md mb-sm md:mb-md shadow-sm border border-outline-variant/30 dark:border-outline-variant/10">
        <div className="relative flex-1 w-full">
          <Magnifier className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant z-10 w-5 h-5" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-md py-2 md:py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-large text-on-surface dark:text-inverse-on-surface placeholder:text-outline-variant/60"
            placeholder="Search by title or artist..."
            type="text"
          />
        </div>
        <div className="flex gap-sm items-center w-full md:w-auto">
          <Button
            className="md:hidden flex-1 flex items-center justify-center gap-xs bg-surface-container-lowest dark:bg-inverse-surface/60 text-on-surface dark:text-inverse-on-surface border border-outline-variant dark:border-outline-variant/30 py-2.5 rounded-lg h-[46px]"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Sliders className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          <div className="relative flex-1 md:flex-initial min-w-[180px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-sm md:px-md py-2 md:py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 text-on-surface dark:text-inverse-on-surface border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all font-body-large appearance-none pr-8 cursor-pointer h-[46px]"
            >
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Popularity</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant dark:text-outline-variant">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Tags */}
      <div className="flex flex-wrap justify-between items-center mb-md gap-md py-1.5">
        <div className="flex items-center gap-sm">
          <span className="font-body-small text-body-small text-on-surface-variant dark:text-outline-variant">
            Showing {artworks.length} of {total} results
          </span>
        </div>
        {(category !== "All Media" || priceMin || priceMax || searchTerm) && (
          <div className="flex flex-wrap gap-sm items-center">
            {category !== "All Media" && (
              <span className="px-sm py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-body-small flex items-center gap-xs">
                {category}
                <button onClick={() => setCategory("All Media")}>
                  <Xmark className="text-[16px] w-3 h-3 cursor-pointer" />
                </button>
              </span>
            )}
            {(priceMin || priceMax) && (
              <span className="px-sm py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-body-small flex items-center gap-xs">
                ${priceMin || 0} - ${priceMax || "∞"}
                <button
                  onClick={() => {
                    setPriceMin("");
                    setPriceMax("");
                  }}
                >
                  <Xmark className="text-[16px] w-3 h-3 cursor-pointer" />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="px-sm py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-body-small flex items-center gap-xs">
                Search: &quot;{searchTerm}&quot;
                <button onClick={() => setSearchTerm("")}>
                  <Xmark className="text-[16px] w-3 h-3 cursor-pointer" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-primary dark:text-primary-fixed-dim font-label-caps hover:underline text-body-small ml-xs cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md md:gap-lg items-start mt-sm">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 bg-surface-container-low dark:bg-inverse-surface/40 rounded-xl p-sm md:p-md border border-outline-variant/30 dark:border-outline-variant/10 shadow-sm space-y-md sticky top-24">
          <div>
            <h3 className="font-h3 text-h3 text-on-surface dark:text-inverse-on-surface mb-xs">
              Filters
            </h3>
            <hr className="border-outline-variant/30 mb-sm" />
          </div>

          <div className="space-y-sm">
            <h4 className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant">
              Categories
            </h4>
            <div className="flex flex-col gap-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-sm py-2 rounded-lg transition-all text-body-medium cursor-pointer ${
                    category === cat
                      ? "bg-primary/10 text-primary dark:text-primary-fixed-dim font-semibold"
                      : "text-on-surface-variant hover:bg-surface-container-lowest dark:hover:bg-inverse-surface/60 hover:text-on-surface"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-outline-variant/30" />

          <div className="space-y-sm">
            <h4 className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant">
              Price Range ($)
            </h4>
            <div className="flex gap-xs items-center">
              <Input
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                type="number"
                min={0}
                variant="bordered"
                size="sm"
                className="w-full"
              />
              <span className="text-outline dark:text-outline-variant font-body-small">
                to
              </span>
              <Input
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                type="number"
                min={0}
                variant="bordered"
                size="sm"
                className="w-full"
              />
            </div>
          </div>

          {(category !== "All Media" || priceMin || priceMax) && (
            <div className="pt-sm border-t border-outline-variant/20 mt-sm">
              <Button
                onClick={resetFilters}
                variant="light"
                color="danger"
                className="w-full hover:bg-danger/10 text-body-medium font-semibold"
              >
                Reset Active Filters
              </Button>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <section className="col-span-1 md:col-span-3">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
            </div>
          ) : showEmpty ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-lg">
                {artworks.map((artwork) => (
                  <Link
                    key={artwork.id}
                    href={`/artwork/${artwork.id}`}
                    className="block group"
                  >
                    <Card
                      className="art-card-hover art-card-img-scale bg-surface-container-lowest dark:bg-inverse-surface/40 rounded-xl overflow-hidden transition-all duration-300 border border-outline-variant/20 dark:border-outline-variant/10 shadow-sm cursor-pointer"
                      shadow="none"
                    >
                      <div className="relative aspect-square overflow-hidden bg-surface-variant">
                        {artwork.image ? (
                          <img
                            alt={artwork.title}
                            src={artwork.image || null}
                            className="w-full h-full object-cover transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface text-on-surface-variant text-center px-sm">
                            No image available
                          </div>
                        )}
                        <div className="absolute top-2 right-2 md:top-3 md:right-3">
                          <Button
                            isIconOnly
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-on-surface dark:text-inverse-on-surface hover:text-error transition-colors"
                            variant="light"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Heart className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-sm md:p-md">
                        <span className="text-[10px] md:text-label-caps font-label-caps text-secondary dark:text-secondary-fixed mb-xs block">
                          {artwork.category}
                        </span>
                        <h3 className="text-body-large md:text-h3 font-h3 text-on-surface dark:text-inverse-on-surface group-hover:text-primary dark:group-hover:text-primary-fixed-dim transition-colors truncate">
                          {artwork.title}
                        </h3>
                        <p className="font-body-small text-body-small text-on-surface-variant dark:text-outline-variant mt-xs">
                          by {artwork.artistName || artwork.artist || "Unknown Artist"}
                        </p>
                        <div className="mt-sm pt-sm md:mt-md md:pt-md border-t border-outline-variant dark:border-outline-variant/20 flex justify-between items-center">
                          <span className="text-body-large md:text-h3 font-h3 text-on-surface dark:text-inverse-on-surface">
                            ${typeof artwork.price === "number" ? artwork.price.toLocaleString() : artwork.price}
                          </span>
                          <Button
                            isIconOnly
                            variant="light"
                            className="text-primary dark:text-primary-fixed-dim w-8 h-8 min-w-8 md:w-10 md:h-10 md:min-w-10"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </section>
      </div>

      {/* Mobile Filters Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileFiltersOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface dark:bg-inverse-surface p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out border-r border-outline-variant/30 dark:border-outline-variant/10 ${
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="space-y-md overflow-y-auto pb-4">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm">
              <h3 className="font-h3 text-h3 text-on-surface dark:text-inverse-on-surface">
                Filters
              </h3>
              <Button
                isIconOnly
                variant="light"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <Xmark className="w-5 h-5 text-on-surface dark:text-inverse-on-surface" />
              </Button>
            </div>

            <div className="space-y-sm">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant">
                Categories
              </h4>
              <div className="flex flex-col gap-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-sm py-2 rounded-lg transition-all text-body-medium cursor-pointer ${
                      category === cat
                        ? "bg-primary/10 text-primary dark:text-primary-fixed-dim font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-outline-variant/30" />

            <div className="space-y-sm">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant">
                Price Range ($)
              </h4>
              <div className="flex gap-xs items-center">
                <Input
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                  type="number"
                  min={0}
                  variant="bordered"
                  size="sm"
                  className="w-full"
                />
                <span className="text-outline dark:text-outline-variant font-body-small">
                  to
                </span>
                <Input
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  type="number"
                  min={0}
                  variant="bordered"
                  size="sm"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-md border-t border-outline-variant/30 space-y-sm">
            {(category !== "All Media" || priceMin || priceMax) && (
              <Button
                onClick={resetFilters}
                variant="light"
                color="danger"
                className="w-full text-body-medium font-semibold"
              >
                Clear All Filters
              </Button>
            )}
            <Button
              className="w-full bg-primary text-on-primary font-semibold"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
