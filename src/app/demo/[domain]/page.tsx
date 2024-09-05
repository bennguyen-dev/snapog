import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import { BlockCompareOGImage } from "@/components/block/BlockCompareOGImage/BlockCompareOGImage";
import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockHowItWorks } from "@/components/block/BlockHowItWorks";
import { getKeyPathsCache } from "@/lib/utils";
import { demoService, IGetDemo, IGetDemoResponse } from "@/sevices/demo";

export default async function DemoDetailPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = params.domain;

  const getDemoCached = unstable_cache(
    async ({ domain }: IGetDemo) => {
      return await demoService.getDemo({ domain });
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

  const demoRes = await getDemoCached({ domain });

  if (demoRes.status === 404) {
    return notFound();
  }

  return (
    <>
      <BlockCompareOGImage
        pagesInfo={demoRes.data as IGetDemoResponse[]}
        domain={domain}
      />
      <BlockHowItWorks />
      <BlockGetStartedNow />
      <BlockFAQs />
      <BlockGetStartedNow />
    </>
  );
}
