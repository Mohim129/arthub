import { Suspense } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ArtistDashboardTabs from "@/components/dashboard/ArtistDashboardTabs";

export default function ArtistDashboard() {
  return (
    <Suspense
      fallback={<div className="text-center py-20">Loading dashboard...</div>}
    >
      <DashboardLayout
        role="artist"
        userName="Elena Vance"
        userRole="Pro Curator"
        avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAen3Z8BAwbxhnggBVHO9O6xaU4-IDOVs0KPV5xE_qBBeif7m_2flj7qvsTFwRNAZP6CihzEIwsP8gRU7WKKUqbvguAH8Q9b1W8qOWWCDRKqBAuLB1g7lCFpERIll3IEMxGA15ocXuzklbbjMYRGehE7ZVJNQZSSHhYHcIAEsfcPjIwrdMapWlReBmm9WLTxqVyO_7bRUvi1Zzam6sp0EitYN_t48yEw3P-2iiavgzzddsRJ1moUP9lgLAPqpNlk1rK4-4GFUQBz7yT"
      >
        <ArtistDashboardTabs />
      </DashboardLayout>
    </Suspense>
  );
}
