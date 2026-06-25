import { unstable_noStore as noStore } from "next/cache";
import { getSupabaseClient } from "./supabase";

export type HomeContent = {
  hero: {
    videoSrc: string;
    title: string;
    copy: string;
  };
  productLines: {
    title: string;
    copy: string;
    featuredProductSlugs: Record<string, string>;
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
    title: "EFOIL LINE",
    copy: "From leisurely floating to fast precise carving, EFOIL LINE creates rides tailored to every rider.\nEngineered for seamless glide, our complete eFoil range turns every water surface into your playground.",
    featuredProductSlugs: {
      "lift-5f": "lift-5f-cruiser",
      "lift-5": "lift-5-carbon",
      "lift-x": "lift-x-pro"
    },
    heroVideos: {
      "lift-5f": "/videos/lift5F.mp4"
    }
  },
  bestSellers: {
    title: "BEST SELLERS",
    copy: "Our crowd-favorite efoils trusted by riders worldwide.\nBalanced stability and thrilling performance in every bestselling board.",
    productSlugs: ["lift-5f-cruiser", "lift-5-carbon", "lift-x-pro"]
  },
  reviews: {
    title: "REVIEWS",
    copy: "Authentic feedback from thousands of efoil riders worldwide.\nEvery five-star review speaks to smooth glides and reliable performance."
  }
};

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
  return { ...fallbackHomeContent, ...(data.content as Partial<HomeContent>) };
}
