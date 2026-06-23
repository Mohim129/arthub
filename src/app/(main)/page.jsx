import { categories } from "@/data/categories";
import { browseArtworks } from "@/data/browseArtworks";
import { topArtists } from "@/data/topArtists";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCard from "@/components/CategoryCard";
import ArtworkCard from "@/components/ArtworkCard";
import SkeletonCard from "@/components/SkeletonCard";
import ArtistCard from "@/components/ArtistCard";
import NewsletterCTA from "@/components/NewsletterCTA";
import { Button } from "@heroui/react";
import { ChevronRight } from "@gravity-ui/icons";

export default function Home() {
  const isLoading = false;

  return (
    <>
      <HeroCarousel />

      <section className="py-xl max-w-container-max mx-auto px-gutter">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} category={cat} />
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
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : browseArtworks
                  .slice(0, 6)
                  .map((art) => <ArtworkCard key={art.id} artwork={art} />)}
          </div>
        </div>
      </section>

      <section className="py-xl max-w-container-max mx-auto px-gutter">
        <h2 className="font-h1-desktop text-h1-desktop mb-lg text-center text-on-surface dark:text-inverse-on-surface">
          Top Artists This Month
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {topArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}
