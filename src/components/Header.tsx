"use client";

import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { ProductLine } from "@/lib/types";

type HeaderProps = {
  lines: ProductLine[];
};

const efoilLineSlugs = new Set(["lift-5f", "lift-5", "lift-x"]);

export function Header({ lines }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"efoils" | "foils" | null>(null);
  const pathname = usePathname();
  const { totalQuantity, openCart } = useCart();
  const loginHref = `/login?next=${encodeURIComponent(pathname || "/")}`;
  const efoilItems = lines
    .filter((line) => efoilLineSlugs.has(line.slug))
    .map((line) => ({
      href: `/efoils/${line.slug}`,
      label: line.name.replace(/\s/g, "")
    }));
  const foilItems = [
    { href: "/#foils", label: "Boards" },
    { href: "/#foils", label: "Masts" },
    { href: "/#foils", label: "Wings" }
  ];
  const navTypeClass = "[font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif] text-[22px] font-normal tracking-normal";
  const dropdownTypeClass = "[font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif] text-[18px] font-normal tracking-normal";
  const mobileNavTypeClass = "[font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif] text-[22px] font-normal tracking-normal";
  const brandTypeClass = "[font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif] text-[20.5px] font-normal tracking-normal";
  const searchTypeClass = "[font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif] text-[18px] font-normal tracking-normal";
  const navLinkClass =
    `relative flex h-[75px] items-center text-ink transition after:absolute after:bottom-4 after:left-0 after:h-px after:w-full after:origin-center after:scale-x-0 after:bg-[#078b8b] after:transition hover:text-[#078b8b] hover:after:scale-x-100 ${navTypeClass}`;
  const dropdownLinkClass =
    `relative block bg-white px-5 py-3 text-ink transition after:absolute after:bottom-2 after:left-5 after:h-px after:w-[calc(100%-40px)] after:origin-center after:scale-x-0 after:bg-[#078b8b] after:transition hover:text-[#078b8b] hover:after:scale-x-100 ${dropdownTypeClass}`;
  const toolButtonClass =
    "grid h-12 w-12 place-items-center border border-transparent text-ink transition hover:text-[#078b8b] focus:outline-none focus:ring-2 focus:ring-[#078b8b] focus:ring-offset-2";
  const dropdownClass = (name: "efoils" | "foils") =>
    `absolute left-1/2 top-full z-[80] w-56 -translate-x-1/2 bg-white p-3 shadow-[0_22px_60px_rgba(39,41,44,0.14)] transition group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 ${
      openDropdown === name ? "visible pointer-events-auto translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-3 opacity-0"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[75px] w-full items-center justify-between px-8 sm:px-12 lg:px-16 xl:px-20">
        <Link href="/" className="flex items-center gap-3" aria-label="Hydroglide home">
          <span className="relative h-14 w-14 overflow-hidden rounded-full bg-white">
            <Image src="/brand/hydroglide-logo.jpg" alt="Hydroglide logo" fill sizes="56px" className="object-cover" priority />
          </span>
          <span className={`text-ink ${brandTypeClass}`}>Hydroglide</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-10 xl:flex" aria-label="Primary navigation">
          <div
            className="group relative"
            onPointerEnter={() => setOpenDropdown("efoils")}
            onMouseEnter={() => setOpenDropdown("efoils")}
            onMouseLeave={() => setOpenDropdown(null)}
            onFocus={() => setOpenDropdown("efoils")}
          >
            <Link
              href="/#efoils"
              className={navLinkClass}
              onClick={(event) => {
                if (openDropdown !== "efoils") {
                  event.preventDefault();
                  setOpenDropdown("efoils");
                }
              }}
            >
              Efoils
            </Link>
            <div className={dropdownClass("efoils")}>
              <div className="grid gap-2">
                {efoilItems.map((item) => (
                  <Link key={item.href} href={item.href} className={dropdownLinkClass}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div
            className="group relative"
            onPointerEnter={() => setOpenDropdown("foils")}
            onMouseEnter={() => setOpenDropdown("foils")}
            onMouseLeave={() => setOpenDropdown(null)}
            onFocus={() => setOpenDropdown("foils")}
          >
            <Link
              href="/#foils"
              className={navLinkClass}
              onClick={(event) => {
                if (openDropdown !== "foils") {
                  event.preventDefault();
                  setOpenDropdown("foils");
                }
              }}
            >
              Foils
            </Link>
            <div className={dropdownClass("foils")}>
              <div className="grid gap-2">
                {foilItems.map((item) => (
                  <Link key={item.label} href={item.href} className={dropdownLinkClass}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/about-us" className={navLinkClass}>
            About us
          </Link>
          <Link href="/contact" className={navLinkClass}>
            Contact us
          </Link>
        </nav>

        <div className="hidden items-center gap-2 xl:flex" aria-label="Store tools">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search products"
              placeholder="search for"
              className={`h-[38px] w-[340px] rounded-full bg-mist pl-12 pr-6 text-ink outline-none ring-1 ring-transparent transition placeholder:text-graphite/70 focus:bg-white focus:ring-line ${searchTypeClass}`}
            />
          </label>
          <Link href={loginHref} className={toolButtonClass} aria-label="Account">
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button type="button" onClick={openCart} className={`${toolButtonClass} relative`} aria-label={`Cart with ${totalQuantity} items`}>
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {totalQuantity > 0 ? (
              <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#41b8ae] px-1 text-[11px] font-semibold leading-none text-white">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            ) : null}
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="grid h-11 w-11 place-items-center border border-line xl:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-5 py-4 xl:hidden">
          <div className="grid gap-2">
            <span className={`px-2 py-2 text-graphite ${mobileNavTypeClass}`}>eFoils</span>
            {efoilItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`bg-porcelain px-4 py-3 text-ink transition hover:bg-charcoal hover:text-white ${mobileNavTypeClass}`}
              >
                {item.label}
              </Link>
            ))}
            <span className={`mt-3 px-2 py-2 text-graphite ${mobileNavTypeClass}`}>Foils</span>
            {foilItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`bg-porcelain px-4 py-3 text-ink transition hover:bg-charcoal hover:text-white ${mobileNavTypeClass}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/about-us" onClick={() => setOpen(false)} className={`mt-3 px-4 py-3 text-ink ${mobileNavTypeClass}`}>
              About Us
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className={`px-4 py-3 text-ink ${mobileNavTypeClass}`}>
              Contact us
            </Link>
            <label className="relative mt-3 block">
              <Search className="pointer-events-none absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-graphite" aria-hidden="true" />
              <input
                type="search"
                aria-label="Search products"
                placeholder="search for"
                className={`h-14 w-full rounded-full bg-mist pl-[60px] pr-6 text-ink outline-none placeholder:text-graphite/70 ${mobileNavTypeClass}`}
              />
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href={loginHref} onClick={() => setOpen(false)} className="grid h-12 place-items-center border border-line text-ink" aria-label="Account">
                <User className="h-5 w-5" aria-hidden="true" />
              </Link>
              <button type="button" onClick={openCart} className="relative grid h-12 place-items-center border border-line text-ink" aria-label={`Cart with ${totalQuantity} items`}>
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {totalQuantity > 0 ? (
                  <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#41b8ae] px-1 text-[11px] font-semibold leading-none text-white">
                    {totalQuantity > 99 ? "99+" : totalQuantity}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
