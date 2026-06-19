"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "./Sidebar";
import { LayoutSideContent, Xmark } from "@gravity-ui/icons";

export default function DashboardLayout({
  children,
  role,
  userName,
  userRole,
  avatar,
  sidebarClassName,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "add";

  return (
    <div className="min-h-screen flex relative">
      <button
        className="md:hidden fixed top-24 left-4 z-50 bg-surface shadow-md p-2 rounded-lg border border-outline-variant"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <Xmark /> : <LayoutSideContent />}
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-20 left-0 z-50 h-[calc(100vh-80px)] w-64 transform transition-transform duration-300 md:sticky md:translate-x-0 md:flex md:flex-shrink-0 ${sidebarClassName || ""} ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          role={role}
          userName={userName}
          userRole={userRole}
          avatar={avatar}
          activeTab={activeTab}
          onLinkClick={() => setSidebarOpen(false)}
        />
      </div>

      <main className="flex-1 p-md md:p-lg bg-surface max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
