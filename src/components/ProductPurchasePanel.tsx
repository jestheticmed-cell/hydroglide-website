"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

type ProductPurchasePanelProps = {
  productId: string;
  productName: string;
  priceCents: number;
  currency: "USD";
  image: string;
  colorOptions: string[];
  selectedColor?: string;
  onColorChange?: (color: string) => void;
};

export function ProductPurchasePanel({
  productId,
  productName,
  priceCents,
  currency,
  image,
  colorOptions,
  selectedColor,
  onColorChange
}: ProductPurchasePanelProps) {
  const [internalColor, setInternalColor] = useState(colorOptions[0] ?? "White");
  const activeColor = selectedColor ?? internalColor;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCart();

  return (
    <div className="mt-8 grid gap-7">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-graphite">Color</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {colorOptions.map((color) => {
            const selected = color === activeColor;

            return (
              <button
                key={color}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setInternalColor(color);
                  onColorChange?.(color);
                }}
                className={`h-11 rounded-full border px-5 text-sm font-medium transition ${
                  selected
                    ? "border-[#41b8ae] bg-[#f3f3f3] text-ink"
                    : "border-line bg-white text-charcoal hover:border-[#41b8ae] hover:text-ink"
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-graphite">Quantity</p>
        <div className="mt-3 inline-grid h-12 grid-cols-[44px_64px_44px] overflow-hidden rounded-full border border-line bg-white">
          <button
            type="button"
            aria-label={`Decrease ${productName} quantity`}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="grid place-items-center text-ink transition hover:bg-[#f3f3f3]"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            aria-label={`${productName} quantity`}
            value={quantity}
            readOnly
            className="w-full border-x border-line bg-white text-center text-base font-medium text-ink outline-none"
          />
          <button
            type="button"
            aria-label={`Increase ${productName} quantity`}
            onClick={() => setQuantity((current) => current + 1)}
            className="grid place-items-center text-ink transition hover:bg-[#f3f3f3]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <button
        type="button"
        data-product-id={productId}
        data-selected-color={activeColor}
        data-quantity={quantity}
        onClick={() => {
          addItem({ productId, productName, priceCents, currency, image, quantity, color: activeColor });
          openCart();
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1600);
        }}
        className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#41b8ae] px-8 text-base font-semibold text-white transition hover:bg-[#35a89f] focus:outline-none focus:ring-2 focus:ring-[#41b8ae] focus:ring-offset-2 sm:w-fit"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        {added ? "Added" : "Add to Cart"}
      </button>

      <div className="grid gap-3 sm:max-w-md">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-graphite">Express Checkout</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            className="h-12 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-[#41b8ae] hover:text-[#41b8ae]"
          >
            PayPal
          </button>
          <button
            type="button"
            className="h-12 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-[#41b8ae] hover:text-[#41b8ae]"
          >
            Apple Pay
          </button>
          <button
            type="button"
            className="h-12 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-[#41b8ae] hover:text-[#41b8ae]"
          >
            Card
          </button>
        </div>
      </div>
    </div>
  );
}
