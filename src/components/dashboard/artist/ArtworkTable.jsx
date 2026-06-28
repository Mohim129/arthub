"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Pencil,
  TrashBin,
  ArrowRight,
  Picture,
  Xmark,
  CloudArrowUpIn,
} from "@gravity-ui/icons";
import { getArtistArtworks, updateArtwork } from "@/lib/api/artworks";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

async function uploadToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
  if (!apiKey) throw new Error("Image upload API key is missing.");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed.");

  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Upload failed.");

  return json.data.url;
}

/* ─── Edit Modal ─── */
function EditModal({ artwork, onClose, onSaved }) {
  const [title, setTitle] = useState(artwork.title || "");
  const [category, setCategory] = useState(artwork.category || "Generative Art");
  const [description, setDescription] = useState(artwork.description || "");
  const [price, setPrice] = useState(
    artwork.price ? artwork.price.toString().replace(/[^0-9.]/g, "") : ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(artwork.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = artwork.image || "";

      if (imageFile) {
        setUploading(true);
        toast.loading("Uploading artwork image…", { id: "upload" });
        finalImageUrl = await uploadToImgBB(imageFile);
        toast.success("Image uploaded!", { id: "upload" });
        setUploading(false);
      } else if (!imagePreview) {
        finalImageUrl = "";
      }

      const updatedData = {
        title: title.trim(),
        category,
        description: description.trim(),
        price: priceNum,
        image: finalImageUrl,
      };
      await updateArtwork(artwork.id, updatedData);
      onSaved({ ...artwork, ...updatedData });
      toast.success(`Updated "${title.trim()}"!`);
    } catch (err) {
      toast.error(err.message || "Failed to update artwork.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-lg border-b border-outline-variant/20">
          <div>
            <h2 className="font-h2 text-h2">Edit Artwork</h2>
            <p className="text-on-surface-variant font-body-small text-body-small mt-1">
              Update the details of your listing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-xs rounded-full hover:bg-surface-container-high transition-colors"
          >
            <Xmark className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-lg space-y-md">
          {/* Title */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Serenity #04"
              className="w-full rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-low px-3 py-2.5 text-on-surface outline-none transition-all"
              required
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-low px-3 py-2.5 text-on-surface outline-none transition-all"
            >
              <option>Generative Art</option>
              <option>Digital Painting</option>
              <option>3D Abstract</option>
              <option>Photography</option>
              <option>Digital Illustration</option>
              <option>Painting</option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Tell the story behind this piece..."
              className="w-full rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-low px-3 py-2.5 text-on-surface outline-none transition-all resize-none"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              PRICE (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || Number(val) >= 0) setPrice(val);
                }}
                className="w-full rounded-lg border border-outline-variant/30 focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-low pl-8 pr-3 py-2.5 text-on-surface outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Artwork Image Upload */}
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              ARTWORK IMAGE
            </label>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low max-h-[240px] flex items-center justify-center group">
                <img
                  src={imagePreview}
                  alt="Artwork preview"
                  className="max-h-[240px] object-contain w-full"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-md">
                  <label className="bg-white text-on-surface px-md py-sm rounded-lg font-bold cursor-pointer hover:bg-surface-bright shadow-sm">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="bg-error text-on-error p-sm rounded-full shadow-sm hover:opacity-90"
                  >
                    <Xmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudArrowUpIn className="text-primary text-[40px] mb-sm" />
                <h3 className="font-h3 text-h3 mb-xs">Click to upload</h3>
                <p className="text-body-small text-on-surface-variant">
                  JPG, PNG or GIF (Max 10 MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageFileChange}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-sm pt-sm">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container-high text-on-surface-variant py-2.5 rounded-lg font-bold transition-all hover:bg-surface-container-highest active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-[2] bg-primary text-on-primary py-2.5 rounded-lg font-bold shadow-lg hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading image…" : saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Artwork Table ─── */
export default function ArtworkTable({ onEdit, onDelete }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null); // artwork object for modal

  // Get session
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // Fetch artworks
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

  // Called when the modal saves successfully
  const handleModalSaved = (updatedArtwork) => {
    setArtworks((prev) =>
      prev.map((art) =>
        art.id === updatedArtwork.id ? { ...art, ...updatedArtwork } : art
      )
    );
    setEditingArtwork(null);
  };

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
                    <Link
                      href={`/artwork/${artwork.id}`}
                      className="flex items-center gap-md hover:opacity-80 transition-opacity cursor-pointer"
                    >
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
                      <span className="font-bold text-on-surface hover:text-primary transition-colors">
                        {artwork.title}
                      </span>
                    </Link>
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
                        onClick={() => setEditingArtwork(artwork)}
                        className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-full hover:bg-surface-container-high cursor-pointer"
                        title="Edit artwork"
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(artwork.id)}
                        className="text-error hover:opacity-70 transition-colors p-xs rounded-full hover:bg-error-container cursor-pointer"
                        title="Delete artwork"
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

      {/* Edit Modal */}
      {editingArtwork && (
        <EditModal
          artwork={editingArtwork}
          onClose={() => setEditingArtwork(null)}
          onSaved={handleModalSaved}
        />
      )}
    </section>
  );
}
