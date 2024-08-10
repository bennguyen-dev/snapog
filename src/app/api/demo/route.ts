import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { getKeyPathsCache } from "@/lib/utils";
import { demoService, IGetDemo } from "@/sevices/demo";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const domain = body?.domain;

  if (!domain) {
    return NextResponse.json({
      message: "Domain is required",
      status: 400,
      data: null,
    });
  }

  // https://nextjs.org/docs/app/api-reference/functions/unstable_cache
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

  const demoRes = await getDemoCached({ domain });

  if (!demoRes.data) {
    return NextResponse.json(demoRes, { status: demoRes.status });
  }

  return NextResponse.json({
    message: "Success",
    status: 200,
    data: {
      domain,
    },
  });
}
