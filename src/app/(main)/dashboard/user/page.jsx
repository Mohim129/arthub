"use client";
import { Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserDashboardTabs from "@/components/dashboard/user/UserDashboardTabs";

export default function UserDashboard() {
  const { data: session } = useSession();

  return (
    <Suspense
      fallback={<div className="text-center py-20">Loading dashboard...</div>}
    >
      <DashboardLayout
        role="user"
        userName={session?.user?.name || "User"}
        userRole="Collector"
        avatar={session?.user?.image || null}
      >
        <UserDashboardTabs />
      </DashboardLayout>
    </Suspense>
  );
}

