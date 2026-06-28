import Link from "next/link";
import { Card } from "@heroui/react";
import { ShieldCheck, Person } from "@gravity-ui/icons";

export default function ArtistCard({ artist }) {
  const artistLink = `/artist/${artist.id}`;
  const avatarSrc = artist.avatar || artist.image || "";

  return (
    <Card
      className="group bg-surface-container-low dark:bg-inverse-surface/40 rounded-2xl border border-outline-variant/20 dark:border-outline-variant/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      shadow="none"
    >
      <div className="flex flex-col items-center text-center p-6">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-2 ring-primary/20 dark:ring-primary-fixed-dim/20 shadow-sm">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary-container dark:bg-secondary">
              <Person className="w-10 h-10 text-on-secondary-container dark:text-white" />
            </div>
          )}
        </div>

        {/* Name */}
        <Link
          href={artistLink}
          className="text-lg font-semibold text-on-surface dark:text-inverse-on-surface hover:text-primary dark:hover:text-primary-fixed-dim transition-colors leading-snug"
        >
          {artist.name}
        </Link>

        {/* Specialty */}
        <p className="mt-1 text-sm text-on-surface-variant dark:text-outline-variant">
          {artist.specialty || artist.role || "Artist"}
        </p>

        {/* Sales badge – simple pill, always visible */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary-container/80 dark:bg-secondary/20 text-on-secondary-container dark:text-secondary-fixed text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>{artist.salesCount ?? 0} Sales</span>
        </div>
      </div>
    </Card>
  );
}
