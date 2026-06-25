import Link from "next/link";

export default function PortfolioGallery({ artworks, loading }) {
  if (loading) {
    return (
      <section className="flex flex-col gap-md">
        <h2 className="font-h2 text-h2 text-on-surface">Portfolio Spotlight</h2>
        <div className="text-center py-12 text-on-surface-variant">
          Loading your portfolio...
        </div>
      </section>
    );
  }

  if (artworks.length === 0) {
    return (
      <section className="flex flex-col gap-md">
        <h2 className="font-h2 text-h2 text-on-surface">Portfolio Spotlight</h2>
        <div className="text-center py-12 text-on-surface-variant">
          No artworks in your portfolio yet. Start collecting!
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-md">
      <h2 className="font-h2 text-h2 text-on-surface">Portfolio Spotlight</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-md h-[500px]">
        {/* Use the first artwork as large featured one */}
        {artworks.length > 0 && (
          <Link
            href={`/artwork/${artworks[0].id}`}
            className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group block cursor-pointer"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${artworks[0].image}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-lg">
              <span className="bg-primary px-sm py-xs rounded-full font-label-caps text-label-caps text-on-primary mb-sm inline-block">
                MOST RECENT
              </span>
              <p className="font-h1-desktop text-h1-desktop font-bold text-white">
                {artworks[0].title}
              </p>
              <p className="font-body-large text-body-large text-surface-bright">
                Acquired: {artworks[0].date ? new Date(artworks[0].date).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </Link>
        )}

        {/* Remaining artworks */}
        {artworks.slice(1).map((art) => (
          <Link
            key={art.id}
            href={`/artwork/${art.id}`}
            className={`relative rounded-xl overflow-hidden group block cursor-pointer ${
              artworks.length === 4 && art.id === artworks[2]?.id
                ? "md:col-span-2"
                : "md:col-span-1"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${art.image}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-md">
              <p className="font-h3 text-h3 font-bold text-white">
                {art.title}
              </p>
              {art.date && (
                <p className="font-body-small text-surface-bright">
                  Acquired: {new Date(art.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
