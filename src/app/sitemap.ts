import { MetadataRoute } from "next";

import { headers } from "next/headers";

const LAST_MODIFIED = new Date();

// Define page priorities and update frequencies
const PAGES = {
  core: [
    { path: "", priority: 1.0, changeFreq: "weekly" as const },
    { path: "/demo", priority: 0.9, changeFreq: "daily" as const },
    { path: "/pricing", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/about-us", priority: 0.8, changeFreq: "monthly" as const },
  ],
  legal: [
    { path: "/privacy", priority: 0.5, changeFreq: "monthly" as const },
    { path: "/terms", priority: 0.5, changeFreq: "monthly" as const },
  ],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const headersList = headers();
  const host = headersList.get("host");
  const baseUrl = `https://${host}`;

  // Generate core pages
  const corePages = PAGES.core.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  // Generate legal pages
  const legalPages = PAGES.legal.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  return [...corePages, ...legalPages];
}
