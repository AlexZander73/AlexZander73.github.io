const detectSitePrefix = () => {
  const marker = "/products/";
  const pathname = window.location.pathname;
  const index = pathname.indexOf(marker);
  if (index < 0) return "";
  return pathname.slice(0, index);
};

const SITE_PREFIX = detectSitePrefix();

const prefixRootPath = (value) => {
  if (!value) return value;
  if (value.startsWith("/")) {
    return `${SITE_PREFIX}${value}`;
  }
  return value;
};

const normalizeUrl = (value, fallback) => {
  const url = value || fallback;
  if (!url) return "";
  if (/^(https?:)?\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("#")) {
    return url;
  }
  return prefixRootPath(url);
};

const CATALOG_URL = normalizeUrl("/products/catalog.json", "./catalog.json");

const fallbackProducts = [
  {
    slug: "carpentry-companion",
    title: "Carpentry Companion (AU)",
    blurb: "Offline-first carpentry study and planning app with calculators, job workflows, and export tools.",
    image: "/products/carpentry-companion/assets/screenshots/iphone/iphone-01.png",
    url: "/products/carpentry-companion/",
    support_url: "/products/carpentry-companion/support/",
    platforms: "iPhone, iPad, Mac"
  }
];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const loadProducts = async () => {
  try {
    const response = await fetch(`${CATALOG_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Catalog fetch failed");
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return fallbackProducts;
    return data;
  } catch {
    return fallbackProducts;
  }
};

const renderProducts = (products) => {
  const grid = document.getElementById("products-grid");
  const empty = document.getElementById("products-empty");
  if (!grid || !empty) return;

  if (!products.length) {
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  grid.innerHTML = products.map((product) => {
    const title = escapeHtml(product.title || product.slug || "Product");
    const blurb = escapeHtml(product.blurb || "Product details coming soon.");
    const image = normalizeUrl(product.image, "/assets/img/og-default.svg");
    const url = normalizeUrl(product.url, `/products/${product.slug}/`);
    const supportUrl = normalizeUrl(product.support_url, `${url}support/`);

    let platformsText = "";
    if (Array.isArray(product.platforms)) {
      platformsText = product.platforms.join(", ");
    } else if (typeof product.platforms === "string") {
      platformsText = product.platforms;
    }

    const platforms = platformsText ? `<p class="meta">${escapeHtml(platformsText)}</p>` : "";
    const supportButton = supportUrl ? `<a class="btn" href="${supportUrl}">Support</a>` : "";

    return `
      <article class="card">
        <img class="thumb" src="${image}" alt="${title} artwork" loading="lazy" />
        <div class="body">
          <h2>${title}</h2>
          <p>${blurb}</p>
          ${platforms}
          <div class="actions">
            <a class="btn btn-primary" href="${url}">View Product</a>
            ${supportButton}
          </div>
        </div>
      </article>
    `;
  }).join("");
};

const initProductsCatalog = async () => {
  const products = await loadProducts();
  renderProducts(products);
};

initProductsCatalog();
