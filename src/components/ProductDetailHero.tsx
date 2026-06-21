"use client";

import { useMemo, useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";

type ProductDetailHeroProps = {
  product: Product;
};

export function ProductDetailHero({ product }: ProductDetailHeroProps) {
  const initialColor = product.colorOptions[0] ?? "";
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const selectedImages = useMemo(() => {
    if (selectedColor && product.colorImages?.[selectedColor]?.length) {
      return product.colorImages[selectedColor];
    }

    return product.images;
  }, [product.colorImages, product.images, selectedColor]);

  return (
    <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-16">
      <ProductGallery images={selectedImages} name={`${product.name} ${selectedColor}`} />

      <div className="lg:sticky lg:top-28 lg:self-start">
        <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-6xl">{product.name}</h1>
        <p className="mt-5 text-2xl font-semibold text-charcoal">{formatPrice(product)}</p>
        <p className="mt-6 text-base leading-8 text-graphite">{product.summary}</p>

        <ProductPurchasePanel
          productId={product.id}
          productName={product.name}
          priceCents={product.priceCents}
          currency={product.currency}
          image={selectedImages[0]}
          colorOptions={product.colorOptions}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
      </div>
    </section>
  );
}
