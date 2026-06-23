"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { File } from "@gravity-ui/icons";
import { toast } from "react-hot-toast";
import StatsCard from "./StatsCard";
import AnalyticsCharts from "./AnalyticsCharts";
import UserManagementTable from "./UserManagementTable";
import AdminArtworkTable from "./AdminArtworkTable";
import AdminTransactionTable from "./AdminTransactionTable";
import { adminStats } from "@/data/adminStats";
import { adminUsers } from "@/data/adminUsers";
import { adminArtworks } from "@/data/adminArtworks";
import { adminTransactions } from "@/data/adminTransactions";

export default function AdminDashboardTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "analytics"; // default overview

  // Local state management
  const [users, setUsers] = useState(adminUsers);
  const [artworks, setArtworks] = useState(adminArtworks);
  const [transactions, setTransactions] = useState(adminTransactions);

  const handleRoleChange = (userId, newRole) => {
    const userToUpdate = users.find((u) => u.id === userId);
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    toast.success(`Role for ${userToUpdate?.name || "user"} successfully changed to ${newRole}!`);
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find((u) => u.id === userId);
    if (confirm(`Are you sure you want to delete user "${userToDelete?.name}"?`)) {
      setUsers(users.filter((u) => u.id !== userId));
      toast.success(`User "${userToDelete?.name || "user"}" deleted successfully!`);
    }
  };

  const handleDeleteArtwork = (artId) => {
    const artworkToDelete = artworks.find((a) => a.id === artId);
    if (confirm(`Are you sure you want to delete artwork "${artworkToDelete?.title}"?`)) {
      setArtworks(artworks.filter((a) => a.id !== artId));
      toast.success(`Artwork "${artworkToDelete?.title || "artwork"}" deleted from marketplace!`);
    }
  };

  const handleExportReport = () => {
    toast.success("Insights report statement exported successfully!");
  };

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
        <Button 
          onClick={handleExportReport}
          className="bg-primary text-on-primary px-lg py-sm rounded-lg shadow-sm hover:scale-95 transition-transform cursor-pointer"
        >
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

      {tab === "users" && (
        <UserManagementTable 
          users={users} 
          onRoleChange={handleRoleChange} 
          onDelete={handleDeleteUser} 
        />
      )}

      {tab === "artworks" && (
        <AdminArtworkTable 
          artworks={artworks} 
          onDelete={handleDeleteArtwork} 
        />
      )}

      {tab === "transactions" && (
        <AdminTransactionTable 
          transactions={transactions} 
        />
      )}
    </div>
  );
}
