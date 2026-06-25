"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PurchaseHistoryTable from "./PurchaseHistoryTable";
import SubscriptionTiers from "./SubscriptionTiers";
import PortfolioGallery from "./PortfolioGallery";
import ProfileSettings from "../ProfileSettings";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UserDashboardTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "history";
  const sessionId = searchParams.get("session_id");
  
  const { data: session } = authClient.useSession();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Finalize transaction if coming from Stripe
  useEffect(() => {
    if (sessionId && session?.user?.id) {
      const finalizeTransaction = async () => {
        try {
          const response = await fetch(`/api/stripe/session/${sessionId}`, {
            credentials: "include",
            headers: { "x-user-id": session.user.id },
          });
          const data = await response.json();
          
          if (data.success) {
            toast.success("Payment successful! Your purchase has been recorded.");
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

  const fetchPurchases = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${session.user.id}/purchases`, {
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPurchases(Array.isArray(data) ? data : data.purchases || []);
      } else {
        throw new Error(`Failed to fetch purchases (${response.status})`);
      }
    } catch (err) {
      console.error("Error fetching purchases:", err);
      toast.error("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  // Fetch purchases when tab is history or bought, or when session changes
  useEffect(() => {
    if (session?.user?.id && (tab === "history" || tab === "bought")) {
      fetchPurchases();
    }
  }, [session?.user?.id, tab]);

  const boughtArtworks = purchases.map((p) => ({
    id: p.artworkId || p.id,
    title: p.artworkTitle,
    date: p.createdAt,
    image: p.artworkImage,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-xl">
      {tab === "history" && <PurchaseHistoryTable purchases={purchases} loading={loading} />}
      {tab === "bought" && <PortfolioGallery artworks={boughtArtworks} loading={loading} />}
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
