"use client";
import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  Heart,
  ArrowUpRight,
  ShoppingBag,
  ShieldCheck,
  Pencil,
  Xmark,
  Magnifier,
} from "@gravity-ui/icons";
import { artworkDetail } from "@/data/artworkDetail";
import { comments as initialComments } from "@/data/comments";
import Lightbox from "@/components/Lightbox";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";

export default function ArtworkDetailPage() {
  const params = useParams();
  // Replace this with an API call later using params.id
  const artwork = artworkDetail;
  const [comments, setComments] = useState(initialComments);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const handleMouseMove = useCallback((e) => {
    const img = e.currentTarget.querySelector("img");
    if (!img) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }, []);

  const handlePostComment = (text) => {
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You",
        avatar: "",
        date: "Just now",
        isOwner: false,
        text,
      },
    ]);
  };

  return (
    <>
      <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-start">
          {/* Left: Large Image with Zoom */}
          <div className="relative group overflow-hidden rounded-xl bg-surface-container-low shadow-sm">
            <div
              className="zoom-container overflow-hidden cursor-zoom-in aspect-4/5 relative bg-surface-container-highest"
              onClick={() => setLightboxSrc(artwork.image)}
              onMouseMove={handleMouseMove}
            >
              <img
                className="w-full h-full object-cover transition-transform duration-700 ease-out"
                alt={artwork.title}
                src={artwork.image}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-end p-md">
                <span className="text-white text-body-small flex items-center gap-xs">
                  <Magnifier className="text-[18px]" />
                  Click to expand
                </span>
              </div>
            </div>
            {/* Action Tools */}
            <div className="absolute top-md right-md flex flex-col gap-sm">
              <button className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur-sm shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors">
                <Heart />
              </button>
              <button className="w-10 h-10 rounded-full bg-surface/90 backdrop-blur-sm shadow-md flex items-center justify-center text-on-surface hover:text-primary transition-colors">
                <ArrowUpRight />
              </button>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="sticky top-24 flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-sm">
                <span className="bg-primary-container text-on-primary px-sm py-xs rounded-full font-label-caps text-label-caps uppercase tracking-wider">
                  {artwork.category}
                </span>
                <span className="text-outline text-body-small font-body-small italic">
                  Created: {artwork.date}
                </span>
              </div>
              <h1 className="font-h1-desktop text-h1-desktop text-on-background leading-tight">
                {artwork.title}
              </h1>
              <div className="flex items-center gap-sm mt-xs">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    alt={artwork.artist.name}
                    src={artwork.artist.avatar}
                  />
                </div>
                <p className="font-body-large text-body-large">
                  by{" "}
                  <Link
                    href={`/browse?artist=${encodeURIComponent(artwork.artist.name)}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {artwork.artist.name}
                  </Link>
                </p>
              </div>
            </div>

            {/* Price & Purchase Card */}
            <div className="p-md bg-surface-container-low rounded-xl border border-surface-variant/30 flex flex-col gap-sm">
              <div className="flex justify-between items-baseline">
                <span className="text-outline font-label-caps text-label-caps uppercase">
                  Current Listing Price
                </span>
                <span className="text-on-background font-bold text-[32px] tracking-tight">
                  {artwork.price}
                </span>
              </div>
              <p className="text-on-surface-variant text-body-small">
                Approximately {artwork.usdPrice} USD at current market rates.
              </p>
              <Button className="w-full bg-primary text-on-primary py-md rounded-xl font-bold text-h3 flex items-center justify-center gap-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all active:scale-[0.98]">
                <ShoppingBag />
                Purchase Artwork
              </Button>
              <div className="flex items-center gap-sm justify-center py-xs border-t border-surface-variant/50 mt-xs">
                <ShieldCheck className="text-primary text-[18px]" />
                <span className="text-body-small text-on-surface-variant">
                  Verified Authentic Digital Asset
                </span>
              </div>
            </div>

            {/* Artist Controls (Conditional) */}
            {artwork.isOwner && (
              <div className="flex items-center gap-sm border-l-4 border-primary px-md py-sm bg-surface-container-highest/30 rounded-r-lg">
                <Pencil className="text-primary" />
                <div className="grow">
                  <p className="font-semibold text-body-large">
                    Artist Management
                  </p>
                  <p className="text-body-small text-on-surface-variant">
                    You are viewing this as the creator.
                  </p>
                </div>
                <div className="flex gap-sm">
                  <button className="px-sm py-xs border border-outline rounded-lg text-body-small font-semibold hover:bg-surface-variant transition-colors">
                    Edit
                  </button>
                  <button className="px-sm py-xs border border-error rounded-lg text-error text-body-small font-semibold hover:bg-error-container transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-sm">
              <h3 className="font-h3 text-h3 border-b border-surface-variant pb-xs">
                Description
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col gap-md mt-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-h3 text-h3">Collector Community</h3>
                <span className="text-body-small text-outline">
                  {comments.length} Comments
                </span>
              </div>

              {artwork.hasPurchased ? (
                <CommentForm onSubmit={handlePostComment} />
              ) : (
                <p className="text-on-surface-variant text-body-small italic">
                  Purchase this artwork to leave a comment.
                </p>
              )}

              <CommentList comments={comments} />
            </div>
          </div>
        </div>
      </div>

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}
