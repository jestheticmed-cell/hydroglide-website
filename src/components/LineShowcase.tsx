import Image from "next/image";
import Link from "next/link";
import type { ProductLine } from "@/lib/types";

type LineShowcaseProps = {
  lines: ProductLine[];
  productHrefByLineSlug: Record<string, string>;
  productImageByLineSlug: Record<string, string>;
};

export function LineShowcase({ lines, productHrefByLineSlug, productImageByLineSlug }: LineShowcaseProps) {
  return (
    <div className="mt-10 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          {lines.map((line) => (
            <Link key={line.slug} href={productHrefByLineSlug[line.slug] ?? `/efoils/${line.slug}`} className="group block cursor-pointer border border-line bg-porcelain">
              <div className="relative aspect-[4/5] overflow-hidden bg-mist">
                <Image
                  src={productImageByLineSlug[line.slug] ?? line.heroImages[0]}
                  alt={line.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-graphite">{line.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-semibold text-ink">{line.name}</h3>
                <p className="mt-3 text-sm leading-6 text-graphite">{line.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
