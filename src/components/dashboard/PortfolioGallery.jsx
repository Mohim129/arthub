export default function PortfolioGallery({ artworks }) {
  return (
    <section className="flex flex-col gap-md">
      <h2 className="font-h2 text-h2 text-on-surface">Portfolio Spotlight</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-md h-[500px]">
        {/* Use the first artwork as large featured one */}
        {artworks.length > 0 && (
          <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${artworks[0].image}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-lg">
              <span className="bg-primary px-sm py-xs rounded-full font-label-caps text-label-caps text-on-primary mb-sm inline-block">
                MOST VALUABLE
              </span>
              <p className="font-h1-desktop text-h1-desktop font-bold text-white">
                {artworks[0].title}
              </p>
              <p className="font-body-large text-body-large text-surface-bright">
                Acquired: {artworks[0].date}
              </p>
            </div>
          </div>
        )}

        {/* Remaining artworks */}
        {artworks.slice(1).map((art) => (
          <div
            key={art.id}
            className={`relative rounded-xl overflow-hidden group ${
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
                  Acquired: {art.date}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
