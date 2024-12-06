import { MetadataRoute } from "next";

import { headers } from "next/headers";

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = headersList.get("host");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about-us", "/demo", "/pricing", "/privacy", "/terms"],
        disallow: [
          "/dashboard/*",
          "/api/*",
          "/_next/*",
          "/*.json$",
          "/*.xml$",
          "/login",
          "/signup",
          "/reset-password",
        ],
        crawlDelay: 10,
      },
      {
        userAgent: "GPTBot",
        allow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
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
        allow: ["/*.xml", "/*.json"],
      },
      {
        userAgent: "Google-Mobile",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*", "/*.json$", "/*.xml$"],
      },
      {
        userAgent: "Google-News",
        allow: ["/"],
      },
      {
        userAgent: "Google-Ads",
        allow: ["/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*", "/*.json$", "/*.xml$"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*", "/*.json$", "/*.xml$"],
      },
    ],
    host: `https://${host}`,
    sitemap: `https://${host}/sitemap.xml`,
  };
}
