import { Suspense } from "react";

import { unstable_cache } from "next/cache";

import { BlockCompareOGImageLoading } from "@/components/block/BlockCompareOGImage";
import { BlockCompareOGImage } from "@/components/block/BlockCompareOGImage/BlockCompareOGImage";
import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockHowItWorks } from "@/components/block/BlockHowItWorks";
import { getKeyPathsCache } from "@/lib/utils";
import { demoService, IGetDemo, IGetDemoResponse } from "@/sevices/demo";

async function BlockCompare({ domain }: { domain: string }) {
  const getDemoCached = unstable_cache(
    async ({ domain }: IGetDemo) => {
      return await demoService.getDemo({ domain, numberOfImages: 3 });
    },
    [
      getKeyPathsCache({
        functionName: "demoService.getDemo",
        value: { domain },
      }),
    ],
    {
      revalidate: 60 * 60, // revalidate at almost every hour
    },
  );

  const demoRes = await getDemoCached({ domain, numberOfImages: 3 });

  console.log("demoRes 😋", { demoRes }, "");

  return (
    <BlockCompareOGImage
      pagesInfo={demoRes.data as IGetDemoResponse[]}
      domain={domain}
    />
  );
}

export default async function DemoDetailPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = params.domain;

  return (
    <>
      <Suspense fallback={<BlockCompareOGImageLoading domain={domain} />}>
        <BlockCompare domain={domain} />
      </Suspense>
      <BlockHowItWorks />
      <BlockGetStartedNow />
      <BlockFAQs />
      <BlockGetStartedNow />
    </>
  );
}
