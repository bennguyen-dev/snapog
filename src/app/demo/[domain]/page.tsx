import { notFound } from "next/navigation";

import { BlockCompareOGImage } from "@/components/block/BlockCompareOGImage/BlockCompareOGImage";
import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockHowItWorks } from "@/components/block/BlockHowItWorks";
import { demoService } from "@/services/demo";

export default async function DemoDetailPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = params.domain;

  const demoRes = await demoService.getDemo({ domain });

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
