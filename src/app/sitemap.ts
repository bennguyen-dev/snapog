import { demoService } from "@/services/demo";

const LAST_MODIFIED = new Date();

// Define page priorities and update frequencies
const PAGES = {
  core: [
    { path: "", priority: 1.0, changeFreq: "weekly" as const },
    { path: "/demo", priority: 0.9, changeFreq: "daily" as const },
    { path: "/pricing", priority: 0.9, changeFreq: "weekly" as const },
    { path: "/about-us", priority: 0.8, changeFreq: "monthly" as const },
    { path: "/signin", priority: 0.8, changeFreq: "monthly" as const },
  ],
  legal: [
    { path: "/privacy", priority: 0.5, changeFreq: "monthly" as const },
    { path: "/terms", priority: 0.5, changeFreq: "monthly" as const },
    { path: "/faqs", priority: 0.5, changeFreq: "monthly" as const },
    { path: "/docs", priority: 0.5, changeFreq: "monthly" as const },
  ],
};

export default async function sitemap() {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  const demos = await demoService.getAllDemos();

  // Generate core pages
  const corePages = PAGES.core.map((page) => ({
    url: `https://${domain}${page.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  // Generate legal pages
  const legalPages = PAGES.legal.map((page) => ({
    url: `https://${domain}${page.path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  // Generate demo pages
  const demoPages =
    demos.data?.map((demo) => ({
      url: `https://${domain}/demo/${demo.domain}`,
      lastModified: demo.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || [];

  return [...corePages, ...legalPages, ...demoPages];
}
