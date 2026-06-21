import { heroSlides, productLines, products, reviews } from "./fallback-data";
import { formatCents } from "./format";
import { getSupabaseClient } from "./supabase";
import type { HeroSlide, Product, ProductLine, ProductLineSlug, Review } from "./types";

type ProductLineRow = {
  id: string;
  slug: ProductLineSlug;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  hero_images: string[];
  sort_order: number;
};

type ProductRow = {
  id: string;
  slug: string;
  line_slug: ProductLineSlug;
  name: string;
  price_cents: number;
  currency: "USD";
  summary: string;
  description: string;
  images: string[];
  color_options?: string[];
  color_images?: Record<string, string[]>;
  details?: string[];
  detail_eyebrow?: string;
  detail_title?: string;
  comparison_eyebrow?: string;
  comparison_title?: string;
  specs: Record<string, string>;
  is_best_seller: boolean;
  sort_order: number;
};

type ReviewRow = {
  id: string;
  author_name: string;
  location: string;
  rating: number;
  body: string;
};

type HeroSlideRow = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  copy: string;
  sort_order: number;
};

const mapLine = (row: ProductLineRow): ProductLine => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  eyebrow: row.eyebrow,
  tagline: row.tagline,
  description: row.description,
  heroImages: row.hero_images,
  sortOrder: row.sort_order
});

const mapProduct = (row: ProductRow): Product => ({
  id: row.id,
  slug: row.slug,
  lineSlug: row.line_slug,
  name: row.name,
  priceCents: row.price_cents,
  currency: row.currency,
  summary: row.summary,
  description: row.description,
  images: row.images,
  colorOptions: row.color_options?.length ? row.color_options : ["White", "Carbon", "Sand"],
  colorImages: row.color_images,
  details: row.details?.length
    ? row.details
    : ["Quiet electric propulsion with smooth throttle response.", "Removable battery system for fast waterfront swaps.", "Carbon construction tuned for clean lift and saltwater durability."],
  detailEyebrow: row.detail_eyebrow,
  detailTitle: row.detail_title,
  comparisonEyebrow: row.comparison_eyebrow,
  comparisonTitle: row.comparison_title,
  specs: row.specs ?? {},
  isBestSeller: row.is_best_seller,
  sortOrder: row.sort_order
});

const mapReview = (row: ReviewRow): Review => ({
  id: row.id,
  authorName: row.author_name,
  location: row.location,
  rating: row.rating,
  body: row.body
});

const mapHeroSlide = (row: HeroSlideRow): HeroSlide => ({
  id: row.id,
  image: row.image,
  eyebrow: row.eyebrow,
  title: row.title,
  copy: row.copy
});

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return heroSlides;

  const { data, error } = await supabase
    .from("hero_slides")
    .select("id,image,eyebrow,title,copy,sort_order")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data?.length) return heroSlides;
  return (data as HeroSlideRow[]).map(mapHeroSlide);
}

export async function getProductLines(): Promise<ProductLine[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return productLines;

  const { data, error } = await supabase
    .from("product_lines")
    .select("id,slug,name,eyebrow,tagline,description,hero_images,sort_order")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !data?.length) return productLines;
  return (data as ProductLineRow[]).map(mapLine);
}

export async function getProductLine(slug: string): Promise<ProductLine | null> {
  const lines = await getProductLines();
  return lines.find((line) => line.slug === slug) ?? null;
}

export async function getProductsByLine(lineSlug: string): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return products.filter((product) => product.lineSlug === lineSlug).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,slug,line_slug,name,price_cents,currency,summary,description,images,color_options,color_images,details,detail_eyebrow,detail_title,comparison_eyebrow,comparison_title,specs,is_best_seller,sort_order")
    .eq("line_slug", lineSlug)
    .eq("status", "published")
    .order("sort_order");

  if (error || !data?.length) {
    return products.filter((product) => product.lineSlug === lineSlug).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return (data as ProductRow[]).map(mapProduct);
}

export async function getBestSellers(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return products.filter((product) => product.isBestSeller).sort((a, b) => a.sortOrder - b.sortOrder);

  const { data, error } = await supabase
    .from("products")
    .select("id,slug,line_slug,name,price_cents,currency,summary,description,images,color_options,color_images,details,detail_eyebrow,detail_title,comparison_eyebrow,comparison_title,specs,is_best_seller,sort_order")
    .eq("is_best_seller", true)
    .eq("status", "published")
    .order("sort_order")
    .limit(4);

  if (error || !data?.length) return products.filter((product) => product.isBestSeller);
  return (data as ProductRow[]).map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return products.find((product) => product.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("id,slug,line_slug,name,price_cents,currency,summary,description,images,color_options,color_images,details,detail_eyebrow,detail_title,comparison_eyebrow,comparison_title,specs,is_best_seller,sort_order")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return products.find((product) => product.slug === slug) ?? null;
  return mapProduct(data as ProductRow);
}

export async function getReviews(): Promise<Review[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return reviews;

  const { data, error } = await supabase
    .from("reviews")
    .select("id,author_name,location,rating,body")
    .eq("is_active", true)
    .order("sort_order")
    .limit(4);

  if (error || !data?.length) return reviews;
  return (data as ReviewRow[]).map(mapReview);
}

export function formatPrice(product: Product) {
  return formatCents(product.priceCents, product.currency);
}
