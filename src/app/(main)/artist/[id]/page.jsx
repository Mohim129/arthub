import Link from "next/link";
import { getArtistArtworks } from "@/lib/api/artworks";
import { getUserById } from "@/lib/api/users";

export default async function ArtistProfilePage(props) {
  const params = await props.params;
  let artist = null;
  let artworks = [];

  try {
    artist = await getUserById(params.id);
  } catch (error) {
    artist = null;
  }

  try {
    artworks = await getArtistArtworks(params.id);
  } catch (error) {
    artworks = [];
  }

  if (!artist) {
    return (
      <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="font-h2 text-h2 mb-md">Artist not found</h1>
        <p className="text-on-surface-variant mb-lg">
          We could not find an artist profile for this link.
        </p>
        <Link href="/browse" className="text-primary font-semibold hover:underline">
          Browse artworks instead
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen">
      <section className="grid gap-lg">
        <div className="rounded-3xl border border-surface-variant/70 bg-surface-container-low p-lg shadow-sm">
          <div className="flex flex-col lg:flex-row gap-lg items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-high">
              {artist.image ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface text-on-surface-variant">
                  {artist.name?.[0] || "A"}
                </div>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-label-caps uppercase tracking-[0.18em] text-outline">
                  Artist Profile
                </p>
                <h1 className="font-h1-desktop text-h1-desktop text-on-background mt-2">
                  {artist.name}
                </h1>
              </div>
              <div className="grid gap-sm sm:grid-cols-2">
                <div>
                  <p className="text-on-surface-variant text-body-large">
                    {artist.bio || "Creating bold digital artworks and connecting with collectors worldwide."}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="rounded-2xl bg-surface-container-high p-sm">
                    <p className="text-label-caps uppercase text-on-surface-variant">
                      Joined
                    </p>
                    <p className="font-semibold text-body-large mt-1">
                      {artist.createdAt
                        ? new Date(artist.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-surface-container-high p-sm">
                    <p className="text-label-caps uppercase text-on-surface-variant">
                      Role
                    </p>
                    <p className="font-semibold text-body-large mt-1">
                      {artist.role || "Artist"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-surface-variant/70 bg-surface-container-low p-lg shadow-sm">
          <div className="flex flex-col gap-sm sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-label-caps text-label-caps uppercase tracking-[0.18em] text-outline">
                Artworks by {artist.name}
              </p>
              <h2 className="font-h3 text-h3 text-on-background mt-2">
                Explore the artist’s collection
              </h2>
            </div>
            <Link
              href={`/browse?artist=${encodeURIComponent(artist.name)}`}
              className="text-primary font-semibold hover:underline"
            >
              View filtered gallery
            </Link>
          </div>

          {artworks.length === 0 ? (
            <p className="text-on-surface-variant mt-lg">
              There are no active artworks for this artist right now.
            </p>
          ) : (
            <div className="mt-lg grid gap-lg sm:grid-cols-2 xl:grid-cols-3">
              {artworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/artwork/${artwork.id}`}
                  className="rounded-3xl overflow-hidden border border-outline-variant/40 bg-surface-container-high shadow-sm transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="aspect-4/5 bg-surface-variant overflow-hidden">
                    {artwork.image ? (
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        No image available
                      </div>
                    )}
                  </div>
                  <div className="p-md">
                    <p className="text-sm font-medium text-primary">
                      {artwork.category}
                    </p>
                    <h3 className="mt-2 font-semibold text-body-large text-on-surface">
                      {artwork.title}
                    </h3>
                    <p className="mt-3 text-body-small text-on-surface-variant">
                      ${typeof artwork.price === "number" ? artwork.price.toLocaleString() : artwork.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
