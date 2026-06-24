import { NextRequest, NextResponse } from "next/server";

export function verifyAdminRequest(request: NextRequest) {
  const configuredToken = process.env.ADMIN_ACCESS_TOKEN;

  if (!configuredToken) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Missing ADMIN_ACCESS_TOKEN. Set it before using the production admin console." },
        { status: 500 }
      );
    }

    return null;
  }

  const token = request.headers.get("x-admin-token");

  if (token !== configuredToken) {
    return NextResponse.json({ error: "Invalid admin token." }, { status: 401 });
  }

  return null;
}
