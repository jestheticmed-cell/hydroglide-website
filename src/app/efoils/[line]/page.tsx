import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { getProductLine, getProductLines, getProductsByLine } from "@/lib/data";
import { homeContent } from "@/lib/site-content";

type ProductListPageProps = {
  params: Promise<{
    line: string;
  }>;
};

export async function generateStaticParams() {
  const lines = await getProductLines();
  return lines.map((line) => ({ line: line.slug }));
}

export default async function ProductListPage({ params }: ProductListPageProps) {
  const { line: slug } = await params;
  const line = await getProductLine(slug);

  if (!line) {
    notFound();
  }

  const products = await getProductsByLine(line.slug);
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
