const header = document.querySelector(".site-header");

const renderSiteHeader = () => {
  if (!header) return;

  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="AeroLift home">
      <span class="logo-mark" aria-hidden="true"></span>
      <span>AeroLift</span>
    </a>
    <nav class="nav-links" aria-label="Product navigation">
      <div class="nav-item">
        <a href="category-efoils.html">eFoil</a>
        <div class="nav-dropdown mega-menu">
          <div class="mega-column">
            <span>Electric eFoils</span>
            <a href="category-efoils.html">All eFoils</a>
            <a href="category-beginner-efoils.html">Beginner Entry Model</a>
            <a href="category-balanced-efoils.html">Mid-Range Balanced Model</a>
            <a href="category-pro-efoils.html">High-Performance Professional Model</a>
          </div>
          <div class="mega-column">
            <span>Collections & Components</span>
            <a href="category-signature-collection.html">Athlete Signature Collections</a>
            <a href="category-matching-wings.html">Matching Wings</a>
            <a href="category-power-upgrades.html">Batteries & Chargers</a>
            <a href="category-replacement-parts.html">Replacement Spare Parts</a>
          </div>
          <a class="mega-feature" href="category-efoils.html">
            <strong>Shop by experience</strong>
            <small>Beginner, balanced, and pro electric foil setups organized for faster selection.</small>
          </a>
        </div>
      </div>
      <div class="nav-item">
        <a href="category-foils.html">Foils</a>
        <div class="nav-dropdown mega-menu compact-menu">
          <div class="mega-column">
            <span>Non-Electric Foils</span>
            <a href="category-foils.html">All Foils</a>
            <a href="category-foil-boards.html">Boards</a>
            <a href="category-masts.html">Masts</a>
            <a href="category-foil-wings.html">Wings</a>
            <a href="category-florence-signature.html">Florence Signature Collection</a>
          </div>
          <a class="mega-feature" href="category-florence-signature.html">
            <strong>Florence Signature</strong>
            <small>High-end carbon boards and foil components for powerful surf and downwind speed.</small>
          </a>
        </div>
      </div>
      <div class="nav-item">
        <a href="category-accessories.html">Accessories</a>
        <div class="nav-dropdown mega-menu compact-menu">
          <div class="mega-column">
            <span>Accessories & Upgrades</span>
            <a href="category-accessories.html">All Accessories</a>
            <a href="category-matching-wings.html">Performance Wings</a>
            <a href="category-power-upgrades.html">Batteries & Chargers</a>
            <a href="category-replacement-parts.html">Masts & Spares</a>
          </div>
          <a class="mega-feature" href="category-accessories.html">
            <strong>Keep the system modular</strong>
            <small>Upgrade wings, extend range, and replace service parts without changing platforms.</small>
          </a>
        </div>
      </div>
      <div class="nav-item">
        <a href="brand-story.html">Story</a>
      </div>
    </nav>
    <div class="nav-actions" aria-label="Store tools">
      <label class="search-pill" aria-label="Search products">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5"></circle>
          <path d="m16 16 4.5 4.5"></path>
        </svg>
        <input type="search" placeholder="Search" />
      </label>
      <a class="icon-link" href="account.html" aria-label="User account">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4"></circle>
          <path d="M4.5 21a7.5 7.5 0 0 1 15 0"></path>
        </svg>
      </a>
      <a class="icon-link" href="cart.html" aria-label="Shopping cart">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6h15l-1.8 8.2H8L6 3H3"></path>
          <circle cx="9" cy="20" r="1.4"></circle>
          <circle cx="18" cy="20" r="1.4"></circle>
        </svg>
      </a>
    </div>
  `;
};

renderSiteHeader();

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    const parent = detail.parentElement;
    parent.querySelectorAll("details").forEach((sibling) => {
      if (sibling !== detail) sibling.removeAttribute("open");
    });
  });
});
