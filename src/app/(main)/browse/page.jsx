"use client";
import { useState, useEffect, useRef } from "react";
import { browseArtworks } from "@/data/browseArtworks";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";
import { Card, Button, Input } from "@heroui/react";
import { Heart, ShoppingCart, Magnifier, Sliders, Xmark } from "@gravity-ui/icons";
import Link from "next/link";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredArtworks, setFilteredArtworks] = useState(browseArtworks);
  const [showEmpty, setShowEmpty] = useState(false);
  
  // Keep isLoading as true for loading page simulation (for later use)
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Media");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filterTimeoutRef = useRef(null);

  // Wrapper functions to set loading and state together
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setIsLoading(true);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setIsLoading(true);
  };

  const handlePriceMinChange = (val) => {
    setPriceMin(val);
    setIsLoading(true);
  };

  const handlePriceMaxChange = (val) => {
    setPriceMax(val);
    setIsLoading(true);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    setIsLoading(true);
  };

  // Reactive filtering (no synchronous setState inside the effect body)
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    // Demo: typing "empty" shows empty state immediately
    if (
      searchTerm &&
      (searchTerm.toLowerCase() === "empty" ||
        searchTerm.toLowerCase() === "none")
    ) {
      filterTimeoutRef.current = setTimeout(() => {
        setShowEmpty(true);
        setFilteredArtworks([]);
        setCurrentPage(1);
        // Commented out to simulate a persistent loading page for later use
        // setIsLoading(false);
      }, 400);
      return;
    }

    filterTimeoutRef.current = setTimeout(() => {
      let results = [...browseArtworks];

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(
          (art) =>
            art.title.toLowerCase().includes(term) ||
            art.artist.toLowerCase().includes(term),
        );
      }

      // Category filter
      if (category && category !== "All Media") {
        results = results.filter((art) => art.category === category);
      }

      // Price range
      if (priceMin) {
        results = results.filter((art) => art.price >= Number(priceMin));
      }
      if (priceMax) {
        results = results.filter((art) => art.price <= Number(priceMax));
      }

      // Sort
      if (sortBy === "Price: Low to High") {
        results.sort((a, b) => a.price - b.price);
      } else if (sortBy === "Price: High to Low") {
        results.sort((a, b) => b.price - a.price);
      } else if (sortBy === "Popularity") {
        results.sort((a, b) => (a.id % 2) - (b.id % 2));
      } else if (sortBy === "Newest First") {
        results.sort((a, b) => b.id - a.id);
      }

      setShowEmpty(results.length === 0);
      setFilteredArtworks(results);
      setCurrentPage(1);
      
      // NOTE: Uncomment this line to stop loading skeletons when you implement actual data fetching.
      // setIsLoading(false);
    }, 400);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [searchTerm, category, priceMin, priceMax, sortBy]);

  const resetFilters = () => {
    setIsLoading(true);
    setSearchTerm("");
    setCategory("All Media");
    setPriceMin("");
    setPriceMax("");
    setSortBy("Newest First");
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

        {/* Search, Sort, and Toggle Topbar */}
        <div className="flex flex-col md:flex-row gap-sm md:gap-md items-center justify-between bg-surface-container-low dark:bg-inverse-surface/40 rounded-xl p-sm md:p-md mb-sm md:mb-md shadow-sm border border-outline-variant/30 dark:border-outline-variant/10">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Magnifier className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant z-10 w-5 h-5" />
            <input
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-md py-2 md:py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-large text-on-surface dark:text-inverse-on-surface placeholder:text-outline-variant/60"
              placeholder="Search by title, artist, or keywords..."
              type="text"
            />
          </div>

          <div className="flex gap-sm items-center w-full md:w-auto">
            {/* Mobile Filters Toggle Button */}
            <Button
              className="md:hidden flex-1 flex items-center justify-center gap-xs bg-surface-container-lowest dark:bg-inverse-surface/60 text-on-surface dark:text-inverse-on-surface border border-outline-variant dark:border-outline-variant/30 py-2.5 rounded-lg h-[46px]"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Sliders className="w-4 h-4" />
              <span>Filters</span>
            </Button>

            {/* Sort Bar */}
            <div className="relative flex-1 md:flex-initial min-w-[180px]">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-sm md:px-md py-2 md:py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 text-on-surface dark:text-inverse-on-surface border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all font-body-large appearance-none pr-8 cursor-pointer h-[46px]"
              >
                <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Newest First</option>
                <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Price: Low to High</option>
                <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Price: High to Low</option>
                <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Popularity</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant dark:text-outline-variant">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info & Active Filters Tags */}
        <div className="flex flex-wrap justify-between items-center mb-md gap-md py-1.5">
          <div className="flex items-center gap-sm">
            <span className="font-body-small text-body-small text-on-surface-variant dark:text-outline-variant">
              Showing {filteredArtworks.length} of {browseArtworks.length} results
            </span>
          </div>
          {(category !== "All Media" || priceMin || priceMax || searchTerm) && (
            <div className="flex flex-wrap gap-sm items-center">
              {category !== "All Media" && (
                <span className="px-sm py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-body-small flex items-center gap-xs">
                  {category}
                  <button onClick={() => handleCategoryChange("All Media")}>
                    <Xmark className="text-[16px] w-3 h-3 cursor-pointer" />
                  </button>
                </span>
              )}
              {(priceMin || priceMax) && (
                <span className="px-sm py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-body-small flex items-center gap-xs">
                  ${priceMin || 0} - ${priceMax || "∞"}
                  <button onClick={() => { handlePriceMinChange(""); handlePriceMaxChange(""); }}>
                    <Xmark className="text-[16px] w-3 h-3 cursor-pointer" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="px-sm py-1 bg-primary/10 text-primary dark:text-primary-fixed-dim rounded-full text-body-small flex items-center gap-xs">
                  Search: &quot;{searchTerm}&quot;
                  <button onClick={() => handleSearchChange("")}>
                    <Xmark className="text-[16px] w-3 h-3 cursor-pointer" />
                  </button>
                </span>
              )}
              <button
                className="text-primary dark:text-primary-fixed-dim font-label-caps hover:underline text-body-small ml-xs cursor-pointer"
                onClick={resetFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md md:gap-lg items-start mt-sm">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block col-span-1 bg-surface-container-low dark:bg-inverse-surface/40 rounded-xl p-sm md:p-md border border-outline-variant/30 dark:border-outline-variant/10 shadow-sm space-y-md sticky top-24">
            <div>
              <h3 className="font-h3 text-h3 text-on-surface dark:text-inverse-on-surface mb-xs">Filters</h3>
              <hr className="border-outline-variant/30 mb-sm" />
            </div>

            {/* Categories */}
            <div className="space-y-sm">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant">
                Categories
              </h4>
              <div className="flex flex-col gap-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
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

            {/* Price Range */}
            <div className="space-y-sm">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant">
                Price Range ($)
              </h4>
              <div className="flex gap-xs items-center">
                <Input
                  value={priceMin}
                  onChange={(e) => handlePriceMinChange(e.target.value)}
                  placeholder="Min"
                  type="number"
                  variant="bordered"
                  size="sm"
                  className="w-full"
                />
                <span className="text-outline dark:text-outline-variant font-body-small">to</span>
                <Input
                  value={priceMax}
                  onChange={(e) => handlePriceMaxChange(e.target.value)}
                  placeholder="Max"
                  type="number"
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

          {/* Main Content Area */}
          <section className="col-span-1 md:col-span-3">
            {showEmpty ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <>
                {/* Results Grid - Responsive: 2 cols on mobile, 3 on tablet, 4 on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-lg">
                  {isLoading
                    ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))
                    : paginatedArtworks.map((artwork) => (
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
                              <img
                                alt={artwork.title}
                                src={artwork.image}
                                className="w-full h-full object-cover transition-transform duration-500"
                              />
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
                                by {artwork.artist}
                              </p>
                              <div className="mt-sm pt-sm md:mt-md md:pt-md border-t border-outline-variant dark:border-outline-variant/20 flex justify-between items-center">
                                <span className="text-body-large md:text-h3 font-h3 text-on-surface dark:text-inverse-on-surface">
                                  ${artwork.price.toLocaleString()}
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
          </section>
        </div>

        {/* Mobile Filters Drawer Overlay */}
        <div
          className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
            mobileFiltersOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer Panel */}
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

              {/* Categories */}
              <div className="space-y-sm">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant">
                  Categories
                </h4>
                <div className="flex flex-col gap-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
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

              {/* Price Range */}
              <div className="space-y-sm">
                <h4 className="font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant">
                  Price Range ($)
                </h4>
                <div className="flex gap-xs items-center">
                  <Input
                    value={priceMin}
                    onChange={(e) => handlePriceMinChange(e.target.value)}
                    placeholder="Min"
                    type="number"
                    variant="bordered"
                    size="sm"
                    className="w-full"
                  />
                  <span className="text-outline dark:text-outline-variant font-body-small">to</span>
                  <Input
                    value={priceMax}
                    onChange={(e) => handlePriceMaxChange(e.target.value)}
                    placeholder="Max"
                    type="number"
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
    </>
  );
}
