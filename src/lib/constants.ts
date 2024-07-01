export const ROUTES = [
  {
    name: "Site",
    path: "/sites",
    auth: true,
  },
  {
    name: "Demo",
    path: "/demo",
    auth: false,
  },
  {
    name: "Pricing",
    path: "/pricing",
    auth: false,
  },
];

export const DURATION_CACHES = Array(30)
  .fill(null)
  .map((_, i) => ({ value: `${i + 1}`, label: `${i + 1} days` }));

export const IMAGE_TYPES = Object.freeze({
  PNG: {
    MIME: "image/png",
    EXTENSION: "png",
  },
  JPEG: {
    MIME: "image/jpeg",
    EXTENSION: "jpg",
  },
});

export const PRIORITY_PAGES = [
  "about",
  "contact",
  "services",
  "products",
  "blog",
  "faq",
  "sitemap",
  "privacy",
  "terms",
  "refund",
  "payment",
  "shipping",
  "pricing",
  "checkout",
  "business",
  "investor",
  "newsroom",
];

export const CACHE_DURATION_DAYS = 30;
