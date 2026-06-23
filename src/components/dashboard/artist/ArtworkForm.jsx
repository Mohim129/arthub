"use client";
import { useState } from "react";
import { Button, Input, TextArea } from "@heroui/react";
import { CloudArrowUpIn, Xmark } from "@gravity-ui/icons";

export default function ArtworkForm({ artworkToEdit = null, onSubmit = null, onCancel = null }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [title, setTitle] = useState(artworkToEdit?.title || "");
  const [category, setCategory] = useState(artworkToEdit?.category || "Generative Art");
  const [description, setDescription] = useState(artworkToEdit?.description || "");
  const [price, setPrice] = useState(
    artworkToEdit?.price 
      ? artworkToEdit.price.replace(" ETH", "").replace("$", "").replace(",", "")
      : ""
  );
  const [image, setImage] = useState(artworkToEdit?.image || "");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Simulate drop / mock image upload (imgBB mock)
    const file = e.dataTransfer.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file) => {
    // Generate a temporary mock object URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (!price) return;
    
    const formattedPrice = `${price} ETH`;
    const finalImage = image || "https://lh3.googleusercontent.com/aida-public/AB6AXuDPV8TBYXeu-NjQo0APLgZU2ccmQp790RoUQsk4Xxdhd6TZrZEDuDHJYzSGiAZTsLp5UWVGrMYLaqrCUp6z3_UOJMa2YwSctquDtexyXg8chnnH9Z9qxNIY7MAIIw5tOY1guLACs92obht02Y5OuyP2_HcdCff5xtluFmoR7tPYce0D8qqkQtI3yhl9FxYCGp0VWciBcY896vok8oZAllL4cIikw9IjGcbmCGHV5u41B9VEjGFM0duKO8vocyd7Vfs-mJ8vun03z3Qa"; // fallback mock image

    if (onSubmit) {
      onSubmit({
        id: artworkToEdit?.id,
        title,
        category,
        description,
        price: formattedPrice,
        image: finalImage,
        status: artworkToEdit?.status || "Active"
      });
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
              : "Upload files and provide curated details to list your work."
            }
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

      <form onSubmit={handleSubmit} className="space-y-md bg-surface-container-lowest p-md md:p-lg rounded-xl shadow-sm border border-outline-variant/20">
        
        {/* Image Preview & Upload Zone */}
        {image ? (
          <div className="relative rounded-xl overflow-hidden border border-outline-variant/40 bg-surface-container-low max-h-[300px] flex items-center justify-center group">
            <img src={image} alt="Artwork Upload" className="max-h-[300px] object-contain w-full" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-md">
              <label className="bg-white text-on-surface px-md py-sm rounded-lg font-bold cursor-pointer hover:bg-surface-bright shadow-sm">
                Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <button 
                type="button" 
                onClick={() => setImage("")}
                className="bg-error text-on-error p-sm rounded-full shadow-sm hover:opacity-90"
              >
                <Xmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`drag-zone border-2 rounded-xl p-xl flex flex-col items-center justify-center text-center cursor-pointer group ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-outline-variant"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CloudArrowUpIn className="text-primary text-[48px] mb-sm transition-transform group-hover:scale-110" />
            <h3 className="font-h3 text-h3 mb-xs">Drop your artwork here</h3>
            <p className="text-body-small text-body-small text-on-surface-variant">
              Supports TIFF, PNG, or JPG (Max 50MB)
            </p>
            <div className="flex gap-sm mt-md">
              <label className="text-primary font-bold hover:underline cursor-pointer">
                Browse files
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <span className="text-outline">or</span>
              <button
                type="button"
                className="text-primary font-bold hover:underline"
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                Use image URL
              </button>
            </div>

            {showUrlInput && (
              <div className="mt-md w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <Input
                  placeholder="https://example.com/artwork.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  size="sm"
                  className="rounded-lg border-outline-variant"
                />
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
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
              PRICE (ETH)
            </label>
            <div className="relative">
              <Input
                placeholder="0.00"
                step="0.01"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border-outline-variant bg-surface-container-low pl-md"
                required
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                Ξ
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
            >
              {artworkToEdit ? "Save Changes" : "Publish to Gallery"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
