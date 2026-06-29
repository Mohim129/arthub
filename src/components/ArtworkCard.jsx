"use client";
import { Card, Button } from "@heroui/react";
import { Heart, ShoppingCart } from "@gravity-ui/icons";
import Link from "next/link";

export default function ArtworkCard({ artwork }) {
  return (
    <Link href={`/artwork/${artwork.id}`} className="block group">
      <Card
        className="bg-surface dark:bg-inverse-surface/40 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-outline-variant/10 dark:border-outline-variant/5 cursor-pointer"
        shadow="none"
      >
        <div className="relative overflow-hidden">
          <div className="aspect-4/3 overflow-hidden">
            <img
              alt={artwork.title}
              src={artwork.image}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <Button
            isIconOnly
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-secondary transition-colors flex items-center justify-center"
            variant="light"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
        <div className="flex flex-col items-start p-3 sm:p-4">
          <h3 className="text-body-large sm:text-h3 font-h3 mb-1 text-on-surface dark:text-inverse-on-surface truncate w-full">{artwork.title}</h3>
          <p className="text-on-surface-variant dark:text-outline-variant font-body-small mb-2 sm:mb-4">
            by {artwork.artistName || artwork.artist || "Unknown Artist"}
          </p>
          <div className="flex justify-between items-center w-full">
            <span className="text-primary dark:text-primary-fixed-dim font-bold text-body-large sm:text-xl">
              ${artwork.price.toLocaleString()}
            </span>
            <Button
              isIconOnly
              variant="light"
              className="text-primary-container dark:text-primary-fixed-dim hover:bg-primary-container dark:hover:bg-primary-fixed-dim hover:text-white dark:hover:text-on-primary-fixed rounded-lg transition-colors w-8 h-8 min-w-8 sm:w-10 sm:h-10 sm:min-w-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
