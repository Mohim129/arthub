"use client";
import { useSearchParams } from "next/navigation";
import PurchaseHistoryTable from "./PurchaseHistoryTable";
import SubscriptionTiers from "./SubscriptionTiers";
import PortfolioGallery from "./PortfolioGallery";
import ProfileSettings from "../ProfileSettings";
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
        <ProfileSettings
          initialName="Alex Rivera"
          initialEmail="alex.r@email.com"
          initialBio="Passionate art collector and curator."
          initialAvatar=""
        />
      )}
      {tab === "subscription" && <SubscriptionTiers />}
    </div>
  );
}
