"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AuthHashRedirector() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/auth/callback") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const hasAuthCode = params.has("code");
    const hasAuthToken = hashParams.has("access_token");

    if (!hasAuthCode && !hasAuthToken) {
      return;
    }

    window.location.replace(`/auth/callback${window.location.search}${window.location.hash}`);
  }, [pathname]);

  return null;
}
