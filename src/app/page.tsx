import { HeroCarousel } from "@/components/HeroCarousel";
import { LineShowcase } from "@/components/LineShowcase";
import { ProductCard } from "@/components/ProductCard";
import { getBestSellers, getHeroSlides, getProduct, getProductLines, getReviews } from "@/lib/data";
import { getHomeContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const efoilLineSlugs = new Set(["lift-5f", "lift-5", "lift-x"]);

function normalizeBestSellerCount<T>(items: T[]) {
  return items.slice(0, 6);
}

export default async function HomePage() {
  const homeContent = await getHomeContent();
  const heroVideo = homeContent.hero.videoSrc.trim() ? homeContent.hero : undefined;
  const featuredLineProductSlugs = Object.entries(homeContent.productLines.featuredProductSlugs);
  const [slides, lines, autoBestSellers, selectedLineProducts, reviews] = await Promise.all([
    getHeroSlides(),
    getProductLines(),
    getBestSellers(),
    Promise.all(featuredLineProductSlugs.map(([, productSlug]) => getProduct(productSlug))),
    getReviews()
  ]);
  const efoilLines = lines.filter((line) => efoilLineSlugs.has(line.slug));
  const bestSellers = normalizeBestSellerCount(autoBestSellers);
  const productHrefByLineSlug = Object.fromEntries(
    featuredLineProductSlugs.map(([lineSlug, productSlug]) => [lineSlug, `/products/${productSlug}`])
  );
  const productImageByLineSlug = Object.fromEntries(
    featuredLineProductSlugs.flatMap(([lineSlug], index) => {
      const product = selectedLineProducts[index];
      const image = product?.images[0];
      return image ? [[lineSlug, image]] : [];
    })
  );

  return (
    <main>
      <HeroCarousel slides={slides} video={heroVideo} />

      <section id="efoils" className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-center lg:gap-14 lg:px-10">
          <h2 className="whitespace-nowrap text-3xl font-semibold leading-tight text-ink sm:text-5xl">{homeContent.productLines.title}</h2>
          <p className="text-sm leading-7 text-graphite sm:text-base lg:whitespace-nowrap">
            {homeContent.productLines.copy.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <LineShowcase lines={efoilLines} productHrefByLineSlug={productHrefByLineSlug} productImageByLineSlug={productImageByLineSlug} />
      </section>

      <section id="best-sellers" className="border-y border-line bg-mist py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-center lg:gap-14 lg:px-10">
          <h2 className="whitespace-nowrap text-3xl font-semibold leading-tight text-ink sm:text-5xl">{homeContent.bestSellers.title}</h2>
          <p className="text-sm leading-7 text-graphite sm:text-base lg:whitespace-nowrap">
            {homeContent.bestSellers.copy.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-10">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} showSummary />
          ))}
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-center lg:gap-14 lg:px-10">
          <h2 className="whitespace-nowrap text-3xl font-semibold leading-tight text-ink sm:text-5xl">{homeContent.reviews.title}</h2>
          <p className="text-sm leading-7 text-graphite sm:text-base lg:whitespace-nowrap">
            {homeContent.reviews.copy.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-7xl gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
          {reviews.map((review) => (
            <article key={review.id} className="border border-line bg-porcelain p-6">
              <div className="text-sm font-semibold text-ink">{review.rating} / 5</div>
              <p className="mt-5 text-sm leading-6 text-charcoal">{review.body}</p>
              <div className="mt-6 border-t border-line pt-5">
                <h3 className="text-sm font-semibold text-ink">{review.authorName}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-graphite">{review.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
