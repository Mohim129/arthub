"use client";
import { useState, useEffect } from "react";
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
import { adminTransactions } from "@/data/adminTransactions";

export default function AdminDashboardTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "users"; // Make "users" the default tab for better admin utility

  // Local state management
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions] = useState(adminTransactions); // Keep mock transactions for now
  
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingArtworks, setLoadingArtworks] = useState(false);

  // Fetch users from DB
  useEffect(() => {
    if (tab === "users") {
      setLoadingUsers(true);
      fetch("/api/admin/users")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch users");
          return res.json();
        })
        .then((data) => {
          setUsers(data);
          setLoadingUsers(false);
        })
        .catch((err) => {
          toast.error(err.message || "Failed to load users");
          setLoadingUsers(false);
        });
    }
  }, [tab]);

  // Fetch artworks from DB
  useEffect(() => {
    if (tab === "artworks") {
      setLoadingArtworks(true);
      fetch("/api/admin/artworks")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch artworks");
          return res.json();
        })
        .then((data) => {
          setArtworks(data);
          setLoadingArtworks(false);
        })
        .catch((err) => {
          toast.error(err.message || "Failed to load artworks");
          setLoadingArtworks(false);
        });
    }
  }, [tab]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change user role.");

      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success(`Role successfully changed to ${newRole}!`);
    } catch (err) {
      toast.error(err.message || "Failed to update role.");
    }
  };

  const handleDeleteArtwork = async (artId) => {
    const artworkToDelete = artworks.find((a) => a.id === artId);
    if (!confirm(`Are you sure you want to delete artwork "${artworkToDelete?.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/artworks/${artId}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete artwork.");

      setArtworks(artworks.filter((a) => a.id !== artId));
      toast.success(`Artwork "${artworkToDelete?.title || "artwork"}" deleted successfully!`);
    } catch (err) {
      toast.error(err.message || "Failed to delete artwork.");
    }
  };

  const handleExportReport = () => {
    toast.success("Insights report statement exported successfully!");
  };

  return (
    <div className="admin-dashboard max-w-full mx-auto space-y-xl">
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
          className="bg-primary dark:bg-primary-container text-on-primary px-lg py-sm rounded-lg shadow-sm hover:scale-95 transition-transform cursor-pointer"
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
        loadingUsers ? (
          <div className="text-center py-20 font-body-large text-on-surface-variant">
            Loading users from database...
          </div>
        ) : (
          <UserManagementTable 
            users={users} 
            onRoleChange={handleRoleChange} 
          />
        )
      )}

      {tab === "artworks" && (
        loadingArtworks ? (
          <div className="text-center py-20 font-body-large text-on-surface-variant">
            Loading artworks from database...
          </div>
        ) : (
          <AdminArtworkTable 
            artworks={artworks} 
            onDelete={handleDeleteArtwork} 
          />
        )
      )}

      {tab === "transactions" && (
        <AdminTransactionTable 
          transactions={transactions} 
        />
      )}
    </div>
  );
}
