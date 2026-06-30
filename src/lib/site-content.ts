import { unstable_noStore as noStore } from "next/cache";
import { getSupabaseClient } from "./supabase";

export type HomeSeriesCard = {
  image: string;
  title: string;
  subtitle: string;
};

export type HomeContent = {
  hero: {
    videoSrc: string;
    title: string;
    copy: string;
  };
  productLines: {
    title: string;
    copy: string;
    cards: Record<string, HomeSeriesCard>;
    heroVideos: Record<string, string>;
  };
  bestSellers: {
    title: string;
    copy: string;
    productSlugs: string[];
  };
  reviews: {
    title: string;
    copy: string;
  };
};

export const fallbackHomeContent: HomeContent = {
  hero: {
    videoSrc: "/videos/website-video.mp4",
    title: "Glide Every Water Moment",
    copy: "The all-in-one efoil, glide effortlessly above waves, your ultimate gear for every water adventure"
  },
  productLines: {
    title: "Hydro Therapy & Sport Equipment Series",
    copy: "Purpose-built hydrotherapy and aquatic training systems for recovery, mobility, and performance.\nExplore four equipment series designed for different treatment and training intensities.",
    cards: {
      "lift-5f": {
        image: "",
        title: "Mobility Therapy Devices",
        subtitle: "Foundational aquatic mobility systems."
      },
      "lift-5": {
        image: "",
        title: "Multi-Functional Therapeutic Apparatus",
        subtitle: "Versatile therapeutic systems for structured recovery."
      },
      "boards": {
        image: "",
        title: "Moderate Training Gear",
        subtitle: "Stable, controlled aquatic training systems."
      },
      "masts": {
        image: "",
        title: "High-Intensity Hydro System",
        subtitle: "Power-focused systems for advanced aquatic training."
      }
    },
    heroVideos: {
      "lift-5f": "/videos/lift5F.mp4"
    }
  },
  bestSellers: {
    title: "BEST SELLERS",
    copy: "Our crowd-favorite efoils trusted by riders worldwide.\nBalanced stability and thrilling performance in every bestselling board.",
    productSlugs: []
  },
  reviews: {
    title: "REVIEWS",
    copy: "Authentic feedback from thousands of efoil riders worldwide.\nEvery five-star review speaks to smooth glides and reliable performance."
  }
};

export function mergeHomeContent(content?: Partial<HomeContent> | null): HomeContent {
  const storedCards = content?.productLines?.cards ?? {};
  const cards = Object.fromEntries(
    Object.entries(fallbackHomeContent.productLines.cards).map(([slug, fallbackCard]) => [
      slug,
      {
        ...fallbackCard,
        ...storedCards[slug]
      }
    ])
  );

  return {
    hero: {
      ...fallbackHomeContent.hero,
      ...content?.hero
    },
    productLines: {
      ...fallbackHomeContent.productLines,
      ...content?.productLines,
      cards,
      heroVideos: {
        ...fallbackHomeContent.productLines.heroVideos,
        ...content?.productLines?.heroVideos
      }
    },
    bestSellers: {
      ...fallbackHomeContent.bestSellers,
      ...content?.bestSellers
    },
    reviews: {
      ...fallbackHomeContent.reviews,
      ...content?.reviews
    }
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  noStore();
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackHomeContent;

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", "home")
    .maybeSingle();

  if (error || !data?.content) return fallbackHomeContent;
  return mergeHomeContent(data.content as Partial<HomeContent>);
}
