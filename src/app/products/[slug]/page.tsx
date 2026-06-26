import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductDetailHero } from "@/components/ProductDetailHero";
import { formatPrice, getProduct, getProductsByLine } from "@/lib/data";
import type { ProductSpecValue } from "@/lib/types";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isImageValue(value: string) {
  return /^https?:\/\//.test(value) && (/\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(value) || value.includes("/storage/v1/object/public/"));
}

function getSpecText(value: ProductSpecValue | undefined) {
  if (!value) return "";
  if (typeof value === "string") return isImageValue(value) ? "" : value;
  return value.text ?? "";
}

function getSpecImage(value: ProductSpecValue | undefined) {
  if (!value) return "";
  if (typeof value === "string") return isImageValue(value) ? value : "";
  return value.image ?? "";
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const sameSeriesProducts = await getProductsByLine(product.lineSlug);
  const comparisonKeys = Array.from(new Set(sameSeriesProducts.flatMap((item) => Object.keys(item.specs))));
  const detailEyebrow = product.detailEyebrow ?? "Product Details";
  const detailTitle = product.detailTitle ?? "Built for refined electric flight.";
  const comparisonEyebrow = product.comparisonEyebrow ?? "Series Comparison";
  const comparisonTitle = product.comparisonTitle ?? "Compare models in this series.";

  return (
    <main className="bg-[#f3f3f3]">
      <ProductDetailHero product={product} />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="border-t border-line pt-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-graphite">{detailEyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{detailTitle}</h2>
          <p className="mt-7 max-w-4xl text-base leading-8 text-graphite">{product.description}</p>
          <div className="mt-8 grid gap-5">
            {product.details.map((detail) => (
              <article key={detail} className="border border-line bg-white p-5 sm:p-6">
                {isImageValue(detail) ? (
                  <Image src={detail} alt="" width={1200} height={760} unoptimized className="mx-auto max-h-[560px] w-full object-contain" />
                ) : (
                  <p className="text-base leading-8 text-charcoal">{detail}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="border-t border-line pt-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-graphite">{comparisonEyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{comparisonTitle}</h2>
          <div className="mt-8 grid gap-5">
            {sameSeriesProducts.map((item) => (
              <article key={item.id} className="border border-line bg-white p-5 sm:p-6">
                <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
                  <div className="bg-mist p-4">
                    <Image
                      src={item.images[0] ?? "/brand/hydroglide-logo.jpg"}
                      alt={item.name}
                      width={420}
                      height={300}
                      unoptimized
                      className="h-48 w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-ink">{item.name}</h3>
                    <p className="mt-2 text-base font-medium text-charcoal">{formatPrice(item)}</p>
                    <div className="mt-5 grid gap-4">
                      {comparisonKeys.map((key) => {
                        const value = item.specs[key];
                        const image = getSpecImage(value);
                        const text = getSpecText(value);

                        if (!value) return null;

                        return (
                          <div key={`${item.id}-${key}`} className="border-t border-line pt-4">
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-graphite">{key}</p>
                            {image ? <Image src={image} alt="" width={520} height={320} unoptimized className="mt-3 max-h-72 w-full object-contain" /> : null}
                            {text ? <p className="mt-3 text-sm leading-7 text-charcoal">{text}</p> : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
