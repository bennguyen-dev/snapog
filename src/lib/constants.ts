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

export const DURATION_CACHE = [
  { label: "1 day", value: 1 },
  { label: "2 days", value: 2 },
  { label: "3 day", value: 3 },
  { label: "4 day", value: 4 },
  { label: "5 day", value: 5 },
  { label: "6 day", value: 6 },
];

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
