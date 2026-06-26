export type ProductLineSlug = "lift-5f" | "lift-5" | "lift-x" | "boards" | "masts" | "wings";

export type ProductLine = {
  id: string;
  slug: ProductLineSlug;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  heroImages: string[];
  sortOrder: number;
};

export type Product = {
  id: string;
  slug: string;
  lineSlug: ProductLineSlug;
  name: string;
  priceCents: number;
  currency: "USD";
  summary: string;
  description: string;
  images: string[];
  colorOptions: string[];
  colorImages?: Record<string, string[]>;
  details: string[];
  detailEyebrow?: string;
  detailTitle?: string;
  comparisonEyebrow?: string;
  comparisonTitle?: string;
  specs: Record<string, string>;
  isBestSeller: boolean;
  sortOrder: number;
};

export type Review = {
  id: string;
  authorName: string;
  location: string;
  rating: number;
  body: string;
};

export type HeroSlide = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  copy: string;
};
