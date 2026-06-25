"use client";
import { Suspense, useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ArtistDashboardTabs from "@/components/dashboard/artist/ArtistDashboardTabs";

function ArtistDashboardContent() {
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isPending) {
    return (
      <div className="text-center py-20 font-body-large text-on-surface-variant">
        Verifying authorization...
      </div>
    );
  }

  if (!session || session.user.role !== "artist") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-lg max-w-md mx-auto space-y-md">
        <h1 className="font-h1 text-h1 text-error">Access Denied</h1>
        <p className="text-on-surface-variant font-body-large">
          You must be logged in as an artist to view this page.
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout
      role="artist"
      userName={session.user.name}
      userRole="Artist"
      avatar={session.user.image || null}
    >
      <ArtistDashboardTabs />
    </DashboardLayout>
  );
}

export default function ArtistDashboard() {
  return (
    <Suspense
      fallback={
        <div className="text-center min-h-screen py-20 font-body-large text-on-surface-variant">
          Loading dashboard...
        </div>
      }
    >
      <ArtistDashboardContent />
    </Suspense>
  );
}

