import { Card, Avatar, Badge } from "@heroui/react";
import { ShieldCheck } from "@gravity-ui/icons";

export default function ArtistCard({ artist }) {
  return (
    <Card
      className="bg-surface-container-high dark:bg-inverse-surface/40 p-lg rounded-2xl hover:scale-105 transition-transform border border-primary-fixed-dim/20 dark:border-outline-variant/10"
      shadow="none"
    >
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white dark:border-inverse-surface shadow-md">
          <Avatar
            src={artist.avatar}
            alt={artist.name}
            className="w-full h-full"
          />
        </div>
        <h3 className="font-h2 text-h2 mb-1 text-on-surface dark:text-inverse-on-surface">{artist.name}</h3>
        <p className="text-on-surface-variant dark:text-outline-variant mb-4">{artist.specialty}</p>
        <Badge
          className="bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-white px-4 py-1 rounded-full text-sm font-bold"
          content={
            <div className="flex items-center gap-1">
              <ShieldCheck className="text-[16px]" />
              {artist.sales} Sales
            </div>
          }
        />
      </div>
    </Card>
  );
}
