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
import { fetchAPI } from "@/lib/fetchWithAuth";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboardTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "users";
  const { data: session } = authClient.useSession();

  // Local state management
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [rawStats, setRawStats] = useState(null);
  
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingArtworks, setLoadingArtworks] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch stats for analytics tab
  useEffect(() => {
    if (tab === "analytics") {
      const fetchStats = async () => {
        try {
          setLoadingStats(true);
          const response = await fetchAPI("/api/admin/stats", session?.user?.id);
          if (!response.ok) throw new Error("Failed to fetch stats");
          const data = await response.json();
          setRawStats(data);

          // fetch users to compute role-based counts
          let usersData = users;
          try {
            if (!users || users.length === 0) {
              const usersRes = await fetch('/api/admin/users');
              if (usersRes.ok) usersData = await usersRes.json();
            }
          } catch (e) {
            // ignore user fetch errors — fallback to backend stats
          }

          const totalUsersCount = Array.isArray(usersData) ? usersData.length : data.totalUsers;
          const totalArtistsCount = Array.isArray(usersData)
            ? usersData.filter(u => {
                const r = (u.role || u?.roleName || '').toString().toLowerCase();
                return r.includes('artist');
              }).length
            : data.totalArtists;
          
          // Transform data to match StatsCard format
          const transformedStats = [
            {
              label: "Total Users",
              value: totalUsersCount,
              icon: "users",
              color: "primary"
            },
            {
              label: "Total Artists",
              value: totalArtistsCount,
              icon: "palette",
              color: "secondary"
            },
            {
              label: "Artworks Sold",
              value: data.totalSoldArtworks,
              icon: "shopping",
              color: "tertiary"
            },
            {
              label: "Total Revenue",
              value: `$${data.totalRevenue?.toFixed(2) || "0.00"}`,
              icon: "money",
              color: "success"
            }
          ];
          
          setStats(transformedStats);
        } catch (err) {
          toast.error(err.message || "Failed to load stats");
        } finally {
          setLoadingStats(false);
        }
      };
      
      fetchStats();
    }
  }, [tab, session?.user?.id]);

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

  // Fetch transactions from DB
  useEffect(() => {
    if (tab === "transactions" || tab === "analytics") {
      const fetchTransactions = async () => {
        try {
          setLoadingTransactions(true);
          const response = await fetchAPI("/api/admin/transactions", session?.user?.id);
          if (!response.ok) throw new Error("Failed to fetch transactions");
          const data = await response.json();
          setTransactions(data);
        } catch (err) {
          toast.error(err.message || "Failed to load transactions");
        } finally {
          setLoadingTransactions(false);
        }
      };
      
      fetchTransactions();
    }
  }, [tab, session?.user?.id]);

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
            {loadingStats ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-surface-container rounded-lg animate-pulse" />
              ))
            ) : stats ? (
              stats.map((stat, i) => (
                <StatsCard key={i} stat={stat} />
              ))
            ) : (
              <div className="col-span-full text-center text-on-surface-variant">
                No stats available
              </div>
            )}
          </section>
          <AnalyticsCharts transactions={transactions} stats={rawStats} />
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
        loadingTransactions ? (
          <div className="text-center py-20 font-body-large text-on-surface-variant">
            Loading transactions from database...
          </div>
        ) : (
          <AdminTransactionTable 
            transactions={transactions} 
          />
        )
      )}
    </div>
  );
}
