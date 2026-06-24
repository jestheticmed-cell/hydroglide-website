import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { getProductLine, getProductsByLine } from "@/lib/data";
import { getHomeContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

type ProductListPageProps = {
  params: Promise<{
    line: string;
  }>;
};

export default async function ProductListPage({ params }: ProductListPageProps) {
  const { line: slug } = await params;
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
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showSummary />
          ))}
        </div>
      </section>
    </main>
  );
}
