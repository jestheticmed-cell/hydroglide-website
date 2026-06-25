import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isMissingCustomerEmailColumn(error: unknown) {
  if (error instanceof Error) return error.message.includes("customer_email");
  if (typeof error === "object" && error && "message" in error) return String((error as { message?: unknown }).message).includes("customer_email");
  return false;
}

async function readSupportData(supabase: NonNullable<ReturnType<typeof getSupabaseServiceClient>>, conversationId?: string) {
  let { data: conversations, error: conversationError } = await supabase
    .from("support_conversations")
    .select("id,customer_name,customer_email,subject,status,unread_count,last_message,last_message_at,created_at")
    .order("last_message_at", { ascending: false });

  if (conversationError && isMissingCustomerEmailColumn(conversationError)) {
    const legacyResult = await supabase
      .from("support_conversations")
      .select("id,customer_name,subject,status,unread_count,last_message,last_message_at,created_at")
      .order("last_message_at", { ascending: false });

    conversations = legacyResult.data?.map((conversation) => ({ ...conversation, customer_email: null })) ?? null;
    conversationError = legacyResult.error;
  }

  if (conversationError) throw conversationError;

  const selectedConversationId = conversationId ?? conversations?.[0]?.id;
  const { data: messages, error: messageError } = selectedConversationId
    ? await supabase
        .from("support_messages")
        .select("id,conversation_id,sender,body,is_read,created_at")
        .eq("conversation_id", selectedConversationId)
        .order("created_at")
    : { data: [], error: null };

  if (messageError) throw messageError;

  return {
    conversations: conversations ?? [],
    selectedConversationId: selectedConversationId ?? null,
    messages: messages ?? []
  };
}

export async function GET(request: NextRequest) {
  const authError = verifyAdminRequest(request);
  if (authError) return authError;

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ configured: false, conversations: [], messages: [], selectedConversationId: null });
  }

  try {
    return NextResponse.json({
      configured: true,
      ...(await readSupportData(supabase, request.nextUrl.searchParams.get("conversationId") ?? undefined))
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load support inbox." }, { status: 500 });
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
    const body = (await request.json()) as {
      action?: "reply" | "mark_read" | "archive" | "reopen";
      conversationId?: string;
      message?: string;
    };

    if (!body.action || !body.conversationId) {
      return NextResponse.json({ error: "Invalid support action." }, { status: 400 });
    }

    if (body.action === "reply") {
      const message = body.message?.trim();
      if (!message) return NextResponse.json({ error: "Reply message is required." }, { status: 400 });

      const { error: messageError } = await supabase.from("support_messages").insert({
        conversation_id: body.conversationId,
        sender: "support",
        body: message,
        is_read: true
      });
      if (messageError) throw messageError;

      const { error: conversationError } = await supabase
        .from("support_conversations")
        .update({
          status: "pending",
          unread_count: 0,
          last_message: message,
          last_message_at: new Date().toISOString()
        })
        .eq("id", body.conversationId);
      if (conversationError) throw conversationError;
    }

    if (body.action === "mark_read") {
      const [{ error: messageError }, { error: conversationError }] = await Promise.all([
        supabase.from("support_messages").update({ is_read: true }).eq("conversation_id", body.conversationId).eq("sender", "user"),
        supabase.from("support_conversations").update({ unread_count: 0 }).eq("id", body.conversationId)
      ]);
      if (messageError) throw messageError;
      if (conversationError) throw conversationError;
    }

    if (body.action === "archive" || body.action === "reopen") {
      const { error } = await supabase
        .from("support_conversations")
        .update({ status: body.action === "archive" ? "archived" : "open", unread_count: body.action === "archive" ? 0 : undefined })
        .eq("id", body.conversationId);
      if (error) throw error;
    }

    return NextResponse.json({ ok: true, ...(await readSupportData(supabase, body.conversationId)) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update support inbox." }, { status: 500 });
  }
}
