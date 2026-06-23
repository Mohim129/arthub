"use client";
import { Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminDashboardTabs from "@/components/dashboard/admin/AdminDashboardTabs";

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <Suspense
      fallback={<div className="text-center py-20">Loading dashboard...</div>}
    >
      <DashboardLayout
        role="admin"
        userName={session?.user?.name || "Admin"}
        userRole="Administrator"
        avatar={session?.user?.image || null}
        sidebarClassName="bg-inverse-surface text-white"
      >
        <AdminDashboardTabs />
      </DashboardLayout>
    </Suspense>
  );
}

