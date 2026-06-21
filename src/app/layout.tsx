import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppChrome } from "@/components/AppChrome";
import { CartProvider } from "@/components/CartProvider";
import { getProductLines } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hydroglide eFoils | Premium Electric Hydrofoil Boards",
  description: "Hydroglide premium eFoil boards and foil systems for quiet electric flight, long range, and high-performance ocean riding.",
  icons: {
    icon: "/brand/hydroglide-logo.jpg",
    shortcut: "/brand/hydroglide-logo.jpg",
    apple: "/brand/hydroglide-logo.jpg"
  }
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const lines = await getProductLines();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          <AppChrome lines={lines}>{children}</AppChrome>
        </CartProvider>
      </body>
    </html>
  );
}
