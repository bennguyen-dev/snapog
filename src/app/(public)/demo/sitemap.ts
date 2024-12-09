import { headers } from "next/headers";

import { demoService } from "@/services/demo";

export default async function sitemap() {
  const headersList = headers();
  const host = headersList.get("host")?.replace("www.", "");
  const baseUrl = `https://${host}`;

  const demos = await demoService.getAllDemos();

  // Generate demo pages
  return (
    demos.data?.map((demo) => ({
      url: `${baseUrl}/demo/${demo.domain}`,
      lastModified: demo.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || []
  );
}
