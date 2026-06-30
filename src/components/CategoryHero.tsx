"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProductLine } from "@/lib/types";

type CategoryHeroProps = {
  line: ProductLine;
  videoSrc?: string;
};

export function CategoryHero({ line, videoSrc }: CategoryHeroProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (videoSrc || line.heroImages.length === 0) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % line.heroImages.length);
    }, 4600);

    return () => window.clearInterval(timer);
  }, [line.heroImages.length, videoSrc]);

  return (
    <section className="border-b border-line bg-white">
      <div className="relative h-[52vh] min-h-[390px] overflow-hidden bg-ink">
        {videoSrc ? (
          <>
            <video className="absolute inset-0 h-full w-full object-cover" src={videoSrc} autoPlay muted loop playsInline preload="metadata" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          line.heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`}
            >
              <Image src={image} alt="" fill priority={index === 0} sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ))
        )}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-5 pb-12 sm:px-8 lg:px-10">
          <div className="max-w-3xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{line.eyebrow}</p>
            <h1 className="mt-4 text-5xl font-semibold leading-none sm:text-7xl">{line.name}</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <p className="w-full max-w-5xl text-base leading-7 text-graphite">{line.description}</p>
      </div>
    </section>
  );
}
