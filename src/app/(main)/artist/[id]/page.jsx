"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Person, Picture } from "@gravity-ui/icons";
import { Spinner } from "@heroui/react";

export default function ArtistProfilePage() {
  const params = useParams();
  const id = params.id;

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/proxy/api/artists/${id}`);
        if (response.status === 404) {
          throw new Error("Artist not found");
        }
        if (!response.ok) {
          throw new Error("Failed to load artist profile");
        }
        const data = await response.json();
        setArtist(data);
      } catch (err) {
        setError(err.message || "Failed to load artist profile");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-md text-on-surface-variant">Loading artist profile…</p>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="font-h2 text-h2 mb-md text-on-surface dark:text-inverse-on-surface">
          {error || "Artist not found"}
        </h1>
        <p className="text-on-surface-variant mb-lg">
          We could not find an artist profile for this link.
        </p>
        <Link
          href="/browse"
          className="text-primary dark:text-primary-fixed-dim font-semibold hover:underline"
        >
          Browse artworks instead
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen">
      <section className="rounded-3xl border border-outline-variant/30 bg-surface-container-low dark:bg-inverse-surface/20 p-lg shadow-sm mb-xl">
        <div className="flex flex-col md:flex-row gap-lg items-center md:items-start">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-inverse-surface shadow-md shrink-0">
            {artist.image ? (
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary-container dark:bg-secondary">
                <Person className="w-16 h-16 text-on-secondary-container dark:text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-outline mb-xs">
              Artist Profile
            </p>
            <h1 className="font-h1-desktop text-h1-desktop text-on-surface dark:text-inverse-on-surface mb-sm">
              {artist.name}
            </h1>
            {artist.bio && (
              <p className="text-on-surface-variant dark:text-outline-variant text-body-large mb-md max-w-2xl">
                {artist.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-md justify-center md:justify-start text-body-small">
              <span className="rounded-full bg-surface-container-high dark:bg-inverse-surface/40 px-md py-xs text-on-surface-variant">
                {artist.totalArtworks}{" "}
                {artist.totalArtworks === 1 ? "Artwork" : "Artworks"}
              </span>
              {artist.role && (
                <span className="rounded-full bg-surface-container-high dark:bg-inverse-surface/40 px-md py-xs text-on-surface-variant capitalize">
                  {artist.role}
                </span>
              )}
              {artist.joinedAt && (
                <span className="rounded-full bg-surface-container-high dark:bg-inverse-surface/40 px-md py-xs text-on-surface-variant">
                  Joined {new Date(artist.joinedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-outline-variant/30 bg-surface-container-low dark:bg-inverse-surface/20 shadow-sm overflow-hidden">
        <div className="p-lg border-b border-outline-variant/30">
          <p className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-outline">
            Collection
          </p>
          <h2 className="font-h3 text-h3 text-on-surface dark:text-inverse-on-surface mt-xs">
            Artworks by {artist.name}
          </h2>
        </div>

        {artist.artworks.length === 0 ? (
          <p className="p-lg text-on-surface-variant text-center">
            This artist hasn&apos;t listed any artworks yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-high dark:bg-inverse-surface/30 border-b border-outline-variant/30">
                <tr>
                  <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                    Image
                  </th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                    Title
                  </th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                    Category
                  </th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                    Price
                  </th>
                  <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {artist.artworks.map((artwork) => (
                  <tr
                    key={artwork.id}
                    className="hover:bg-surface-container-high/50 dark:hover:bg-inverse-surface/20 transition-colors"
                  >
                    <td className="px-lg py-md">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
                        {artwork.image ? (
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                            <Picture className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-lg py-md">
                      <Link
                        href={`/artwork/${artwork.id}`}
                        className="font-semibold text-on-surface dark:text-inverse-on-surface hover:text-primary dark:hover:text-primary-fixed-dim transition-colors"
                      >
                        {artwork.title}
                      </Link>
                    </td>
                    <td className="px-lg py-md text-on-surface-variant">
                      {artwork.category}
                    </td>
                    <td className="px-lg py-md font-semibold text-primary dark:text-primary-fixed-dim">
                      $
                      {typeof artwork.price === "number"
                        ? artwork.price.toLocaleString()
                        : artwork.price}
                    </td>
                    <td className="px-lg py-md">
                      <span className="inline-block rounded-full bg-surface-container-high dark:bg-inverse-surface/40 px-sm py-xs text-body-small capitalize text-on-surface-variant">
                        {artwork.status || "unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
