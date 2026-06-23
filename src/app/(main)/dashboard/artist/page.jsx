"use client";
import { Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ArtistDashboardTabs from "@/components/dashboard/artist/ArtistDashboardTabs";

export default function ArtistDashboard() {
  const { data: session, isPending } = useSession();

  return (
    <Suspense
      fallback={
        <div className="text-center min-h-screen py-20">
          Loading dashboard...
        </div>
      }
    >
      <DashboardLayout
        role="artist"
        userName={session?.user?.name}
        userRole="Artist"
        avatar={session?.user?.image || null}
      >
        <ArtistDashboardTabs />
      </DashboardLayout>
    </Suspense>
  );
}

