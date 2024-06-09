export const ROUTES = [
  {
    name: "Dashboard",
    path: "/dashboard",
    auth: true,
  },
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

export const SNIPPET_HOW_TO_USE = `
  <!-- Put in your <head> tag -->
  <meta
    property="og:image"
    content="https://image.social/get?url=your.rentals/your/example/path"
  />`;

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
