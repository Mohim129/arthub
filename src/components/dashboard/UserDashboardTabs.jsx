"use client";
import { useSearchParams } from "next/navigation";
import PurchaseHistoryTable from "./PurchaseHistoryTable";
import SubscriptionTiers from "./SubscriptionTiers";
import PortfolioGallery from "./PortfolioGallery";
import { userPurchases } from "@/data/userPurchases";
import { boughtArtworks } from "@/data/boughtArtworks";

export default function UserDashboardTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "history"; // default: history

  return (
    <div className="max-w-4xl mx-auto space-y-xl">
      {tab === "history" && <PurchaseHistoryTable purchases={userPurchases} />}
      {tab === "bought" && <PortfolioGallery artworks={boughtArtworks} />}
      {tab === "profile" && (
        <section>
          <h2 className="font-h2 text-h2 mb-md">Profile Settings</h2>
          <p className="text-on-surface-variant">
            Update your profile details and change password.
          </p>
        </section>
      )}
      {tab === "subscription" && <SubscriptionTiers />}
    </div>
  );
}
