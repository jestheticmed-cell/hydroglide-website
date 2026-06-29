import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fallbackHomeContent } from "@/lib/site-content";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { heroSlides, productLines, products, reviews } from "@/lib/fallback-data";
import { getSupabaseServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TABLES = new Set(["hero_slides", "product_lines", "products", "reviews"]);

const defaultProductLines: Record<
  string,
  {
    id: string;
    slug: string;
    name: string;
    eyebrow: string;
    tagline: string;
    description: string;
    hero_images: string[];
    sort_order: number;
    is_active: boolean;
  }
> = {
  boards: {
    id: "line-boards",
    slug: "boards",
    name: "Boards",
    eyebrow: "Foil Platform",
    tagline: "Responsive foil boards for refined control.",
    description: "Foil boards configured for stable stance, efficient lift, and precise water feel.",
    hero_images: [],
    sort_order: 30,
    is_active: true
  },
  masts: {
    id: "line-masts",
    slug: "masts",
    name: "Masts",
    eyebrow: "Foil Structure",
    tagline: "Rigid mast options for clean tracking.",
    description: "Masts designed to balance stiffness, durability, and smooth hydrofoil response.",
    hero_images: [],
    sort_order: 31,
    is_active: true
  },
  wings: {
    id: "line-wings",
    slug: "wings",
    name: "Wings",
    eyebrow: "Foil Lift",
    tagline: "Wing sets tuned for lift, glide, and speed.",
    description: "Front and rear wing options shaped for predictable lift and confident carving.",
    hero_images: [],
    sort_order: 32,
    is_active: true
  }
};

function revalidateStorefront() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/efoils/[line]", "page");
  revalidatePath("/foils/[line]", "page");
  revalidatePath("/products/[slug]", "page");
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) return String((error as { message?: unknown }).message);
  return "Unknown error";
}

const fallbackHeroSlideRows = heroSlides.map((slide, index) => ({
  id: slide.id,
  image: slide.image,
  eyebrow: slide.eyebrow,
  title: slide.title,
  copy: slide.copy,
  sort_order: index,
  is_active: true
}));

const fallbackProductLineRows = productLines.map((line) => ({
  id: line.id,
  slug: line.slug,
  name: line.name,
  eyebrow: line.eyebrow,
  tagline: line.tagline,
  description: line.description,
  hero_images: line.heroImages,
  sort_order: line.sortOrder,
  is_active: true
}));

const fallbackProductRows = products.map((product) => ({
  id: product.id,
  slug: product.slug,
  primary_category: "efoils",
  line_slug: product.lineSlug,
  name: product.name,
  price_cents: product.priceCents,
  currency: product.currency,
  summary: product.summary,
  description: product.description,
  images: product.images,
  color_options: product.colorOptions,
  color_images: product.colorImages ?? {},
  details: product.details,
  detail_eyebrow: product.detailEyebrow ?? "Product Details",
  detail_title: product.detailTitle ?? "Built for refined electric flight.",
  comparison_eyebrow: product.comparisonEyebrow ?? "Series Comparison",
  comparison_title: product.comparisonTitle ?? "Compare models in this series.",
  specs: product.specs,
  is_best_seller: product.isBestSeller,
  sort_order: product.sortOrder,
  status: "published"
}));

const fallbackReviewRows = reviews.map((review, index) => ({
  id: review.id,
  author_name: review.authorName,
  location: review.location,
  rating: review.rating,
  body: review.body,
  sort_order: index,
  is_active: true
}));

async function readTable(supabase: NonNullable<ReturnType<typeof getSupabaseServiceClient>>, table: string, orderColumn = "sort_order") {
  const { data, error } = await supabase.from(table).select("*").order(orderColumn);
  if (error) throw error;
  return data ?? [];
}

async function readTableOrFallback(
  supabase: NonNullable<ReturnType<typeof getSupabaseServiceClient>>,
  table: string,
  fallback: unknown[],
  warnings: string[]
) {
  try {
    return await readTable(supabase, table);
  } catch (error) {
    warnings.push(`${table}: ${getErrorMessage(error)}`);
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  const authError = verifyAdminRequest(request);
  if (authError) return authError;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      homeContent: fallbackHomeContent,
      heroSlides,
      productLines,
      products,
      reviews,
      message: "Supabase service role is not configured. Showing fallback content in read-only mode."
    });
  }

  const warnings: string[] = [];

  const [homeContentResult, heroSlideRows, lineRows, productRows, reviewRows] = await Promise.all([
    supabase.from("site_content").select("content").eq("key", "home").maybeSingle(),
    readTableOrFallback(supabase, "hero_slides", fallbackHeroSlideRows, warnings),
    readTableOrFallback(supabase, "product_lines", fallbackProductLineRows, warnings),
    readTableOrFallback(supabase, "products", fallbackProductRows, warnings),
    readTableOrFallback(supabase, "reviews", fallbackReviewRows, warnings)
  ]);

  if (homeContentResult.error) {
    warnings.push(`site_content: ${getErrorMessage(homeContentResult.error)}`);
  }

  return NextResponse.json({
    configured: warnings.length === 0,
    homeContent: homeContentResult.data?.content ?? fallbackHomeContent,
    heroSlides: heroSlideRows,
    productLines: lineRows,
    products: productRows,
    reviews: reviewRows,
    message: warnings.length
      ? `后台已进入降级模式，请检查 Supabase 表结构：${warnings.join("；")}`
      : "后台数据已加载"
  });
}

export async function POST(request: NextRequest) {
  const authError = verifyAdminRequest(request);
  if (authError) return authError;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  try {
    const body = (await request.json()) as { table?: string; record?: Record<string, unknown>; records?: Record<string, unknown>[]; content?: unknown };

    if (body.content) {
      const { error } = await supabase.from("site_content").upsert({ key: "home", content: body.content, updated_at: new Date().toISOString() });
      if (error) throw error;
      revalidateStorefront();
      return NextResponse.json({ ok: true });
    }

    if (!body.table || !TABLES.has(body.table) || (!body.record && !body.records?.length)) {
      return NextResponse.json({ error: "Invalid admin save request." }, { status: 400 });
    }

    if (body.table === "products") {
      const productRecords = body.records?.length ? body.records : body.record ? [body.record] : [];

      for (const productRecord of productRecords) {
        if (typeof productRecord.line_slug !== "string") continue;
        const defaultLine = defaultProductLines[productRecord.line_slug];

        if (defaultLine) {
          const { error } = await supabase.from("product_lines").upsert(defaultLine);
          if (error) throw error;
        }
      }
    }

    const payload = body.records?.length ? body.records : body.record;
    if (!payload) {
      return NextResponse.json({ error: "Invalid admin save payload." }, { status: 400 });
    }
    const { error } = await supabase.from(body.table).upsert(payload);
    if (error) throw error;
    revalidateStorefront();

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
