"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LiveChatWidget } from "./LiveChatWidget";
import type { ProductLine } from "@/lib/types";

type AppChromeProps = {
  children: ReactNode;
  lines: ProductLine[];
};

export function AppChrome({ children, lines }: AppChromeProps) {
  const pathname = usePathname();
  const isStandalonePage =
    pathname === "/checkout" ||
    pathname === "/login" ||
    pathname === "/auth/callback" ||
    pathname === "/account" ||
    pathname?.startsWith("/admin");

  if (isStandalonePage) {
    return (
      <>
        {children}
        {pathname?.startsWith("/admin") ? null : <CartDrawer />}
      </>
    );
  }

  return (
    <>
      <Header lines={lines} />
      {children}
      <Footer />
      <CartDrawer />
      <LiveChatWidget />
    </>
  );
}
