import { Suspense } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserDashboardTabs from "@/components/dashboard/UserDashboardTabs";

export default function UserDashboard() {
  return (
    <Suspense
      fallback={<div className="text-center py-20">Loading dashboard...</div>}
    >
      <DashboardLayout
        role="user"
        userName="Alex Rivera"
        userRole="Collector"
        avatar={null}
      >
        <UserDashboardTabs />
      </DashboardLayout>
    </Suspense>
  );
}
