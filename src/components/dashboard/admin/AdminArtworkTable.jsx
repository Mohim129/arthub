"use client";
import { useState } from "react";
import { Magnifier, TrashBin } from "@gravity-ui/icons";

export default function AdminArtworkTable({ artworks, onDelete = null }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtworks = artworks.filter((art) => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="glass-card rounded-xl shadow-sm overflow-hidden mb-xl">
      <div className="p-lg border-b border-surface-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h4 className="font-h3 text-h3 text-on-surface">Manage All Artworks</h4>
          <p className="text-body-small text-on-surface-variant">
            Overview and moderation of all artworks listed in the marketplace.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Magnifier className="absolute left-sm top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full pl-lg pr-md py-sm rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary outline-none text-body-small"
            placeholder="Search artworks..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                Title
              </th>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                Artist Name
              </th>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline">
                Price
              </th>
              <th className="px-lg py-md font-label-caps text-label-caps text-outline text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filteredArtworks.length > 0 ? (
              filteredArtworks.map((art) => (
                <tr
                  key={art.id}
                  className="hover:bg-surface-container-low/50 transition-colors group"
                >
                  <td className="px-lg py-md font-bold text-on-surface">
                    {art.title}
                  </td>
                  <td className="px-lg py-md font-body-large text-on-surface-variant">
                    {art.artistName}
                  </td>
                  <td className="px-lg py-md font-h3 text-h3 text-primary">
                    {typeof art.price === "number" ? `$${art.price}` : art.price}
                  </td>
                  <td className="px-lg py-md text-right">
                    <button
                      onClick={() => onDelete && onDelete(art.id)}
                      className="text-error hover:opacity-70 transition-colors p-xs rounded-full hover:bg-error-container cursor-pointer"
                      title="Delete Artwork"
                    >
                      <TrashBin />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-lg text-on-surface-variant font-body-large">
                  No artworks found matching search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-md bg-surface-container-low border-t border-surface-variant flex justify-between items-center">
        <span className="text-body-small text-on-surface-variant">
          Showing 1-{filteredArtworks.length} of {filteredArtworks.length} artworks
        </span>
      </div>
    </section>
  );
}
