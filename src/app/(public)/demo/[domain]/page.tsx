import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import BlockCompareOGImage from "@/components/block/BlockCompareOGImage/BlockCompareOGImage";
import { demoService } from "@/services/demo";
import { getMetadata } from "@/utils/metadata";

const DynamicBlockHowItWorks = dynamic(
  () => import("@/components/block/BlockHowItWorks"),
);
const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);
const DynamicBlockFAQs = dynamic(() => import("@/components/block/BlockFAQs"));

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}) {
  const domain = params.domain;

  return getMetadata({
    title: `See How ${domain} Could Look With Automated OG Images`,
    description: `Preview how ${domain} could boost social media engagement with automated OG images. See the difference SnapOG makes in social sharing previews.`,
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
      <DynamicBlockHowItWorks />
      <DynamicBlockGetStartedNow />
      <DynamicBlockFAQs />
      <DynamicBlockGetStartedNow />
    </>
  );
}
