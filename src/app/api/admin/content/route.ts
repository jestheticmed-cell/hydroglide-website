import { NextRequest, NextResponse } from "next/server";
import { fallbackHomeContent } from "@/lib/site-content";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { heroSlides, productLines, products, reviews } from "@/lib/fallback-data";
import { getSupabaseServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TABLES = new Set(["hero_slides", "product_lines", "products", "reviews"]);

async function readTable(supabase: NonNullable<ReturnType<typeof getSupabaseServiceClient>>, table: string, orderColumn = "sort_order") {
  const { data, error } = await supabase.from(table).select("*").order(orderColumn);
  if (error) throw error;
  return data ?? [];
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

  try {
    const [homeContentResult, heroSlideRows, lineRows, productRows, reviewRows] = await Promise.all([
      supabase.from("site_content").select("content").eq("key", "home").maybeSingle(),
      readTable(supabase, "hero_slides"),
      readTable(supabase, "product_lines"),
      readTable(supabase, "products"),
      readTable(supabase, "reviews")
    ]);

    return NextResponse.json({
      configured: true,
      homeContent: homeContentResult.data?.content ?? fallbackHomeContent,
      heroSlides: heroSlideRows,
      productLines: lineRows,
      products: productRows,
      reviews: reviewRows
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load admin content." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = verifyAdminRequest(request);
  if (authError) return authError;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase service role is not configured." }, { status: 500 });
  }

  try {
    const body = (await request.json()) as { table?: string; record?: Record<string, unknown>; content?: unknown };

    if (body.content) {
      const { error } = await supabase.from("site_content").upsert({ key: "home", content: body.content, updated_at: new Date().toISOString() });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (!body.table || !TABLES.has(body.table) || !body.record) {
      return NextResponse.json({ error: "Invalid admin save request." }, { status: 400 });
    }

    const { error } = await supabase.from(body.table).upsert(body.record);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save admin content." }, { status: 500 });
  }
}
