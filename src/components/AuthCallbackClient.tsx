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
    async function completeSignIn() {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const code = params.get("code");
      const hashAccessToken = hashParams.get("access_token");
      const hashRefreshToken = hashParams.get("refresh_token");
      const oauthError = params.get("error") || hashParams.get("error");
      const nextPath = getSafeNextPath(params.get("next") || hashParams.get("next"));
      const loginPath = `/login?next=${encodeURIComponent(nextPath)}`;
      const supabase = getSupabaseAuthClient();

      if (!supabase) {
        window.location.replace(`${loginPath}&error=config`);
        return;
      }

      if (oauthError) {
        window.location.replace(`${loginPath}&error=oauth`);
        return;
      }

      const existingSession = await supabase.auth.getSession();

      if (!existingSession.data.session?.access_token && code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          window.location.replace(`${loginPath}&error=oauth`);
          return;
        }
      } else if (!existingSession.data.session?.access_token && hashAccessToken && hashRefreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: hashAccessToken,
          refresh_token: hashRefreshToken
        });

        if (error) {
          window.location.replace(`${loginPath}&error=oauth`);
          return;
        }
      }

      const { data, error: userError } = await supabase.auth.getSession();

      if (userError || !data.session?.access_token) {
        window.location.replace(`${loginPath}&error=oauth`);
        return;
      }

      const response = await fetch("/api/auth/sync-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ provider: "google" })
      });

      if (!response.ok) {
        window.location.replace(`${loginPath}&error=profile`);
        return;
      }

      window.location.replace(nextPath);
    }

    completeSignIn();
  }, []);

  return <p className="text-center text-sm text-graphite">Completing secure sign-in...</p>;
}
