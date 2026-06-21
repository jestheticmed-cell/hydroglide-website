const products = {
  "aerolift-one": {
    name: "AeroLift One",
    kicker: "Beginner Entry Model",
    price: "$7,450",
    intro: "A stable entry eFoil with softened acceleration, generous float, and predictable first-flight control.",
    tags: ["105 min range", "High-volume board", "Beginner modes", "Protected drive"],
    hero: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Board Volume", "92 L stable entry platform"],
      ["Top Speed", "22 mph / 35 kmh"],
      ["Battery", "Removable 1.8 kWh marine sealed pack"],
      ["Construction", "Carbon reinforced shell with soft rail geometry"],
    ],
    included: [
      ["Wing Set", "Lift front wing, stabilizer, fuselage"],
      ["Controls", "Wireless hand controller with beginner speed gates"],
      ["Travel", "Board bag, mast cover, hardware roll"],
    ],
    care: [
      ["Rinse", "Fresh water rinse after every saltwater ride"],
      ["Compatible", "AeroLift entry wings, glide wings, standard masts"],
      ["Service", "Modular drive, mast, and board hardware spares"],
    ],
  },
  "aerolift-flow": {
    name: "AeroLift Flow",
    kicker: "Mid-Range Balanced Model",
    price: "$8,950",
    intro: "A balanced electric ride with responsive handling, efficient range, and compact daily-session control.",
    tags: ["90 min range", "Carbon board", "Quiet drive", "Tool-free wing swap"],
    hero: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Board Volume", "72 L balanced platform"],
      ["Top Speed", "28 mph / 45 kmh"],
      ["Battery", "Removable 2.1 kWh marine sealed pack"],
      ["Construction", "Carbon fiber shell with reinforced standing zone"],
    ],
    included: [
      ["Wing Set", "Glide front wing, stabilizer, fuselage"],
      ["Controls", "Wireless hand controller with ride modes"],
      ["Travel", "Board bag, mast cover, hardware roll"],
    ],
    care: [
      ["Rinse", "Fresh water rinse after every saltwater ride"],
      ["Compatible", "AeroLift masts, high-aspect wings, surf wings"],
      ["Service", "Modular spare parts for drive, mast, and board hardware"],
    ],
  },
  "aerolift-pro": {
    name: "AeroLift Pro",
    kicker: "High-Performance Professional Model",
    price: "$10,850",
    intro: "A reduced-volume pro eFoil tuned for expert speed, fast roll response, and high-stiffness carbon feedback.",
    tags: ["32 mph speed", "Race throttle", "Low swing weight", "Pro carbon layup"],
    hero: "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Board Volume", "58 L compact performance platform"],
      ["Top Speed", "32 mph / 51 kmh"],
      ["Battery", "Removable 2.3 kWh high-output pack"],
      ["Construction", "High-modulus carbon fiber with race stance reinforcement"],
    ],
    included: [
      ["Wing Set", "High-speed front wing, stabilizer, fuselage"],
      ["Controls", "Wireless controller with sport and race modes"],
      ["Travel", "Board bag, carbon mast cover, hardware roll"],
    ],
    care: [
      ["Rinse", "Fresh water rinse and dry connector inspection"],
      ["Compatible", "AeroLift pro masts and high-aspect wing sets"],
      ["Service", "Replaceable drive, prop guard, mast, and fuselage components"],
    ],
  },
  "prone-foil-boards": {
    name: "Prone Foil Boards",
    kicker: "Boards / Surf Foil",
    price: "$1,650",
    intro: "Compact surf foil boards for paddle-in starts, tight pocket control, pump lines, and low-swing turning.",
    tags: ["Compact volume", "Surf stance", "Carbon deck", "Fast release"],
    hero: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Board Volume", "34 L / 42 L / 50 L sizes"],
      ["Rail Profile", "Low rail with beveled release edge"],
      ["Mount", "Dual track foil mount"],
      ["Construction", "Carbon sandwich shell with reinforced standing zone"],
    ],
    included: [
      ["Deck", "Corduroy traction pad"],
      ["Mounting", "Track hardware set"],
      ["Travel", "Board sleeve and rail guards"],
    ],
    care: [
      ["Rinse", "Fresh water rinse after saltwater sessions"],
      ["Compatible", "AeroLift masts, surf wings, glide wings"],
      ["Service", "Replaceable track hardware and traction"],
    ],
  },
  "wing-foil-boards": {
    name: "Wing Foil Boards",
    kicker: "Masts / Wings / Boards",
    price: "$1,950",
    intro: "Balanced wing foil boards with early release, stable stance geometry, and volume options for progression.",
    tags: ["Early takeoff", "Stable deck", "Carry handle", "Dual tracks"],
    hero: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Board Volume", "70 L / 85 L / 100 L sizes"],
      ["Bottom Shape", "Double concave entry with release tail"],
      ["Mount", "Long dual track foil mount"],
      ["Construction", "Carbon reinforced composite with impact skin"],
    ],
    included: [
      ["Deck", "Full traction pad with stance markers"],
      ["Mounting", "Foil track hardware set"],
      ["Travel", "Board bag with shoulder strap"],
    ],
    care: [
      ["Rinse", "Rinse foil tracks and vent area after use"],
      ["Compatible", "AeroLift masts, front wings, stabilizers"],
      ["Service", "Replaceable handle, pad, and track hardware"],
    ],
  },
  "flying-boards": {
    name: "Flying Boards",
    kicker: "Florence Signature Collection",
    price: "$2,850",
    intro: "High-end carbon flying boards tuned for powerful surf, downwind speed, and athlete-level lift response.",
    tags: ["Signature carbon", "Downwind speed", "Athlete tuned", "Ultra stiff"],
    hero: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Board Volume", "48 L / 60 L / 74 L signature sizes"],
      ["Rocker", "Speed rocker with release tail"],
      ["Mount", "Precision dual track foil mount"],
      ["Construction", "High-modulus carbon with stringerless stiffness map"],
    ],
    included: [
      ["Deck", "Signature traction with low-profile kick"],
      ["Mounting", "Titanium-coated track hardware"],
      ["Travel", "Padded board bag and rail protection"],
    ],
    care: [
      ["Rinse", "Fresh water rinse and dry storage"],
      ["Compatible", "AeroLift Florence masts and high-aspect wings"],
      ["Service", "Replaceable track hardware and deck traction"],
    ],
  },
  "performance-wings": {
    name: "Performance Wings",
    kicker: "Matching Wings",
    price: "$820",
    intro: "High-aspect, surf, and glide wing sets for tuning range, speed, stability, and lift profile.",
    tags: ["High aspect", "Surf carve", "Glide tune", "Carbon layup"],
    hero: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Wing Range", "Surf, glide, and high-aspect front wings"],
      ["Span", "720 mm to 1120 mm options"],
      ["Mount", "AeroLift fuselage connection"],
      ["Construction", "Carbon fiber shell with tuned flex profile"],
    ],
    included: [
      ["Wing", "Selected front wing"],
      ["Hardware", "Mounting screw set"],
      ["Travel", "Padded wing cover"],
    ],
    care: [
      ["Rinse", "Rinse after saltwater use and dry before covering"],
      ["Compatible", "AeroLift masts, fuselages, eFoil and foil boards"],
      ["Service", "Replaceable hardware and protective covers"],
    ],
  },
  "batteries-chargers": {
    name: "Batteries & Chargers",
    kicker: "Power Upgrades",
    price: "$1,250",
    intro: "Travel-ready battery packs, rapid chargers, and waterproof cases for longer electric foil sessions.",
    tags: ["Rapid charge", "Sealed pack", "Travel case", "Range upgrade"],
    hero: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Battery", "1.8 kWh, 2.1 kWh, and 2.3 kWh packs"],
      ["Charge Time", "75 to 120 minutes by charger type"],
      ["Protection", "Marine sealed housing and connector covers"],
      ["Case", "Waterproof hard case with fitted interior"],
    ],
    included: [
      ["Power", "Selected battery or charger kit"],
      ["Protection", "Connector caps and gasket kit"],
      ["Travel", "Waterproof case option"],
    ],
    care: [
      ["Rinse", "Wipe exterior dry before charging"],
      ["Compatible", "AeroLift One, Flow, and Pro eFoil models"],
      ["Service", "Replaceable seals, caps, and charge cables"],
    ],
  },
  "masts-spares": {
    name: "Masts & Spares",
    kicker: "Replacement Spare Parts",
    price: "$390",
    intro: "Carbon masts, prop guards, board bags, screws, and replacement hardware kits for fast service.",
    tags: ["Carbon masts", "Prop guards", "Hardware kits", "Board bags"],
    hero: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&w=1600&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&w=900&q=82",
    ],
    specs: [
      ["Mast Range", "24 in, 28 in, and 32 in carbon masts"],
      ["Hardware", "Marine stainless screw and washer kits"],
      ["Protection", "Prop guards, mast covers, board bags"],
      ["Construction", "Carbon and corrosion-resistant marine hardware"],
    ],
    included: [
      ["Spares", "Selected mast, guard, cover, or screw kit"],
      ["Tools", "Hardware roll where applicable"],
      ["Travel", "Protective sleeves and bags by item"],
    ],
    care: [
      ["Rinse", "Rinse and dry threaded hardware after saltwater sessions"],
      ["Compatible", "AeroLift eFoil and foil systems"],
      ["Service", "Direct replacement parts for routine repairs"],
    ],
  },
};

const tableRows = (rows) => rows.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join("");

const productCategoryLinks = {
  "aerolift-one": "category-beginner-efoils.html",
  "aerolift-flow": "category-balanced-efoils.html",
  "aerolift-pro": "category-pro-efoils.html",
  "prone-foil-boards": "category-foil-boards.html",
  "wing-foil-boards": "category-foil-boards.html",
  "flying-boards": "category-florence-signature.html",
  "performance-wings": "category-matching-wings.html",
  "batteries-chargers": "category-power-upgrades.html",
  "masts-spares": "category-replacement-parts.html",
};

const productCategoryLabels = {
  "aerolift-one": "Beginner Entry eFoils",
  "aerolift-flow": "Mid-Range Balanced eFoils",
  "aerolift-pro": "Professional eFoils",
  "prone-foil-boards": "Foil Boards",
  "wing-foil-boards": "Foil Boards",
  "flying-boards": "Florence Signature",
  "performance-wings": "Matching Wings",
  "batteries-chargers": "Power Upgrades",
  "masts-spares": "Replacement Spare Parts",
};

const productSlug = document.body.dataset.product;
const product = products[productSlug] || products["aerolift-flow"];
const detailRoot = document.querySelector("[data-product-detail]");
const backHref = productCategoryLinks[productSlug] || "category-efoils.html";
const categoryLabel = productCategoryLabels[productSlug] || "Electric eFoils";

document.title = `${product.name} | AeroLift Foils`;

detailRoot.innerHTML = `
  <section class="section-pad product-detail-section">
    <div class="section-heading">
      <div>
        <p class="level-path">Home / ${categoryLabel} / ${product.name}</p>
        <p class="section-kicker">${product.kicker}</p>
        <h2>${product.name}</h2>
        <p class="product-intro-copy">${product.intro}</p>
      </div>
      <a class="button compact" href="${backHref}">Back to category</a>
    </div>

    <div class="detail-media">
      <video autoplay muted loop playsinline poster="${product.hero}">
        <source src="https://videos.pexels.com/video-files/5319759/5319759-uhd_2560_1440_25fps.mp4" type="video/mp4" />
      </video>
      <div class="gallery-stack">
        <img src="${product.gallery[0]}" alt="${product.name} lifestyle view" />
        <img src="${product.gallery[1]}" alt="${product.name} detail view" />
      </div>
    </div>

    <div class="detail-layout">
      <aside class="buy-panel">
        <p class="section-kicker">${product.kicker}</p>
        <h3>${product.price}</h3>
        <div class="feature-tags">
          ${product.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <a class="button primary full" href="category-accessories.html">Configure Setup</a>
      </aside>

      <div class="spec-panel">
        <details open>
          <summary>Technical Specifications</summary>
          <table><tbody>${tableRows(product.specs)}</tbody></table>
        </details>
        <details>
          <summary>Included Components</summary>
          <table><tbody>${tableRows(product.included)}</tbody></table>
        </details>
        <details>
          <summary>Care & Compatibility</summary>
          <table><tbody>${tableRows(product.care)}</tbody></table>
        </details>
      </div>
    </div>

    <div class="recommendations">
      <h3>Recommended Pairings</h3>
      <div class="mini-grid">
        <a href="product-performance-wings.html">High Aspect 170 Wing</a>
        <a href="product-batteries-chargers.html">Fast Charger Kit</a>
        <a href="product-masts-spares.html">Carbon 28 Mast</a>
        <a href="product-masts-spares.html">Waterproof Travel Case</a>
      </div>
    </div>
  </section>
`;

detailRoot.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    const parent = detail.parentElement;
    parent.querySelectorAll("details").forEach((sibling) => {
      if (sibling !== detail) sibling.removeAttribute("open");
    });
  });
});
