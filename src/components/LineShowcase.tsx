import Image from "next/image";
import Link from "next/link";
import { getStorefrontLineConfig } from "@/lib/product-line-config";
import type { HomeSeriesCard } from "@/lib/site-content";
import type { ProductLine } from "@/lib/types";

type LineShowcaseProps = {
  lines: ProductLine[];
  cards: Record<string, HomeSeriesCard>;
};

export function LineShowcase({ lines, cards }: LineShowcaseProps) {
  return (
    <div className="mt-10 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {lines.map((line) => {
            const card = cards[line.slug];
            const config = getStorefrontLineConfig(line.slug);
            const href = config?.category === "foils" ? `/foils/${line.slug}` : `/efoils/${line.slug}`;

            return (
              <Link key={line.slug} href={href} className="group block cursor-pointer border border-line bg-porcelain">
                <div className="relative aspect-[4/5] overflow-hidden bg-mist">
                  {card?.image ? (
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-graphite">
                      Series image coming soon
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold leading-7 text-ink">{card?.title ?? line.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-graphite">{card?.subtitle ?? line.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
