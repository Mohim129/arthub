"use client";
import { useSearchParams } from "next/navigation";
import PurchaseHistoryTable from "./PurchaseHistoryTable";
import SubscriptionTiers from "./SubscriptionTiers";
import PortfolioGallery from "./PortfolioGallery";
import ProfileSettings from "../ProfileSettings";
import { userPurchases } from "@/data/userPurchases";

export default function UserDashboardTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "history"; // default: history

  const boughtArtworks = userPurchases.map((p) => ({
    id: p.id,
    title: p.artwork,
    date: p.date,
    image: p.image,
  }));

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
