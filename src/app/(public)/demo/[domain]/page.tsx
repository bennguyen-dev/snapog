import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import BlockCompareOGImage from "@/components/block/BlockCompareOGImage/BlockCompareOGImage";
import { demoService } from "@/services/demo";
import { generateSchema, getMetadata } from "@/utils/metadata";

const DynamicBlockHowItWorks = dynamic(
  () => import("@/components/block/BlockHowItWorks"),
);
const DynamicBlockCTA = dynamic(() => import("@/components/block/BlockCTA"));
const DynamicBlockFAQs = dynamic(() => import("@/components/block/BlockFAQs"));
const DynamicBlockTryYourDemo = dynamic(
  () => import("@/components/block/BlockTryYourDemo"),
);

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
      `${domain} og image`,
      "website preview",
      "social media optimization",
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

  if (!demoRes.data || demoRes.status === 404) {
    return notFound();
  }

  const schema = generateSchema({
    type: "WebPage",
    title: `See How ${domain} Could Look With Automated OG Images`,
    description: `Preview how ${domain} could boost social media engagement with automated OG images. See the difference SnapOG makes in social sharing previews.`,
    path: `/demo/${domain}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <BlockCompareOGImage pagesInfo={demoRes.data} domain={domain} />
      <DynamicBlockHowItWorks />
      <DynamicBlockTryYourDemo />
      <DynamicBlockFAQs />
      <DynamicBlockCTA />
    </>
  );
}
