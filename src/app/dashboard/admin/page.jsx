import { Suspense } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminDashboardTabs from "@/components/dashboard/AdminDashboardTabs";

export default function AdminDashboard() {
  return (
    <DashboardLayout
      role="admin"
      userName="Admin"
      userRole="Administrator"
      avatar={null}
      sidebarClassName="bg-inverse-surface text-white"
    >
      <Suspense
        fallback={<div className="text-center py-20">Loading dashboard...</div>}
      >
        <AdminDashboardTabs />
      </Suspense>
    </DashboardLayout>
  );
}
