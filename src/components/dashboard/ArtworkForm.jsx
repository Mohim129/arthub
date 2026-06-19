"use client";
import { useState } from "react";
import { Button, Input, TextArea } from "@heroui/react";
import { CloudArrowUpIn } from "@gravity-ui/icons";

export default function ArtworkForm() {
  const [isDragOver, setIsDragOver] = useState(false);

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
    // later: handle file upload
  };

  return (
    <section>
      <div className="mb-md">
        <h1 className="font-h1-desktop text-h1-desktop mb-xs">
          Submit New Work
        </h1>
        <p className="text-on-surface-variant font-body-large text-body-large">
          Upload high-resolution files and provide curated metadata.
        </p>
      </div>
      <form className="space-y-md bg-surface-container-lowest p-md md:p-lg rounded-xl shadow-sm border border-outline-variant/20">
        {/* Drag and Drop Zone */}
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
          <button
            className="mt-md text-primary font-bold hover:underline"
            type="button"
          >
            Or browse files
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              TITLE
            </label>
            <Input
              placeholder="e.g. Neon Serenity #04"
              className="rounded-lg border-outline-variant bg-surface-container-low"
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              CATEGORY
            </label>
            <select className="rounded-lg border-outline-variant focus:ring-primary-container focus:border-primary-container bg-surface-container-low px-3 py-2">
              <option>Generative Art</option>
              <option>Digital Painting</option>
              <option>3D Abstract</option>
              <option>Photography</option>
            </select>
          </div>
          <div className="flex flex-col gap-xs md:col-span-2">
            <label className="text-label-caps font-label-caps text-on-surface-variant">
              DESCRIPTION
            </label>
            <TextArea
              placeholder="Tell the story behind this piece..."
              rows={4}
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
                className="w-full rounded-lg border-outline-variant bg-surface-container-low pl-md"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                Ξ
              </span>
            </div>
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full bg-primary text-on-primary py-md rounded-lg font-bold shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Publish to Gallery
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

