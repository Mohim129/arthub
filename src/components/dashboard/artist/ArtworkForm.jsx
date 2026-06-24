"use client";
import { useState } from "react";
import { Button, Input, TextArea } from "@heroui/react";
import { addArtwork } from "@/lib/actions/artworks";
import { updateArtwork } from "@/lib/api/artworks";
import toast from "react-hot-toast";

export default function ArtworkForm({
  artworkToEdit = null,
  onSubmit = null,
  onCancel = null,
}) {
  const [title, setTitle] = useState(artworkToEdit?.title || "");
  const [category, setCategory] = useState(
    artworkToEdit?.category || "Generative Art",
  );
  const [description, setDescription] = useState(
    artworkToEdit?.description || "",
  );
  const [price, setPrice] = useState(
    artworkToEdit?.price
      ? artworkToEdit.price.toString().replace(/[^0-9.]/g, "")
      : "",
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    setLoading(true);
    const artworkData = {
      title: title.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      image: artworkToEdit?.image || "",
    };

    try {
      if (artworkToEdit) {
        await updateArtwork(artworkToEdit.id, artworkData);
        if (onSubmit) {
          onSubmit({
            ...artworkData,
            id: artworkToEdit.id,
            status: artworkToEdit.status || "active",
            artistId: artworkToEdit.artistId,
            createdAt: artworkToEdit.createdAt || new Date().toISOString(),
          });
        }
      } else {
        const res = await addArtwork(artworkData);
        if (onSubmit) {
          onSubmit({
            ...artworkData,
            id: res.id,
            status: "active",
            artistId: res.artistId,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // Reset form if not editing
      if (!artworkToEdit) {
        setTitle("");
        setCategory("Generative Art");
        setDescription("");
        setPrice("");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save artwork.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="mb-md flex justify-between items-center">
        <div>
          <h1 className="font-h1-desktop text-h1-desktop mb-xs">
            {artworkToEdit ? "Edit Artwork" : "Submit New Work"}
          </h1>
          <p className="text-on-surface-variant font-body-large text-body-large">
            {artworkToEdit
              ? "Update the details and metadata of your work listing."
              : "Upload files and provide curated details to list your work."}
          </p>
        </div>
        {artworkToEdit && onCancel && (
          <Button
            onClick={onCancel}
            variant="light"
            className="text-on-surface-variant hover:text-primary rounded-lg"
          >
            Cancel Edit
          </Button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-md bg-surface-container-lowest p-md md:p-lg rounded-xl shadow-sm border border-outline-variant/20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              TITLE
            </label>
            <Input
              placeholder="e.g. Neon Serenity #04"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border-outline-variant bg-surface-container-low"
              required
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-outline-variant/30 focus:ring-primary focus:border-primary bg-surface-container-low px-3 py-2 text-on-surface h-[44px]"
            >
              <option>Generative Art</option>
              <option>Digital Painting</option>
              <option>3D Abstract</option>
              <option>Photography</option>
              <option>Digital Illustration</option>
              <option>Painting</option>
            </select>
          </div>
          <div className="flex flex-col gap-xs md:col-span-2">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              DESCRIPTION
            </label>
            <TextArea
              placeholder="Tell the story behind this piece..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border-outline-variant bg-surface-container-low"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              PRICE (USD)
            </label>
            <div className="relative">
              <Input
                placeholder="0.00"
                step="0.01"
                type="number"
                min="0"
                value={price}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || Number(val) >= 0) {
                    setPrice(val);
                  }
                }}
                className="w-full rounded-lg border-outline-variant bg-surface-container-low pl-md"
                required
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                $
              </span>
            </div>
          </div>
          <div className="flex items-end gap-sm">
            {artworkToEdit && onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                className="w-1/3 bg-outline-variant/20 text-on-surface-variant py-md rounded-lg font-bold transition-all"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={`${artworkToEdit ? "w-2/3" : "w-full"} bg-primary text-on-primary py-md rounded-lg font-bold shadow-lg hover:opacity-90 transition-all active:scale-[0.98]`}
              isLoading={loading}
            >
              {artworkToEdit ? "Save Changes" : "Publish to Gallery"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
