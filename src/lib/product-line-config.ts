import type { ProductLineSlug } from "./types";

export type ProductCategory = "efoils" | "foils";

export type StorefrontLineConfig = {
  slug: ProductLineSlug;
  category: ProductCategory;
  navigationLabel: string;
  defaultName: string;
  defaultEyebrow: string;
  defaultTagline: string;
  defaultDescription: string;
  sortOrder: number;
};

export const storefrontLineConfigs: StorefrontLineConfig[] = [
  {
    slug: "lift-5f",
    category: "efoils",
    navigationLabel: "Mobility Therapy Devices",
    defaultName: "Mobility Therapy Devices",
    defaultEyebrow: "Hydrotherapy Equipment",
    defaultTagline: "Foundational aquatic mobility systems.",
    defaultDescription: "Therapy-focused equipment designed for guided aquatic mobility, smooth support, and confidence-building rehabilitation sessions.",
    sortOrder: 10
  },
  {
    slug: "lift-5",
    category: "efoils",
    navigationLabel: "Multi-Functional Therapeutic Apparatus",
    defaultName: "Multi-Functional Therapeutic Apparatus",
    defaultEyebrow: "Hydrotherapy Equipment",
    defaultTagline: "Versatile therapeutic systems for structured recovery.",
    defaultDescription: "Multi-functional therapeutic equipment built for adaptable water rehabilitation, progressive routines, and refined clinical support.",
    sortOrder: 20
  },
  {
    slug: "boards",
    category: "foils",
    navigationLabel: "Moderate Training Gear",
    defaultName: "Moderate Training Gear",
    defaultEyebrow: "HydroSport Equipment",
    defaultTagline: "Stable, controlled aquatic training systems.",
    defaultDescription: "Equipment configured for stable stance, smooth resistance, and efficient therapeutic water movement.",
    sortOrder: 30
  },
  {
    slug: "masts",
    category: "foils",
    navigationLabel: "High-Intensity Hydro System",
    defaultName: "High-Intensity Hydro System",
    defaultEyebrow: "HydroSport Equipment",
    defaultTagline: "Power-focused systems for advanced aquatic training.",
    defaultDescription: "High-output hydro systems designed for stronger resistance, higher intensity, and more demanding training sessions.",
    sortOrder: 40
  }
];

export const storefrontLineSlugs = storefrontLineConfigs.map((item) => item.slug);
export const hydrotherapyLineSlugs = storefrontLineConfigs.filter((item) => item.category === "efoils").map((item) => item.slug);
export const hydrosportLineSlugs = storefrontLineConfigs.filter((item) => item.category === "foils").map((item) => item.slug);

export const storefrontLineOptionsByCategory = storefrontLineConfigs.reduce<Record<ProductCategory, Array<{ label: string; value: ProductLineSlug }>>>(
  (accumulator, item) => {
    accumulator[item.category].push({ label: item.navigationLabel, value: item.slug });
    return accumulator;
  },
  {
    efoils: [],
    foils: []
  }
);

export function getStorefrontLineConfig(slug: string) {
  return storefrontLineConfigs.find((item) => item.slug === slug) ?? null;
}

