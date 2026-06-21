"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/lib/types";

type HeroCarouselProps = {
  slides: HeroSlide[];
  video?: {
    videoSrc: string;
    title: string;
    copy: string;
  };
};

export function HeroCarousel({ slides, video }: HeroCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (video) {
    return (
      <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-ink text-white">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata">
          <source src={video.videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] text-white sm:text-7xl lg:text-8xl">{video.title}</h1>
            <p className="mt-7 max-w-3xl text-base leading-7 text-white/80 sm:text-xl">{video.copy}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-ink text-white">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`}
          aria-hidden={index !== active}
        >
          <Image src={slide.image} alt="" fill priority={index === 0} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-5 py-24 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">{slides[active]?.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] text-white sm:text-7xl lg:text-8xl">
            {slides[active]?.title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{slides[active]?.copy}</p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-1.5 w-10 transition ${index === active ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>
    </section>
  );
}
