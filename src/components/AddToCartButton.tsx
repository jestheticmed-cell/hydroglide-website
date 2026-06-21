"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useCart } from "./CartProvider";

type AddToCartButtonProps = {
  productId: string;
  productName: string;
  priceCents: number;
  currency: "USD";
  image: string;
  compact?: boolean;
};

export function AddToCartButton({ productId, productName, priceCents, currency, image, compact = false }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  return (
    <button
      type="button"
      data-product-id={productId}
      aria-label={`Add ${productName} to cart`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addItem({ productId, productName, priceCents, currency, image });
        openCart();
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 border border-ink bg-ink font-semibold text-white transition hover:bg-charcoal focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2",
        compact ? "h-10 px-4 text-xs" : "h-12 px-6 text-sm"
      )}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {added ? "Added" : "Add to Cart"}
    </button>
  );
}
