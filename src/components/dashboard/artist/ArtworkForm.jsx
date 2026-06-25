"use client";
import { useState, useRef } from "react";
import { Button, Input, TextArea } from "@heroui/react";
import { addArtwork } from "@/lib/actions/artworks";
import { updateArtwork } from "@/lib/api/artworks";
import toast from "react-hot-toast";
import { Camera, CloudArrowUpIn, Xmark } from "@gravity-ui/icons";

/* ---------- imgBB upload helper ---------- */
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
/* ------------------------------------------ */

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

  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(artworkToEdit?.image || "");
  const [imageUrl, setImageUrl] = useState(artworkToEdit?.image || "");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  // Handle image file selection
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
    setImageUrl(""); // clear URL if file chosen
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Clear image selection
  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = "";

      // 1. If a new file is selected, upload it
      if (imageFile) {
        setUploading(true);
        toast.loading("Uploading artwork image…", { id: "upload" });
        finalImageUrl = await uploadToImgBB(imageFile);
        toast.success("Image uploaded!", { id: "upload" });
        setUploading(false);
      } else if (imageUrl && imageUrl !== artworkToEdit?.image) {
        // 2. Use the manually entered URL if changed
        finalImageUrl = imageUrl;
      } else {
        // 3. Keep existing image (or empty if new)
        finalImageUrl = artworkToEdit?.image || "";
      }

      const artworkData = {
        title: title.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        image: finalImageUrl,
      };

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
        toast.success("Artwork updated!");
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
        toast.success("Artwork published!");
      }

      // Reset form if not editing
      if (!artworkToEdit) {
        setTitle("");
        setCategory("Generative Art");
        setDescription("");
        setPrice("");
        setImageFile(null);
        setImagePreview("");
        setImageUrl("");
        setShowUrlInput(false);
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
        {/* ---------- Image Upload Section ---------- */}
        <div className="flex flex-col gap-xs">
          <label className="text-label-caps font-label-caps text-on-surface-variant">
            ARTWORK IMAGE
          </label>

          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-low max-h-[300px] flex items-center justify-center group">
              <img
                src={imagePreview}
                alt="Artwork preview"
                className="max-h-[300px] object-contain w-full"
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
              className="border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudArrowUpIn className="text-primary text-[48px] mb-sm" />
              <h3 className="font-h3 text-h3 mb-xs">Click to upload</h3>
              <p className="text-body-small text-on-surface-variant">
                JPG, PNG or GIF (Max 5 MB)
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

          {/* URL fallback */}
          <div className="flex items-center gap-sm mt-2">
            <button
              type="button"
              className="text-primary text-sm font-semibold hover:underline"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              {showUrlInput ? "Hide URL input" : "Or use image URL"}
            </button>
          </div>

          {showUrlInput && (
            <Input
              placeholder="https://example.com/artwork.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (!imageFile) setImagePreview(e.target.value);
              }}
              className="rounded-lg border-outline-variant bg-surface-container-low"
            />
          )}
        </div>

        {/* ---------- Form Fields ---------- */}
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
              isLoading={loading || uploading}
            >
              {uploading
                ? "Uploading image…"
                : loading
                  ? "Saving…"
                  : artworkToEdit
                    ? "Save Changes"
                    : "Publish to Gallery"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
