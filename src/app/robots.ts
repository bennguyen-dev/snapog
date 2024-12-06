import { MetadataRoute } from "next";

import { headers } from "next/headers";

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = headersList.get("host");

  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
        crawlDelay: 10,
      },
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "Google-Image",
        allow: [
          "/*.ip",
          "/*.jpg",
          "/*.jpeg",
          "/*.png",
          "/*.gif",
          "/*.bmp",
          "/*.tiff",
          "/*.webp",
        ],
      },
      {
        userAgent: "Google-Feed",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "Google-Mobile",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "Google-News",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "Google-Ads",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
      },
    ],
    host: `https://${host}`,
    sitemap: `https://${host}/sitemap.xml`,
  };
}
