import {
  Palette,
  Pencil,
  Camera,
  Cube,
  Layers,
  Picture,
} from "@gravity-ui/icons";

export const ART_CATEGORY_NAMES = [
  "Digital Painting",
  "3D Abstract",
  "Generative Art",
  "Photography",
  "Digital Illustration",
  "Painting",
];

export const DEFAULT_ART_CATEGORY = "Generative Art";
export const ALL_MEDIA_LABEL = "All Media";

export const BROWSE_CATEGORIES = [ALL_MEDIA_LABEL, ...ART_CATEGORY_NAMES];

const CATEGORY_ICONS = {
  "Digital Painting": Pencil,
  "3D Abstract": Cube,
  "Generative Art": Layers,
  Photography: Camera,
  "Digital Illustration": Picture,
  Painting: Palette,
};

export function getCategoryBrowseHref(categoryName) {
  return `/browse?category=${encodeURIComponent(categoryName)}`;
}

export function parseCategoryFromParam(param) {
  if (!param) return ALL_MEDIA_LABEL;
  const decoded = decodeURIComponent(param);
  return ART_CATEGORY_NAMES.includes(decoded) ? decoded : ALL_MEDIA_LABEL;
}

export const categories = ART_CATEGORY_NAMES.map((name) => ({
  name,
  icon: CATEGORY_ICONS[name],
  href: getCategoryBrowseHref(name),
}));
