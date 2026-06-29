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
  Magnifier,
  Trash,
} from "@gravity-ui/icons";
import Lightbox from "@/components/Lightbox";
import { getArtwork } from "@/lib/api/artworks";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ArtworkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  // Purchase check – uses the dedicated endpoint
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchasesLoading, setPurchasesLoading] = useState(true);

  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const isOwner = userId && artwork ? userId === artwork.artistId : false;
  const canPurchase = userRole === "user" && !isOwner;

  // 1. Fetch artwork
  useEffect(() => {
    async function fetchArtwork() {
      try {
        setLoading(true);
        const data = await getArtwork(params.id);
        setArtwork(data);
      } catch (err) {
        setError(err.message || "Failed to load artwork.");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchArtwork();
  }, [params.id]);

  // 2. Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/${params.id}/comments`,
        );
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (e) {
        // silently fail
      }
    }
    if (params.id) fetchComments();
  }, [params.id]);

  // 3. Check if user purchased this artwork (uses new dedicated endpoint)
  useEffect(() => {
    if (!userId || !params.id) {
      setPurchasesLoading(false);
      return;
    }
    async function check() {
      try {
        const { purchased } = await fetchWithAuth(
          `/api/artworks/${params.id}/purchased`,
        );
        setHasPurchased(purchased);
      } catch (e) {
        setHasPurchased(false);
      } finally {
        setPurchasesLoading(false);
      }
    }
    check();
  }, [userId, params.id]);

  // Purchase handler – redirect to Stripe Checkout
  const handlePurchase = async () => {
    if (!canPurchase) {
      toast.error("Only collectors can purchase artwork");
      return;
    }
    try {
      const res = await fetchWithAuth("/api/stripe/create-purchase-session", {
        method: "POST",
        body: JSON.stringify({ artworkId: artwork.id }),
      });
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error("Could not start payment. Please try again.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment");
    }
  };

  // Post comment
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setCommentSubmitting(true);
    try {
      const res = await fetchWithAuth(`/api/artworks/${params.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ text: newComment.trim() }),
      });
      setComments((prev) => [res, ...prev]);
      setNewComment("");
      toast.success("Comment posted!");
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "Failed to post comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const updated = await fetchWithAuth(`/api/comments/${commentId}`, {
        method: "PUT",
        body: JSON.stringify({ text: editText.trim() }),
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, text: updated.text } : c,
        ),
      );
      setEditingCommentId(null);
      toast.success("Comment updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update comment.");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await fetchWithAuth(`/api/comments/${commentId}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete comment.");
    }
  };

  const handleMouseMove = useCallback((e) => {
    const img = e.currentTarget.querySelector("img");
    if (!img) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }, []);

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

  if (!artwork) return null;

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
                      src={artwork.artistAvatar}
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
                    {artwork.artistName}
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
              {userId ? (
                canPurchase ? (
                  <Button
                    onPress={handlePurchase}
                    className="w-full py-md rounded-xl font-bold text-h3 flex items-center justify-center gap-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] bg-primary text-on-primary hover:opacity-90"
                  >
                    <ShoppingBag />
                    Purchase Artwork
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full py-md rounded-xl font-bold text-h3 flex items-center justify-center gap-sm bg-surface-variant text-on-surface-variant cursor-not-allowed"
                  >
                    <ShoppingBag />
                    {isOwner
                      ? "You own this artwork"
                      : "Collectors only"}
                  </Button>
                )
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

            {/* Artist Controls */}
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
                <Link
                  href={`/dashboard/artist?tab=manage`}
                  className="px-sm py-xs border border-outline rounded-lg text-body-small font-semibold hover:bg-surface-variant transition-colors"
                >
                  Edit
                </Link>
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

              {/* Comment form – only if purchased */}
              {userId && hasPurchased && (
                <div className="flex gap-sm p-sm bg-surface-container-low rounded-xl">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={3}
                    className="flex-1 bg-surface border-surface-variant rounded-lg p-sm text-body-large focus:ring-2 focus:ring-primary resize-none"
                  />
                  <Button
                    onPress={handlePostComment}
                    isLoading={commentSubmitting}
                    className="bg-primary text-on-primary px-md py-xs rounded-lg font-semibold self-end"
                  >
                    Post
                  </Button>
                </div>
              )}
              {userId && !hasPurchased && !purchasesLoading && (
                <p className="text-on-surface-variant text-body-small italic">
                  Purchase this artwork to leave a comment.
                </p>
              )}
              {!userId && (
                <p className="text-on-surface-variant text-body-small italic">
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>{" "}
                  to leave a comment.
                </p>
              )}

              {/* Comments list */}
              <div className="flex flex-col gap-sm max-h-[400px] overflow-y-auto pr-sm custom-scrollbar">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-md p-md bg-surface-container-lowest dark:bg-inverse-surface/40 border border-outline-variant/20 dark:border-outline-variant/10 rounded-xl shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container shrink-0">
                      {comment.userAvatar ? (
                        <img
                          src={comment.userAvatar}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-xs flex-1">
                      <div className="flex items-center gap-sm">
                        <span className="font-bold text-on-background">
                          {comment.userName || "Anonymous"}
                        </span>
                        <span className="text-outline text-body-small">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {editingCommentId === comment.id ? (
                        <div className="flex gap-sm">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 border border-outline-variant rounded px-2 py-1 text-sm"
                          />
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="text-primary font-semibold text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="text-error text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-on-surface-variant text-body-large">
                          {comment.text}
                        </p>
                      )}
                      {userId === comment.userId &&
                        editingCommentId !== comment.id && (
                          <div className="flex gap-sm mt-1">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditText(comment.text);
                              }}
                              className="text-primary text-body-small font-semibold hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-error text-body-small font-semibold hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}
