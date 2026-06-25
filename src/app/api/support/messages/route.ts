import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type SupportMessageRow = {
  id: string;
  conversation_id: string;
  sender: "user" | "support" | "system";
  body: string;
  is_read: boolean;
  created_at: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) return String((error as { message?: unknown }).message);
  return "Unable to send support message.";
}

async function readMessages(supabase: NonNullable<ReturnType<typeof getSupabaseServiceClient>>, conversationId: string) {
  const { data, error } = await supabase
    .from("support_messages")
    .select("id,conversation_id,sender,body,is_read,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at");

  if (error) throw error;
  return (data ?? []) as SupportMessageRow[];
}

export async function GET(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ configured: false, error: "Missing Supabase service role configuration.", messages: [] });
  }

  const conversationId = request.nextUrl.searchParams.get("conversationId");
  if (!conversationId) {
    return NextResponse.json({ error: "Missing conversationId." }, { status: 400 });
  }

  try {
    return NextResponse.json({ configured: true, conversationId, messages: await readMessages(supabase, conversationId) });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ configured: false, error: "Support messaging is not configured. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as {
      conversationId?: string;
      message?: string;
      customerName?: string;
      customerEmail?: string;
      subject?: string;
    };
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    let conversationId = body.conversationId;

    if (!conversationId) {
      const { data, error } = await supabase
        .from("support_conversations")
        .insert({
          customer_name: body.customerName?.trim() || "Website visitor",
          customer_email: body.customerEmail?.trim() || null,
          subject: body.subject?.trim() || message.slice(0, 80),
          unread_count: 1,
          last_message: message,
          last_message_at: new Date().toISOString()
        })
        .select("id")
        .single();

      if (error) throw error;
      conversationId = data.id as string;
    } else {
      const { data: conversation } = await supabase
        .from("support_conversations")
        .select("unread_count")
        .eq("id", conversationId)
        .maybeSingle();

      const { error } = await supabase
        .from("support_conversations")
        .update({
          status: "open",
          unread_count: Number(conversation?.unread_count ?? 0) + 1,
          last_message: message,
          last_message_at: new Date().toISOString()
        })
        .eq("id", conversationId);

      if (error) throw error;
    }

    const { error: messageError } = await supabase.from("support_messages").insert({
      conversation_id: conversationId,
      sender: "user",
      body: message,
      is_read: false
    });

    if (messageError) throw messageError;

    return NextResponse.json({ configured: true, conversationId, messages: await readMessages(supabase, conversationId) });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
