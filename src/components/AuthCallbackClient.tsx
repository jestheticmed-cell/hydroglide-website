"use client";

import { useEffect } from "react";
import { getSupabaseAuthClient } from "@/lib/supabase";

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }

  return value;
}

export function AuthCallbackClient() {
  useEffect(() => {
    function fail(loginPath: string, error: string, detail?: string) {
      const params = new URLSearchParams({ error });

      if (detail) {
        params.set("detail", detail.slice(0, 180));
      }

      window.location.replace(`${loginPath}&${params.toString()}`);
    }

    async function completeSignIn() {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const code = params.get("code");
      const hashAccessToken = hashParams.get("access_token");
      const hashRefreshToken = hashParams.get("refresh_token");
      const oauthError = params.get("error") || hashParams.get("error");
      const provider = params.get("provider") === "email" ? "email" : "google";
      const nextPath = getSafeNextPath(params.get("next") || hashParams.get("next"));
      const loginPath = `/login?next=${encodeURIComponent(nextPath)}`;
      const supabase = getSupabaseAuthClient();

      if (!supabase) {
        fail(loginPath, "config", "Supabase browser client is missing URL or anon key.");
        return;
      }

      if (oauthError) {
        fail(loginPath, "oauth", params.get("error_description") || hashParams.get("error_description") || oauthError);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          fail(loginPath, "oauth", error.message);
          return;
        }
      } else if (hashAccessToken && hashRefreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: hashAccessToken,
          refresh_token: hashRefreshToken
        });

        if (error) {
          fail(loginPath, "oauth", error.message);
          return;
        }
      }

      const { data, error: userError } = await supabase.auth.getSession();

      if (userError || !data.session?.access_token) {
        fail(loginPath, "oauth", userError?.message || "No Supabase session was created after OAuth callback.");
        return;
      }

      const response = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ provider })
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        fail(loginPath, "profile", detail || "Profile sync request failed.");
        return;
      }

      window.location.replace(nextPath);
    }

    completeSignIn();
  }, []);

  return <p className="text-center text-sm text-graphite">Completing secure sign-in...</p>;
}
