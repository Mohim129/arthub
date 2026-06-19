"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { File } from "@gravity-ui/icons";
import StatsCard from "./StatsCard";
import AnalyticsCharts from "./AnalyticsCharts";
import UserManagementTable from "./UserManagementTable";
import { adminStats } from "@/data/adminStats";
import { adminUsers } from "@/data/adminUsers";

export default function AdminDashboardTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "analytics"; // default overview

  return (
    <div className="max-w-full mx-auto space-y-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
        <div>
          <h1 className="font-h1-desktop text-h1-desktop text-on-surface">
            Admin Insights
          </h1>
          <p className="text-on-surface-variant font-body-large">
            Performance overview for October 2024
          </p>
        </div>
        <Button className="bg-primary text-on-primary px-lg py-sm rounded-lg shadow-sm hover:scale-95 transition-transform">
          <File className="mr-1" />
          Export Report
        </Button>
      </div>

      {tab === "analytics" && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
            {adminStats.map((stat, i) => (
              <StatsCard key={i} stat={stat} />
            ))}
          </section>
          <AnalyticsCharts />
        </>
      )}

      {tab === "users" && <UserManagementTable users={adminUsers} />}

      {tab === "artworks" && (
        <section>
          <h2 className="font-h2 text-h2 mb-md">Manage All Artworks</h2>
          <p className="text-on-surface-variant">
            Artworks table will appear here.
          </p>
        </section>
      )}

      {tab === "transactions" && (
        <section>
          <h2 className="font-h2 text-h2 mb-md">All Transactions</h2>
          <p className="text-on-surface-variant">
            Transaction history will appear here.
          </p>
        </section>
      )}
    </div>
  );
}
