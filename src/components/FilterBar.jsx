"use client";
import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Magnifier, Sliders, Xmark } from "@gravity-ui/icons";

export default function FilterBar({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Media");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const [activeFilters, setActiveFilters] = useState([]);

  const handleFilter = () => {
    onFilterChange?.({ searchTerm, category, priceMin, priceMax, sortBy });
    const filters = [];
    if (priceMin || priceMax)
      filters.push(`$${priceMin || 0} - $${priceMax || "∞"}`);
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All Media");
    setPriceMin("");
    setPriceMax("");
    setSortBy("Newest First");
    setActiveFilters([]);
    onFilterChange?.({
      searchTerm: "",
      category: "All Media",
      priceMin: "",
      priceMax: "",
      sortBy: "Newest First",
    });
  };

  return (
    <div className="bg-surface-container-low dark:bg-inverse-surface/40 rounded-xl p-md mb-lg shadow-sm border border-outline-variant/30 dark:border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-end">
        {/* Search Field */}
        <div className="md:col-span-4 relative">
          <label className="block font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant mb-xs">
            Search Artworks
          </label>
          <div className="relative">
            <Magnifier className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant z-10" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-md py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-large text-on-surface dark:text-inverse-on-surface"
              placeholder="Title, Artist, or Keywords"
              type="text"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-2">
          <label className="block font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant mb-xs">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-md py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 text-on-surface dark:text-inverse-on-surface border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all font-body-large appearance-none"
          >
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">All Media</option>
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Digital Painting</option>
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">3D Abstract</option>
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Generative Art</option>
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Photography</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="md:col-span-3">
          <label className="block font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant mb-xs">
            Price Range ($)
          </label>
          <div className="flex gap-xs items-center">
            <Input
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full px-base py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-large text-on-surface dark:text-inverse-on-surface"
              placeholder="Min"
              type="number"
            />
            <span className="text-outline dark:text-outline-variant">to</span>
            <Input
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full px-base py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-large text-on-surface dark:text-inverse-on-surface"
              placeholder="Max"
              type="number"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="md:col-span-2">
          <label className="block font-label-caps text-label-caps text-on-surface-variant dark:text-outline-variant mb-xs">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-md py-2.5 bg-surface-container-lowest dark:bg-inverse-surface/60 text-on-surface dark:text-inverse-on-surface border border-outline-variant dark:border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all font-body-large appearance-none"
          >
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Newest First</option>
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Price: Low to High</option>
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Price: High to Low</option>
            <option className="bg-surface dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface">Popularity</option>
          </select>
        </div>

        {/* Filter Action */}
        <div className="md:col-span-1">
          <Button
            onPress={handleFilter}
            className="w-full h-[46px] flex items-center justify-center bg-primary text-on-primary rounded-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <Sliders />
          </Button>
        </div>
      </div>

      {/* Active Filters / Results Info */}
      <div className="flex flex-wrap justify-between items-center mb-md gap-md mt-4">
        <div className="flex items-center gap-sm">
          <span className="font-body-small text-body-small text-on-surface-variant dark:text-outline-variant">
            Showing 24 of 1,284 results
          </span>
        </div>
        {activeFilters.length > 0 && (
          <div className="flex gap-sm">
            {activeFilters.map((filter, idx) => (
              <span
                key={idx}
                className="px-sm py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-body-small flex items-center gap-xs"
              >
                {filter}
                <button onClick={clearFilters}>
                  <Xmark className="text-[16px]" />
                </button>
              </span>
            ))}
            <button
              className="text-primary dark:text-primary-fixed-dim font-label-caps hover:underline"
              onClick={clearFilters}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
