"use client";
import { Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserDashboardTabs from "@/components/dashboard/user/UserDashboardTabs";

function UserDashboardContent() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="text-center py-20 font-body-large text-on-surface-variant">
        Verifying authorization...
      </div>
    );
  }

  if (!session || session.user.role !== "user") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-lg max-w-md mx-auto space-y-md">
        <h1 className="font-h1 text-h1 text-error">Access Denied</h1>
        <p className="text-on-surface-variant font-body-large">
          You must be logged in as a collector to view this page.
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout
      role="user"
      userName={session.user.name || "User"}
      userRole="Collector"
      avatar={session.user.image || null}
    >
      <UserDashboardTabs />
    </DashboardLayout>
  );
}

export default function UserDashboard() {
  return (
    <Suspense
      fallback={<div className="text-center py-20 font-body-large text-on-surface-variant">Loading dashboard...</div>}
    >
      <UserDashboardContent />
    </Suspense>
  );
}

