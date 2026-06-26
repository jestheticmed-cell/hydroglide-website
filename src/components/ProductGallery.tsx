"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const galleryImages = (images.length ? images : ["/brand/hydroglide-logo.jpg"]).slice(0, 10);

  useEffect(() => {
    setActive(0);
  }, [images]);

  return (
    <div className="grid gap-5">
      <div className="group relative aspect-[4/3] overflow-hidden bg-white">
        <Image
          src={galleryImages[active] ?? galleryImages[0]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-contain transition duration-700 group-hover:scale-125"
        />
        <div className="pointer-events-none absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white/80 text-charcoal shadow-sm backdrop-blur">
          <ZoomIn className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {galleryImages.length > 1 ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`Show ${name} image ${index + 1}`}
              onClick={() => setActive(index)}
              className={`relative h-24 w-32 shrink-0 overflow-hidden border bg-white transition hover:border-[#8a8f27] sm:h-28 sm:w-40 ${
                active === index ? "border-[#8a8f27]" : "border-line"
              }`}
            >
              <Image src={image} alt="" fill sizes="160px" className="object-contain" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
