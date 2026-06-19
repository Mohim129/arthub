import { Suspense } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UserDashboardTabs from "@/components/dashboard/UserDashboardTabs";

export default function UserDashboard() {
  return (
    <DashboardLayout
      role="user"
      userName="Alex Rivera"
      userRole="Collector"
      avatar={null}
    >
      <Suspense
        fallback={<div className="text-center py-20">Loading dashboard...</div>}
      >
        <UserDashboardTabs />
      </Suspense>
    </DashboardLayout>
  );
}
