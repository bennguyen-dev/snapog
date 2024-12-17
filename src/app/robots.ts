import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/dashboard/*"],
      },
    ],
    sitemap: `https://${domain}/sitemap.xml`,
  };
}
