"use client";
import { Card, Button } from "@heroui/react";
import { Heart, ShoppingCart } from "@gravity-ui/icons";

export default function ArtworkCard({ artwork }) {
  return (
    <Card
      className="group bg-surface dark:bg-inverse-surface/40 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-outline-variant/10 dark:border-outline-variant/5"
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
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-secondary transition-colors"
          variant="light"
        >
          <Heart />
        </Button>
      </div>
      <div className="flex flex-col items-start p-4">
        <h3 className="font-h3 text-h3 mb-1 text-on-surface dark:text-inverse-on-surface">{artwork.title}</h3>
        <p className="text-on-surface-variant dark:text-outline-variant font-body-small mb-4">
          by {artwork.artist}
        </p>
        <div className="flex justify-between items-center w-full">
          <span className="text-primary dark:text-primary-fixed-dim font-bold text-xl">
            ${artwork.price.toLocaleString()}
          </span>
          <Button
            isIconOnly
            variant="light"
            className="text-primary-container dark:text-primary-fixed-dim hover:bg-primary-container dark:hover:bg-primary-fixed-dim hover:text-white dark:hover:text-on-primary-fixed rounded-lg transition-colors"
          >
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </Card>
  );
}
