import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { getProductLine, getProductsByLine } from "@/lib/data";
import { hydrosportLineSlugs } from "@/lib/product-line-config";
import { getHomeContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

type FoilListPageProps = {
  params: Promise<{
    line: string;
  }>;
};

const foilLineSlugs = new Set<string>(hydrosportLineSlugs);

export default async function FoilListPage({ params }: FoilListPageProps) {
  const { line: slug } = await params;

  if (!foilLineSlugs.has(slug)) {
    notFound();
  }

  const line = await getProductLine(slug);

  if (!line) {
    notFound();
  }

  const [products, homeContent] = await Promise.all([getProductsByLine(line.slug), getHomeContent()]);
  const videoSrc = homeContent.productLines.heroVideos[line.slug as keyof typeof homeContent.productLines.heroVideos];

  return (
    <main>
      <CategoryHero line={line} videoSrc={videoSrc} />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showSummary />
              ))}
            </div>
          ) : (
            <div className="border border-line bg-porcelain px-6 py-10 text-center text-sm text-graphite">
              No published products in this foil category yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
