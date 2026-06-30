import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { formatPrice } from "@/lib/data";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  showSummary?: boolean;
};

export function ProductCard({ product, showSummary = false }: ProductCardProps) {
  const image = product.images[0] ?? "/brand/hydroglide-logo.jpg";

  return (
    <article className="group border border-line bg-white">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-white">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-6 transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="px-5 pb-4 pt-5">
          <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
          <p className="mt-2 text-base font-medium text-charcoal">{formatPrice(product)}</p>
          {showSummary ? <p className="mt-3 text-sm leading-6 text-graphite">{product.summary}</p> : null}
        </div>
      </Link>
      <div className="px-5 pb-5">
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          priceCents={product.priceCents}
          currency={product.currency}
          image={image}
          compact
        />
      </div>
    </article>
  );
}
