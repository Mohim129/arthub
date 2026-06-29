import Link from "next/link";

export default function PortfolioGallery({ artworks, loading }) {
  if (loading) {
    return (
      <section className="flex flex-col gap-md">
        <h2 className="font-h2 text-h2 text-on-surface">Bought Artworks</h2>
        <div className="text-center py-12 text-on-surface-variant">
          Loading your collection...
        </div>
      </section>
    );
  }

  if (artworks.length === 0) {
    return (
      <section className="flex flex-col gap-md">
        <h2 className="font-h2 text-h2 text-on-surface">Bought Artworks</h2>
        <div className="text-center py-12 text-on-surface-variant">
          No artworks in your collection yet. Start collecting!
        </div>
      </section>
    );
  }

  const totalCopies = artworks.reduce((sum, art) => sum + (art.count || 1), 0);

  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-baseline justify-between gap-sm">
        <h2 className="font-h2 text-h2 text-on-surface">Bought Artworks</h2>
        <span className="text-body-small text-on-surface-variant">
          {artworks.length} unique · {totalCopies} total
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-md">
        {artworks.map((art) => (
          <Link
            key={art.id}
            href={`/artwork/${art.id}`}
            className="relative rounded-xl overflow-hidden group block cursor-pointer aspect-square"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${art.image}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 via-transparent to-transparent" />
            {art.count > 1 && (
              <span className="absolute top-sm right-sm bg-primary text-on-primary font-bold text-body-small min-w-[28px] h-7 px-sm rounded-full flex items-center justify-center shadow-md">
                Total bought: {art.count}
              </span>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-sm md:p-md">
              <p className="font-h3 text-h3 font-bold text-white truncate">
                {art.title}
              </p>
              {art.date && (
                <p className="font-body-small text-surface-bright">
                  Last acquired:{" "}
                  {new Date(art.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
