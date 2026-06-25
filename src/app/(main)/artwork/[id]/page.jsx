"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { comments as initialComments } from "@/data/comments";
import Lightbox from "@/components/Lightbox";
import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";
import { getArtwork } from "@/lib/api/artworks";
import { getUserById } from "@/lib/api/users";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState(initialComments);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  // Fetch artwork data
  useEffect(() => {
    async function fetchArtwork() {
      try {
        setLoading(true);
        const data = await getArtwork(params.id);

        if (data?.artistId) {
          try {
            const artist = await getUserById(data.artistId);
            data.artistName = artist.name || data.artistName;
            data.artistAvatar = artist.image || data.artistAvatar;
          } catch (artistError) {
            console.warn("Failed to load artist info:", artistError);
          }
        }

        setArtwork(data);
      } catch (err) {
        setError(err.message || "Failed to load artwork.");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchArtwork();
  }, [params.id]);

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

  const handlePurchase = () => {
    toast.loading("Redirecting to Stripe Checkout...", { id: "checkout" });
    // Simulate successful payment redirect and update
    setTimeout(() => {
      toast.success("Payment successful! Purchase history updated.", { id: "checkout" });
    }, 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this artwork?")) return;
    try {
      const { deleteArtwork } = await import("@/lib/api/artworks");
      await deleteArtwork(artwork.id);
      toast.success("Artwork deleted.");
      router.push("/dashboard/artist?tab=manage");
    } catch (err) {
      toast.error(err.message || "Failed to delete artwork.");
    }
  };

  // Determine ownership and purchase eligibility
  const userId = session?.user?.id;
  const isOwner = userId && artwork ? userId === artwork.artistId : false;
  const canPurchase = userId && artwork ? userId !== artwork.artistId : false;

  if (loading) {
    return (
      <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen flex justify-center items-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-xl max-w-container-max mx-auto px-gutter min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="font-h2 text-h2 mb-md">Artwork Not Found</h2>
        <p className="text-on-surface-variant mb-lg">{error}</p>
        <Link
          href="/browse"
          className="text-primary font-semibold hover:underline"
        >
          Browse artworks
        </Link>
      </div>
    );
  }

  if (!artwork) {
    return null; // Should be covered by loading/error, but just in case
  }

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
                src={artwork.image || null}
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
                  Created: {new Date(artwork.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="font-h1-desktop text-h1-desktop text-on-background leading-tight">
                {artwork.title}
              </h1>
              <div className="flex items-center gap-sm mt-xs">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container">
                  {artwork.artistAvatar ? (
                    <img
                      className="w-full h-full object-cover"
                      alt={artwork.artistName}
                      src={artwork.artistAvatar || null}
                    />
                  ) : (
                    <Heart className="w-5 h-5 text-on-surface-variant" />
                  )}
                </div>
                <p className="font-body-large text-body-large">
                  by{" "}
                  <Link
                    href={`/artist/${artwork.artistId}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    {artwork.artistName || "Unknown Artist"}
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
                  $
                  {typeof artwork.price === "number"
                    ? artwork.price.toLocaleString()
                    : artwork.price}
                </span>
              </div>
              <p className="text-on-surface-variant text-body-small">
                Approximately $
                {typeof artwork.price === "number"
                  ? artwork.price.toLocaleString()
                  : artwork.price}{" "}
                USD
              </p>
              {userId ? (
                <Button
                  disabled={!canPurchase}
                  onClick={handlePurchase}
                  className={`w-full py-md rounded-xl font-bold text-h3 flex items-center justify-center gap-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] ${
                    canPurchase
                      ? "bg-primary text-on-primary hover:opacity-90"
                      : "bg-surface-variant text-on-surface-variant cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag />
                  {isOwner ? "You own this artwork" : "Purchase Artwork"}
                </Button>
              ) : (
                <Link
                  href="/signin"
                  className="w-full bg-primary text-on-primary py-md rounded-xl font-bold text-h3 flex items-center justify-center gap-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  <ShoppingBag />
                  Sign in to Purchase
                </Link>
              )}
              <div className="flex items-center gap-sm justify-center py-xs border-t border-surface-variant/50 mt-xs">
                <ShieldCheck className="text-primary text-[18px]" />
                <span className="text-body-small text-on-surface-variant">
                  Verified Authentic Digital Asset
                </span>
              </div>
            </div>

            {/* Artist Controls (only if owner) */}
            {isOwner && (
              <div className="flex items-center gap-sm border-l-4 border-primary px-md py-sm bg-surface-container-highest/30 rounded-r-lg">
                <Pencil className="text-primary" />
                <div className="grow">
                  <p className="font-semibold text-body-large">
                    Artist Management
                  </p>
                  <p className="text-body-small text-on-surface-variant">
                    You own this artwork.
                  </p>
                </div>
                <div className="flex gap-sm">
                  <Link
                    href={`/dashboard/artist?tab=manage`}
                    className="px-sm py-xs border border-outline rounded-lg text-body-small font-semibold hover:bg-surface-variant transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-sm py-xs border border-error rounded-lg text-error text-body-small font-semibold hover:bg-error-container transition-colors"
                  >
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

            {/* Comments Section (mock for now) */}
            <div className="flex flex-col gap-md mt-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-h3 text-h3">Collector Community</h3>
                <span className="text-body-small text-outline">
                  {comments.length} Comments
                </span>
              </div>

              {userId ? (
                <CommentForm onSubmit={handlePostComment} />
              ) : (
                <p className="text-on-surface-variant text-body-small italic">
                  Sign in to leave a comment.
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
