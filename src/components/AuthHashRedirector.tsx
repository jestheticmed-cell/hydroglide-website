"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AuthHashRedirector() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/auth/callback" || !window.location.hash.includes("access_token=")) {
      return;
    }

    window.location.replace(`/auth/callback${window.location.hash}`);
  }, [pathname]);

  return null;
}
