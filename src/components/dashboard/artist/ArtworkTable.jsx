import { Pencil, TrashBin, ArrowRight } from "@gravity-ui/icons";

export default function ArtworkTable({ artworks, onEdit = null, onDelete = null }) {
  return (
    <section>
      <div className="flex justify-between items-end mb-md">
        <div>
          <h2 className="font-h2 text-h2 mb-xs">Recent Submissions</h2>
          <p className="text-on-surface-variant font-body-large text-body-large">
            Review and manage your active listings.
          </p>
        </div>
        <a href="#" className="text-primary font-bold flex items-center gap-xs">
          View All <ArrowRight className="text-sm" />
        </a>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/30">
              <tr>
                <th className="p-md text-label-caps font-label-caps text-on-surface-variant">
                  ARTWORK
                </th>
                <th className="p-md text-label-caps font-label-caps text-on-surface-variant">
                  STATUS
                </th>
                <th className="p-md text-label-caps font-label-caps text-on-surface-variant">
                  PRICE
                </th>
                <th className="p-md text-label-caps font-label-caps text-on-surface-variant text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {artworks.map((artwork) => (
                <tr
                  key={artwork.id}
                  className="hover:bg-surface-container/30 transition-colors"
                >
                  <td className="p-md">
                    <div className="flex items-center gap-md">
                      <div className="w-12 h-12 rounded bg-surface-variant overflow-hidden shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          alt={artwork.title}
                          src={artwork.image}
                        />
                      </div>
                      <span className="font-bold">{artwork.title}</span>
                    </div>
                  </td>
                  <td className="p-md">
                    <span
                      className={`inline-flex items-center px-sm py-xs rounded-full text-xs font-bold ${
                        artwork.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {artwork.status}
                    </span>
                  </td>
                  <td className="p-md font-body-large text-body-large">
                    {artwork.price}
                  </td>
                  <td className="p-md text-right">
                    <div className="flex justify-end gap-sm">
                      <button 
                        onClick={() => onEdit && onEdit(artwork)}
                        className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container-high cursor-pointer"
                      >
                        <Pencil />
                      </button>
                      <button 
                        onClick={() => onDelete && onDelete(artwork.id)}
                        className="text-error hover:opacity-70 transition-colors p-xs rounded-full hover:bg-error-container cursor-pointer"
                      >
                        <TrashBin />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
