import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductDetailHero } from "@/components/ProductDetailHero";
import { formatPrice, getProduct, getProductsByLine } from "@/lib/data";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isImageValue(value: string) {
  return /^https?:\/\//.test(value) && (/\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(value) || value.includes("/storage/v1/object/public/"));
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
          <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-graphite">{detailEyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{detailTitle}</h2>
            </div>
            <div>
              <p className="text-base leading-8 text-graphite">{product.description}</p>
              <ul className="mt-7 grid gap-4">
                {product.details.map((detail) => (
                  <li key={detail} className="border-b border-line pb-4 text-base leading-7 text-charcoal">
                    {isImageValue(detail) ? <Image src={detail} alt="" width={900} height={560} unoptimized className="w-full bg-white object-contain" /> : detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="border-t border-line pt-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-graphite">{comparisonEyebrow}</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{comparisonTitle}</h2>
          <div className="mt-8 overflow-x-auto border border-line bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="border-b border-line px-5 py-4 text-sm font-semibold text-graphite">Parameter</th>
                  {sameSeriesProducts.map((item) => (
                    <th key={item.id} className="border-b border-line px-5 py-4 text-sm font-semibold text-ink">
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-line px-5 py-4 text-sm font-semibold text-graphite">Price</td>
                  {sameSeriesProducts.map((item) => (
                    <td key={`${item.id}-price`} className="border-b border-line px-5 py-4 text-sm text-charcoal">
                      {formatPrice(item)}
                    </td>
                  ))}
                </tr>
                {comparisonKeys.map((key) => (
                  <tr key={key}>
                    <td className="border-b border-line px-5 py-4 text-sm font-semibold text-graphite">{key}</td>
                    {sameSeriesProducts.map((item) => (
                      <td key={`${item.id}-${key}`} className="border-b border-line px-5 py-4 text-sm text-charcoal">
                        {item.specs[key] && isImageValue(item.specs[key]) ? (
                          <Image src={item.specs[key]} alt="" width={260} height={160} unoptimized className="h-28 w-full object-contain" />
                        ) : (
                          item.specs[key] ?? "-"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
