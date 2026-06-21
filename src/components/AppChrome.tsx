"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import type { ProductLine } from "@/lib/types";

type AppChromeProps = {
  children: ReactNode;
  lines: ProductLine[];
};

export function AppChrome({ children, lines }: AppChromeProps) {
  const pathname = usePathname();
  const isStandalonePage = pathname === "/checkout" || pathname === "/login" || pathname === "/auth/callback";

  if (isStandalonePage) {
    return (
      <>
        {children}
        <CartDrawer />
      </>
    );
  }

  return (
    <>
      <Header lines={lines} />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}
