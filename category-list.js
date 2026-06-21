const categoryData = {
  efoils: {
    title: "Electric eFoils",
    kicker: "Electric Product Line",
    group: "efoil",
    intro: "Electric foil models organized by rider skill level, from stable first flights to professional speed.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=85",
    products: ["aerolift-one", "aerolift-flow", "aerolift-pro"],
  },
  "beginner-efoils": {
    title: "Beginner Entry eFoils",
    kicker: "First Flight",
    group: "efoil",
    intro: "Stable electric boards with softened acceleration, generous volume, and simple ride modes.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    products: ["aerolift-one"],
  },
  "balanced-efoils": {
    title: "Mid-Range Balanced eFoils",
    kicker: "Daily Progression",
    group: "efoil",
    intro: "Efficient, compact eFoils for riders who want range, responsiveness, and easy progression.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=85",
    products: ["aerolift-flow"],
  },
  "pro-efoils": {
    title: "Professional eFoils",
    kicker: "High Performance",
    group: "efoil",
    intro: "Reduced-volume carbon eFoils tuned for high-speed control and expert response.",
    image: "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=1600&q=85",
    products: ["aerolift-pro"],
  },
  foils: {
    title: "Non-Electric Foils",
    kicker: "Boards, Masts, Wings",
    group: "foil",
    intro: "Non-electric foil boards and components for prone surf, wing foil, downwind, and signature carbon builds.",
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=85",
    products: ["prone-foil-boards", "wing-foil-boards", "flying-boards", "performance-wings", "masts-spares"],
  },
  "foil-boards": {
    title: "Foil Boards",
    kicker: "Boards",
    group: "foil",
    intro: "Prone, wing, and flying board shapes built around clean release, stable stance, and precise foil mounting.",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=85",
    products: ["prone-foil-boards", "wing-foil-boards", "flying-boards"],
  },
  masts: {
    title: "Foil Masts",
    kicker: "Masts",
    group: "foil",
    intro: "Carbon mast and hardware options for tuning ride height, stiffness, speed, and serviceability.",
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1600&q=85",
    products: ["masts-spares"],
  },
  "foil-wings": {
    title: "Foil Wings",
    kicker: "Wings",
    group: "foil",
    intro: "Carbon front wings and stabilizers for high-aspect glide, surf carve, and controlled lift.",
    image: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=1600&q=85",
    products: ["performance-wings"],
  },
  "florence-signature": {
    title: "Florence Signature",
    kicker: "High-End Collection",
    group: "foil",
    intro: "Athlete-tuned carbon boards and foil parts for powerful surf, downwind speed, and high-end response.",
    image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=85",
    products: ["flying-boards"],
  },
  accessories: {
    title: "Accessories & Upgrade Parts",
    kicker: "System Upgrades",
    group: "accessories",
    intro: "Wings, batteries, chargers, masts, bags, guards, and spare parts for tuning and maintaining your foil setup.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    products: ["performance-wings", "batteries-chargers", "masts-spares"],
  },
  "matching-wings": {
    title: "Matching Wings",
    kicker: "Performance Wings",
    group: "accessories",
    intro: "Wing sets that tune lift, speed, efficiency, and carving character across electric and non-electric systems.",
    image: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=1600&q=85",
    products: ["performance-wings"],
  },
  "power-upgrades": {
    title: "Power Upgrades",
    kicker: "Batteries & Chargers",
    group: "accessories",
    intro: "Battery packs, rapid chargers, connector kits, and travel cases for longer electric foil sessions.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    products: ["batteries-chargers"],
  },
  "replacement-parts": {
    title: "Replacement Spare Parts",
    kicker: "Spares & Service",
    group: "accessories",
    intro: "Masts, prop guards, screw kits, board bags, and service parts that keep the system ready for water.",
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1600&q=85",
    products: ["masts-spares"],
  },
  "signature-collection": {
    title: "Athlete Signature Collections",
    kicker: "Co-Branded Builds",
    group: "efoil",
    intro: "Limited high-end carbon collections developed around athlete feedback and premium foil response.",
    image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=85",
    products: ["flying-boards"],
  },
};

const collectionNav = {
  efoil: [
    ["category-efoils.html", "All eFoils"],
    ["category-beginner-efoils.html", "Beginner"],
    ["category-balanced-efoils.html", "Balanced"],
    ["category-pro-efoils.html", "Professional"],
    ["category-signature-collection.html", "Signature"],
    ["category-matching-wings.html", "Wings"],
    ["category-replacement-parts.html", "Spares"],
  ],
  foil: [
    ["category-foils.html", "All Foils"],
    ["category-foil-boards.html", "Boards"],
    ["category-masts.html", "Masts"],
    ["category-foil-wings.html", "Wings"],
    ["category-florence-signature.html", "Florence"],
  ],
  accessories: [
    ["category-accessories.html", "All Accessories"],
    ["category-matching-wings.html", "Performance Wings"],
    ["category-power-upgrades.html", "Power"],
    ["category-replacement-parts.html", "Spares"],
  ],
};

const productCards = {
  "aerolift-one": {
    href: "product-aerolift-one.html",
    label: "Beginner Entry Model",
    name: "AeroLift One",
    text: "Stable volume, soft power mapping, and predictable lift for confident first sessions.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82",
  },
  "aerolift-flow": {
    href: "product-aerolift-flow.html",
    label: "Mid-Range Balanced Model",
    name: "AeroLift Flow",
    text: "Responsive ride feel, efficient battery range, and compact handling for everyday riders.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=82",
  },
  "aerolift-pro": {
    href: "product-aerolift-pro.html",
    label: "High-Performance Professional Model",
    name: "AeroLift Pro",
    text: "Reduced swing weight, race-tuned throttle response, and carbon stiffness for expert speed.",
    image: "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=1200&q=82",
  },
  "prone-foil-boards": {
    href: "product-prone-foil-boards.html",
    label: "Boards / Surf Foil",
    name: "Prone Foil Boards",
    text: "Compact, low-swing boards for paddle-in surf foiling, pump lines, and tight pocket control.",
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=82",
  },
  "wing-foil-boards": {
    href: "product-wing-foil-boards.html",
    label: "Masts / Wings / Boards",
    name: "Wing Foil Boards",
    text: "Balanced volume, early release, and stable stance geometry for wind-powered progression.",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=82",
  },
  "flying-boards": {
    href: "product-flying-boards.html",
    label: "Florence Signature Collection",
    name: "Flying Boards",
    text: "High-end carbon builds for powerful surf, downwind speed, and athlete-tuned lift response.",
    image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=82",
  },
  "performance-wings": {
    href: "product-performance-wings.html",
    label: "Matching Wings",
    name: "Performance Wings",
    text: "High-aspect, surf, and glide wings for range, speed, and specific riding styles.",
    image: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=1200&q=82",
  },
  "batteries-chargers": {
    href: "product-batteries-chargers.html",
    label: "Power Upgrades",
    name: "Batteries & Chargers",
    text: "Travel-ready battery packs, rapid chargers, and waterproof storage cases.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=82",
  },
  "masts-spares": {
    href: "product-masts-spares.html",
    label: "Replacement Spare Parts",
    name: "Masts & Spares",
    text: "Carbon masts, prop guards, board bags, screws, and replacement hardware kits.",
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1200&q=82",
  },
};

const categorySlug = document.body.dataset.category || "efoils";
const category = categoryData[categorySlug] || categoryData.efoils;
const root = document.querySelector("[data-category-list]");
const activeFile = `category-${categorySlug}.html`;

document.title = `${category.title} | AeroLift Foils`;

root.innerHTML = `
  <section class="category-hero section-pad">
    <div>
      <p class="level-path">Home / ${category.group === "efoil" ? "eFoil" : category.group === "foil" ? "Foils" : "Accessories"} / ${category.title}</p>
      <p class="section-kicker">${category.kicker}</p>
      <h2>${category.title}</h2>
      <p>${category.intro}</p>
    </div>
    <img src="${category.image}" alt="${category.title} category" />
  </section>
  <section class="category-list-section section-pad">
    <nav class="collection-nav" aria-label="${category.title} collection navigation">
      ${(collectionNav[category.group] || collectionNav.efoil)
        .map(([href, label]) => `<a class="${href === activeFile ? "is-active" : ""}" href="${href}">${label}</a>`)
        .join("")}
    </nav>
    <div class="section-heading">
      <div>
        <p class="section-kicker">Level 2 Collection Page</p>
        <h2>Select a product.</h2>
      </div>
      <p class="hierarchy-note">Cards open dedicated Level 3 product pages with specifications, media, and purchase details.</p>
    </div>
    <div class="product-grid three-col">
      ${category.products
        .map((slug) => {
          const product = productCards[slug];
          return `
            <article class="product-card">
              <a href="${product.href}" aria-label="${product.name} product detail">
                <img src="${product.image}" alt="${product.name}" />
                <div class="card-body">
                  <span>${product.label}</span>
                  <h3>${product.name}</h3>
                  <p>${product.text}</p>
                </div>
              </a>
            </article>
          `;
        })
        .join("")}
    </div>
  </section>
`;
