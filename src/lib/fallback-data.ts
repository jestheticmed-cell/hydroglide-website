import type { HeroSlide, Product, ProductLine, Review } from "./types";

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-quiet-power",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=86",
    eyebrow: "Silent electric lift",
    title: "Engineered for clean flight.",
    copy: "Premium eFoil systems shaped for long-range control, stable launches, and effortless ocean speed."
  },
  {
    id: "hero-carbon",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=86",
    eyebrow: "Carbon response",
    title: "Light under foot. Precise at speed.",
    copy: "A minimal platform for riders who want refined power delivery and predictable foil feedback."
  },
  {
    id: "hero-coast",
    image: "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=2400&q=86",
    eyebrow: "Made for open water",
    title: "Ride longer with less noise.",
    copy: "Every line is built around quiet propulsion, efficient range, and confident progression."
  }
];

export const productLines: ProductLine[] = [
  {
    id: "line-lift-5f",
    slug: "lift-5f",
    name: "Mobility Therapy Devices",
    eyebrow: "Hydrotherapy Equipment",
    tagline: "Foundational aquatic mobility systems.",
    description: "Therapy-focused equipment designed for guided aquatic mobility, smooth support, and confidence-building rehabilitation sessions.",
    heroImages: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=84",
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=2200&q=84",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2200&q=84"
    ],
    sortOrder: 1
  },
  {
    id: "line-lift-5",
    slug: "lift-5",
    name: "Multi-Functional Therapeutic Apparatus",
    eyebrow: "Hydrotherapy Equipment",
    tagline: "Versatile therapeutic systems for structured recovery.",
    description: "Multi-functional therapeutic equipment built for adaptable water rehabilitation, progressive routines, and refined clinical support.",
    heroImages: [
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=2200&q=84",
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=2200&q=84",
      "https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?auto=format&fit=crop&w=2200&q=84"
    ],
    sortOrder: 2
  },
  {
    id: "line-boards",
    slug: "boards",
    name: "Moderate Training Gear",
    eyebrow: "HydroSport Equipment",
    tagline: "Stable, controlled aquatic training systems.",
    description: "Equipment configured for stable stance, smooth resistance, and efficient therapeutic water movement.",
    heroImages: [],
    sortOrder: 3
  },
  {
    id: "line-masts",
    slug: "masts",
    name: "High-Intensity Hydro System",
    eyebrow: "HydroSport Equipment",
    tagline: "Power-focused systems for advanced aquatic training.",
    description: "High-output hydro systems designed for stronger resistance, higher intensity, and more demanding training sessions.",
    heroImages: [],
    sortOrder: 4
  }
];

export const products: Product[] = [
  {
    id: "prod-5f-cruiser",
    slug: "lift-5f-cruiser",
    lineSlug: "lift-5f",
    name: "Lift 5F Cruiser",
    priceCents: 899000,
    currency: "USD",
    summary: "High-volume board with smooth throttle mapping for relaxed first flights.",
    description: "A stable electric foil package with forgiving volume, a quiet drive unit, and balanced wing geometry for fast progression.",
    images: [
      "/products/lift-5f-cruiser/blue-iso.webp",
      "/products/lift-5f-cruiser/blue-iso-small.webp"
    ],
    colorOptions: ["Blue", "Green"],
    colorImages: {
      Blue: ["/products/lift-5f-cruiser/blue-iso.webp", "/products/lift-5f-cruiser/blue-iso-small.webp"],
      Green: [
        "/products/lift-5f-cruiser/green-iso.webp",
        "/products/lift-5f-cruiser/green-tilt-back.webp",
        "/products/lift-5f-cruiser/green-tilt-front.webp"
      ]
    },
    details: [
      "High-volume platform for stable starts and low-speed lift.",
      "Quiet electric drive with smooth beginner-friendly throttle response.",
      "Removable battery system designed for efficient waterfront swaps."
    ],
    specs: { Board: "5'4 carbon composite", Battery: "2.1 kWh removable", Runtime: "Up to 120 minutes", Mast: "28 in carbon" },
    isBestSeller: false,
    sortOrder: 1
  },
  {
    id: "prod-5f-travel",
    slug: "lift-5f-travel",
    lineSlug: "lift-5f",
    name: "Lift 5F Travel",
    priceCents: 929000,
    currency: "USD",
    summary: "Compact travel kit with easy handling and protected battery storage.",
    description: "Built for resort operators and traveling riders who need dependable lift, simple setup, and lightweight transport.",
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=84",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=84"
    ],
    colorOptions: ["White", "Sand", "Carbon"],
    details: [
      "Compact travel configuration with protected battery handling.",
      "Forgiving stance geometry for resort use and first-flight sessions.",
      "Lightweight carbon composite shell built for repeated transport."
    ],
    specs: { Board: "5'0 carbon composite", Battery: "Travel split pack", Runtime: "Up to 95 minutes", Mast: "26 in carbon" },
    isBestSeller: false,
    sortOrder: 2
  },
  {
    id: "prod-5-carbon",
    slug: "lift-5-carbon",
    lineSlug: "lift-5",
    name: "Lift 5 Carbon",
    priceCents: 1099000,
    currency: "USD",
    summary: "Refined all-water eFoil with responsive carving and extended range.",
    description: "The daily performance model pairs clean carbon stiffness with a quiet propulsion system and fast battery swaps.",
    images: [
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=84",
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=84"
    ],
    colorOptions: ["White", "Carbon", "Slate"],
    details: [
      "Balanced all-water setup for carving, cruising, and longer range.",
      "Fast battery access with refined sealing for saltwater environments.",
      "Responsive carbon board feel with predictable foil feedback."
    ],
    specs: { Board: "4'9 carbon", Battery: "2.4 kWh removable", Runtime: "Up to 150 minutes", Mast: "30 in carbon" },
    isBestSeller: false,
    sortOrder: 1
  },
  {
    id: "prod-5-range",
    slug: "lift-5-range",
    lineSlug: "lift-5",
    name: "Lift 5 Range",
    priceCents: 1149000,
    currency: "USD",
    summary: "Long-session setup with efficient wing pairing and composed tracking.",
    description: "A range-focused build for guided tours, coastal cruising, and riders who want more water time from every charge.",
    images: [
      "https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?auto=format&fit=crop&w=1600&q=84",
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=84"
    ],
    colorOptions: ["White", "Mist", "Carbon"],
    details: [
      "Extended battery configuration for long coastal routes.",
      "Efficient wing pairing focused on low-drag cruising.",
      "Composed tracking for guided sessions and repeat daily use."
    ],
    specs: { Board: "5'1 carbon", Battery: "2.8 kWh extended", Runtime: "Up to 180 minutes", Mast: "30 in carbon" },
    isBestSeller: false,
    sortOrder: 2
  },
  {
    id: "prod-x-pro",
    slug: "lift-x-pro",
    lineSlug: "lift-x",
    name: "Lift X Pro",
    priceCents: 1299000,
    currency: "USD",
    summary: "Reduced swing weight, quick acceleration, and high-speed foil response.",
    description: "The expert eFoil platform for fast riders who want direct control, race-tuned power, and compact board geometry.",
    images: [
      "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=1600&q=84",
      "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=1600&q=84"
    ],
    colorOptions: ["Carbon", "White", "Graphite"],
    details: [
      "Race-tuned power delivery for fast acceleration and tight control.",
      "Reduced swing weight for aggressive carving and quick transitions.",
      "High-modulus carbon mast pairing for precise expert feedback."
    ],
    specs: { Board: "4'4 carbon race", Battery: "2.4 kWh high-output", Runtime: "Up to 115 minutes", Mast: "32 in HM carbon" },
    isBestSeller: false,
    sortOrder: 1
  },
  {
    id: "prod-x-ultra",
    slug: "lift-x-ultra",
    lineSlug: "lift-x",
    name: "Lift X Ultra",
    priceCents: 1399000,
    currency: "USD",
    summary: "The lightest high-output configuration for aggressive carving.",
    description: "A premium carbon package with aggressive stance geometry, high-aspect wing options, and instantaneous throttle feel.",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=84",
      "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1600&q=84"
    ],
    colorOptions: ["Carbon", "Mist", "White"],
    details: [
      "Ultra-compact expert board geometry for high-output sessions.",
      "Instant throttle feel with lightweight battery configuration.",
      "Premium carbon package shaped for sharp response and speed."
    ],
    specs: { Board: "4'2 HM carbon", Battery: "2.2 kWh high-output", Runtime: "Up to 100 minutes", Mast: "32 in HM carbon" },
    isBestSeller: false,
    sortOrder: 2
  }
];

export const reviews: Review[] = [
  {
    id: "review-1",
    authorName: "Mason Clarke",
    location: "California",
    rating: 5,
    body: "The launch feels calm and predictable. It has the premium silence I wanted without losing speed."
  },
  {
    id: "review-2",
    authorName: "Elena Brooks",
    location: "Mallorca",
    rating: 5,
    body: "Range is excellent, setup is clean, and the board still feels compact when carving."
  },
  {
    id: "review-3",
    authorName: "Noah Reed",
    location: "Gold Coast",
    rating: 5,
    body: "The carbon response is immediate. Lift X finally made fast sessions feel controlled."
  },
  {
    id: "review-4",
    authorName: "Sofia Bennett",
    location: "Miami",
    rating: 5,
    body: "Minimal design, fast charging, and a much smoother first-flight experience than expected."
  }
];
