import Link from "next/link";
import { Layers, Plus, File, Person } from "@gravity-ui/icons";

const navigation = {
  artist: [
    {
      label: "Manage Artworks",
      icon: Layers,
      tab: "manage",
      href: "/dashboard/artist?tab=manage",
    },
    {
      label: "Add Artwork",
      icon: Plus,
      tab: "add",
      href: "/dashboard/artist?tab=add",
    },
    {
      label: "Sales History",
      icon: File,
      tab: "sales",
      href: "/dashboard/artist?tab=sales",
    },
    {
      label: "Profile",
      icon: Person,
      tab: "profile",
      href: "/dashboard/artist?tab=profile",
    },
  ],
  user: [
    {
      label: "Purchase History",
      icon: File,
      tab: "history",
      href: "/dashboard/user?tab=history",
    },
    {
      label: "Bought Artworks",
      icon: Layers,
      tab: "bought",
      href: "/dashboard/user?tab=bought",
    },
    {
      label: "Profile",
      icon: Person,
      tab: "profile",
      href: "/dashboard/user?tab=profile",
    },
    {
      label: "Subscription",
      icon: File,
      tab: "subscription",
      href: "/dashboard/user?tab=subscription",
    },
  ],
  admin: [
    {
      label: "Manage Users",
      icon: Person,
      tab: "users",
      href: "/dashboard/admin?tab=users",
    },
    {
      label: "Manage Artworks",
      icon: Layers,
      tab: "artworks",
      href: "/dashboard/admin?tab=artworks",
    },
    {
      label: "Transactions",
      icon: File,
      tab: "transactions",
      href: "/dashboard/admin?tab=transactions",
    },
    {
      label: "Analytics",
      icon: Layers,
      tab: "analytics",
      href: "/dashboard/admin?tab=analytics",
    },
  ],
};

export default function Sidebar({
  role,
  userName,
  userRole,
  avatar,
  activeTab,
  onLinkClick,
}) {
  const links = navigation[role] || [];

  return (
    <aside className="flex flex-col h-full bg-surface-container-low border-r border-outline-variant/30 p-md w-full overflow-y-auto">
      <div className="space-y-4">
        <p className="text-label-caps font-label-caps text-on-surface-variant px-sm mb-md">
          {role === "artist" ? "GALLERY MANAGER" : "DASHBOARD"}
        </p>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={`flex items-center gap-sm px-sm py-md rounded-lg transition-colors ${
              activeTab === link.tab
                ? "bg-primary-container text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <link.icon />
            <span className="font-body-large text-body-large">
              {link.label}
            </span>
          </Link>
        ))}
      </div>

      {userName && (
        <div className="mt-auto p-sm bg-surface-container-highest rounded-xl">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden">
              {avatar ? (
                <img
                  className="w-full h-full object-cover"
                  alt={userName}
                  src={avatar}
                />
              ) : (
                <Person className="w-6 h-6 m-2 text-on-surface-variant" />
              )}
            </div>
            <div>
              <p className="font-body-large text-body-large font-bold">
                {userName}
              </p>
              <p className="font-body-small text-body-small text-on-surface-variant">
                {userRole}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
