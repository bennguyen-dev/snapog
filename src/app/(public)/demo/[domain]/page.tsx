import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { BlockCompareOGImage } from "@/components/block/BlockCompareOGImage/BlockCompareOGImage";
import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockHowItWorks } from "@/components/block/BlockHowItWorks";
import { demoService } from "@/services/demo";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}) {
  const headersList = headers();
  const host = headersList.get("host");
  const domain = params.domain;

  return getMetadata({
    title: `See How ${domain} Could Look With Automated OG Images`,
    description: `Preview how ${domain} could boost social media engagement with automated OG images. See the difference Snap OG makes in social sharing previews.`,
    host,
    path: `/demo/${domain}`,
    keywords: [
      `${domain} social preview`,
      "website preview generator",
      "social media optimization",
      "link preview demo",
    ],
  });
}

export default async function DemoDetailPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = params.domain;

  const demoRes = await demoService.getDemo({ url: domain });

  if (demoRes.status === 404) {
    return notFound();
  }

  return (
    <>
      {demoRes.data && (
        <BlockCompareOGImage pagesInfo={demoRes.data} domain={domain} />
      )}
      <BlockHowItWorks />
      <BlockGetStartedNow />
      <BlockFAQs />
      <BlockGetStartedNow />
    </>
  );
}
