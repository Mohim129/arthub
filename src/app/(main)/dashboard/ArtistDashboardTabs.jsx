"use client";
import { useSearchParams } from "next/navigation";
import ArtworkForm from "./ArtworkForm";
import ArtworkTable from "./ArtworkTable";
import { artistArtworks } from "@/data/artistArtworks";

export default function ArtistDashboardTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "add"; // default tab: 'add'

  return (
    <div className="max-w-4xl mx-auto space-y-xl">
      {tab === "add" && <ArtworkForm />}
      {tab === "manage" && <ArtworkTable artworks={artistArtworks} />}
      {tab === "sales" && (
        <section>
          <h2 className="font-h2 text-h2 mb-md">Sales History</h2>
          <p className="text-on-surface-variant">
            Your sales history will appear here.
          </p>
        </section>
      )}
      {tab === "profile" && (
        <section>
          <h2 className="font-h2 text-h2 mb-md">Profile Settings</h2>
          <p className="text-on-surface-variant">
            Update your profile details and password.
          </p>
        </section>
      )}
    </div>
  );
}
