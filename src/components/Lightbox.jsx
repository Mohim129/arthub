"use client";
import { Xmark } from "@gravity-ui/icons";

export default function Lightbox({ src, onClose }) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-xl cursor-zoom-out"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="absolute top-md right-md text-white" onClick={onClose}>
        <Xmark className="text-[48px]" />
      </button>
      <img
        src={src}
        alt="Artwork full view"
        className="max-w-full max-h-full object-contain shadow-2xl"
      />
    </div>
  );
}
