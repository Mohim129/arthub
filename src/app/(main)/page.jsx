"use client";

import { useState, useEffect } from "react";
import { categories } from "@/data/categories";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCard from "@/components/CategoryCard";
import ArtworkCard from "@/components/ArtworkCard";
import SkeletonCard from "@/components/SkeletonCard";
import ArtistCard from "@/components/ArtistCard";
import NewsletterCTA from "@/components/NewsletterCTA";
import { Button } from "@heroui/react";
import { ChevronRight } from "@gravity-ui/icons";

export default function Home() {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [errorArtworks, setErrorArtworks] = useState(null);
  const [errorArtists, setErrorArtists] = useState(null);

useEffect(() => {
  const fetchFeaturedArtworks = async () => {
    try {
      setLoadingArtworks(true);
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
      const response = await fetch(
        `${baseUrl}/api/artworks?limit=6&sortBy=createdAt&sortOrder=desc`,
      );
      if (!response.ok) throw new Error("Failed to fetch artworks");
      const data = await response.json();
      setFeaturedArtworks(data.artworks || []);
    } catch (err) {
      setErrorArtworks(err.message);
    } finally {
      setLoadingArtworks(false);
    }
  };

  fetchFeaturedArtworks();
}, []);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setLoadingArtists(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/artists/top`);
        if (!response.ok) throw new Error("Failed to fetch top artists");
        const data = await response.json();
        setTopArtists(data);
      } catch (err) {
        setErrorArtists(err.message);
      } finally {
        setLoadingArtists(false);
      }
    };

    fetchTopArtists();
  }, []);
  

  return (
    <>
      
      <HeroCarousel />

      <section className="py-xl max-w-container-max mx-auto px-gutter">
        <div className="mb-lg text-center md:text-left">
          <span className="font-label-caps text-label-caps text-primary dark:text-primary-fixed-dim mb-xs block">
            EXPLORE BY STYLE
          </span>
          <h2 className="font-h1-desktop text-h1-desktop text-on-surface dark:text-inverse-on-surface">
            Art Categories
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat} />
          ))}
        </div>
      </section>

      <section className="py-xl bg-surface-container-lowest dark:bg-inverse-surface/20 transition-colors duration-300">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <span className="font-label-caps text-label-caps text-primary dark:text-primary-fixed-dim mb-xs block">
                CURATED SELECTION
              </span>
              <h2 className="font-h1-desktop text-h1-desktop text-on-surface dark:text-inverse-on-surface">
                Featured Artworks
              </h2>
            </div>
            <Button
              as="a"
              href="/browse"
              variant="light"
              className="text-primary dark:text-primary-fixed-dim font-semibold flex items-center gap-xs hover:gap-sm transition-all"
              endContent={<ChevronRight />}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {loadingArtworks ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : errorArtworks ? (
              <div className="col-span-full text-center text-on-surface-variant py-lg">
                {errorArtworks}
              </div>
            ) : featuredArtworks.length > 0 ? (
              featuredArtworks.map((art) => (
                <ArtworkCard key={art.id} artwork={art} />
              ))
            ) : (
              <div className="col-span-full text-center text-on-surface-variant py-lg">
                No artworks available
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-xl max-w-container-max mx-auto px-gutter">
        <h2 className="font-h1-desktop text-h1-desktop mb-lg text-center text-on-surface dark:text-inverse-on-surface">
          Top Artists This Month
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {loadingArtists ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-surface-container rounded-lg animate-pulse"
              />
            ))
          ) : errorArtists ? (
            <div className="col-span-full text-center text-on-surface-variant py-lg">
              {errorArtists}
            </div>
          ) : topArtists.length > 0 ? (
            topArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))
          ) : (
            <div className="col-span-full text-center text-on-surface-variant py-lg">
              No artists found
            </div>
          )}
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}
