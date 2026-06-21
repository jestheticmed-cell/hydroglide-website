"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [images]);

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist">
        <Image src={images[active]} alt={name} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={`Show ${name} image ${index + 1}`}
            onClick={() => setActive(index)}
            className={`relative aspect-[4/3] overflow-hidden border bg-mist ${
              active === index ? "border-ink" : "border-line"
            }`}
          >
            <Image src={image} alt="" fill sizes="25vw" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
