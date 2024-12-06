import { MetadataRoute } from "next";

import { headers } from "next/headers";

export default function robots(): MetadataRoute.Robots {
  const headersList = headers();
  const host = headersList.get("host");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/dashboard/*", "/api/*", "/_next/*"],
        crawlDelay: 10,
      },
    ],
    host: `https://${host}`,
    sitemap: `https://${host}/sitemap.xml`,
  };
}
