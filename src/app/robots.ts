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
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/"],
      },
    ],
    host: `https://${host}`,
    sitemap: `https://${host}/sitemap.xml`,
  };
}
