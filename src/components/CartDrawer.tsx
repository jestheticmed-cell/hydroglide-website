"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCents } from "@/lib/format";
import { useCart } from "./CartProvider";

const cartBannerText = "50%off-limited time";

export function CartDrawer() {
  const { items, subtotalCents, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[70] transition ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isCartOpen}
    >
      <button
        type="button"
        aria-label="Close cart overlay"
        onClick={closeCart}
        className={`absolute inset-0 bg-black/35 transition-opacity ${isCartOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-[#f3f3f3] shadow-[0_20px_80px_rgba(15,16,17,0.22)] transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-line bg-white px-7">
          <h2 className="text-3xl font-semibold text-ink">Cart</h2>
          <button type="button" aria-label="Close cart" onClick={closeCart} className="grid h-11 w-11 place-items-center text-ink hover:text-[#41b8ae]">
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="bg-[#fbf5ed] px-7 py-5 text-center">
          <p className="text-xl font-semibold text-[#41b8ae]">{cartBannerText}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-7">
          {items.length === 0 ? (
            <div className="grid min-h-[280px] place-items-center text-center">
              <div>
                <p className="text-xl font-semibold text-ink">Your cart is empty.</p>
                <p className="mt-3 text-sm leading-6 text-graphite">Add an eFoil package to start checkout.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-7">
              {items.map((item) => (
                <article key={`${item.productId}-${item.color ?? "default"}`} className="grid grid-cols-[112px_1fr] gap-5 border-b border-line pb-7">
                  <div className="relative aspect-square overflow-hidden bg-white">
                    <Image src={item.image} alt={item.productName} fill sizes="112px" className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold leading-7 text-ink">{item.productName}</h3>
                        {item.color ? <p className="mt-2 text-sm text-graphite">color: {item.color}</p> : null}
                      </div>
                      <p className="whitespace-nowrap text-base font-semibold text-ink">{formatCents(item.priceCents * item.quantity, item.currency)}</p>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="inline-grid h-10 grid-cols-[36px_48px_36px] overflow-hidden border border-line bg-white">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.productName} quantity`}
                          onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                          className="grid place-items-center hover:bg-[#f3f3f3]"
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="grid place-items-center border-x border-line text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.productName} quantity`}
                          onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                          className="grid place-items-center hover:bg-[#f3f3f3]"
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.productId, item.color)} className="text-sm text-graphite hover:text-ink">
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-line bg-white px-7 py-6">
          <div className="flex items-center justify-between text-xl font-semibold text-ink">
            <span>Subtotal</span>
            <span>{formatCents(subtotalCents)}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-graphite">Shipping, taxes, and discount codes calculated at checkout.</p>
          <Link
            href="/checkout"
            onClick={() => window.setTimeout(closeCart, 0)}
            className={`mt-5 flex h-14 items-center justify-center rounded-full bg-[#41b8ae] text-base font-semibold text-white transition hover:bg-[#35a89f] ${
              items.length === 0 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
