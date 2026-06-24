"use client";
import { useState, useEffect } from "react";
import { Pencil, TrashBin, ArrowRight, Picture } from "@gravity-ui/icons";
import { getArtistArtworks } from "@/lib/api/artworks";
import { authClient } from "@/lib/auth-client"; // adjust path if needed

export default function ArtworkTable({ onEdit, onDelete }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move session hook to top-level to preserve hook order
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) {
      setError("You must be logged in to view your artworks.");
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchArtworks() {
      try {
        setLoading(true);
        const data = await getArtistArtworks(userId);
        if (mounted) setArtworks(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load artworks.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchArtworks();

    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <section>
        <div className="text-center py-20 text-on-surface-variant">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full mb-4" />
          <p>Loading artworks…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="text-center py-20 text-error">{error}</div>
      </section>
    );
  }

  if (artworks.length === 0) {
    return (
      <section>
        <div className="text-center py-20 text-on-surface-variant">
          <Picture className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>You haven&apos;t uploaded any artwork yet.</p>
        </div>
      </section>
    );
  }

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
                      <div className="w-12 h-12 rounded bg-surface-variant overflow-hidden shrink-0 flex items-center justify-center">
                        {artwork.image ? (
                          <img
                            className="w-full h-full object-cover"
                            alt={artwork.title}
                            src={artwork.image}
                          />
                        ) : (
                          <Picture className="w-6 h-6 text-on-surface-variant" />
                        )}
                      </div>
                      <span className="font-bold">{artwork.title}</span>
                    </div>
                  </td>
                  <td className="p-md">
                    <span
                      className={`inline-flex items-center px-sm py-xs rounded-full text-xs font-bold ${
                        artwork.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {artwork.status}
                    </span>
                  </td>
                  <td className="p-md font-body-large text-body-large">
                    ${artwork.price}
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
