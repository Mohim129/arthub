"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PurchaseHistoryTable from "./PurchaseHistoryTable";
import SubscriptionTiers from "./SubscriptionTiers";
import PortfolioGallery from "./PortfolioGallery";
import ProfileSettings from "../ProfileSettings";
import { authClient } from "@/lib/auth-client";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import toast from "react-hot-toast";

export default function UserDashboardTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "history";
  const sessionId = searchParams.get("session_id");

  const { data: session } = authClient.useSession();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Finalize Stripe transaction
  useEffect(() => {
    if (sessionId && session?.user?.id) {
      const finalizeTransaction = async () => {
        try {
          const data = await fetchWithAuth(`/api/stripe/session/${sessionId}`);
          if (data.success) {
            await authClient.getSession(); // refresh session to pick up updated tier
            toast.success(
              "Payment successful! Your purchase has been recorded.",
            );
            await fetchPurchases();
            router.replace("/dashboard/user?tab=history");
          }
        } catch (err) {
          console.error("Error finalizing transaction:", err);
          toast.error("Failed to finalize payment");
        }
      };
      finalizeTransaction();
    }
  }, [sessionId, session?.user?.id, router]);

  // Fetch purchases from Express
  const fetchPurchases = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const data = await fetchWithAuth(
        `/api/users/${session.user.id}/purchases`,
      );
      setPurchases(Array.isArray(data) ? data : data.purchases || []);
    } catch (err) {
      console.error("Error fetching purchases:", err);
      toast.error("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  // Load purchases when relevant
  useEffect(() => {
    if (session?.user?.id && (tab === "history" || tab === "bought")) {
      fetchPurchases();
    }
  }, [session?.user?.id, tab]);

  const boughtArtworks = purchases.map((p, index) => ({
    id: p.artworkId || p.id,
    uniqueKey: p._id || p.id || `${p.artworkId}-${index}`,
    title: p.artworkTitle,
    date: p.createdAt,
    image: p.artworkImage,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-xl">
      {tab === "history" && (
        <PurchaseHistoryTable purchases={purchases} loading={loading} />
      )}
      {tab === "bought" && (
        <PortfolioGallery artworks={boughtArtworks} loading={loading} />
      )}
      {tab === "profile" && (
        <ProfileSettings
          initialName={session?.user?.name || "User"}
          initialEmail={session?.user?.email || ""}
          initialBio={session?.user?.bio || ""}
          initialAvatar={session?.user?.image || ""}
        />
      )}
      {tab === "subscription" && <SubscriptionTiers />}
    </div>
  );
}
