import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";

type SyncUserPayload = {
  provider?: "google" | "facebook" | "email";
};

export async function POST(request: NextRequest) {
  const serviceClient = getSupabaseServiceClient();

  if (!serviceClient) {
    return NextResponse.json({ error: "Service client is not configured." }, { status: 500 });
  }

  const accessToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access token." }, { status: 401 });
  }

  const { data, error: authError } = await serviceClient.auth.getUser(accessToken);

  if (authError || !data.user) {
    return NextResponse.json({ error: "Invalid access token." }, { status: 401 });
  }

  const payload = (await request.json()) as SyncUserPayload;
  const { user } = data;

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.preferred_username ||
    user.email?.split("@")[0] ||
    null;

  const { error } = await serviceClient.from("site_users").upsert(
    {
      auth_user_id: user.id,
      email: user.email ?? null,
      display_name: displayName,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      provider: payload.provider ?? "google",
      updated_at: new Date().toISOString()
    },
    { onConflict: "auth_user_id" }
  );

  if (error) {
    return NextResponse.json({ error: "Profile sync failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
