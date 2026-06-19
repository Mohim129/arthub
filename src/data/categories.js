import {
  Palette,
  Pencil, // Digital (replaces Draw)
  Camera,
  Diamond, // NFTs
  Cube, // Sculpture
  Layers, // Mixed
} from "@gravity-ui/icons";

export const categories = [
  { name: "Painting", icon: Palette, href: "/browse?category=painting" },
  { name: "Digital", icon: Pencil, href: "/browse?category=digital" },
  { name: "Photo", icon: Camera, href: "/browse?category=photo" },
  { name: "NFTs", icon: Diamond, href: "/browse?category=nfts" },
  { name: "Sculpture", icon: Cube, href: "/browse?category=sculpture" },
  { name: "Mixed", icon: Layers, href: "/browse?category=mixed" },
];
