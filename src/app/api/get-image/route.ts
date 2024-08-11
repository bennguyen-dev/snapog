import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { getKeyPathsCache, getUrlWithProtocol } from "@/lib/utils";
import { imageService } from "@/sevices/image";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const url = params.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL is required", status: 400, data: null },
      { status: 400 },
    );
  }

  const baseUrl = new URL(getUrlWithProtocol(url));
  baseUrl.search = ""; // Remove the query string

  const getImageCached = unstable_cache(
    async ({ url }: { url: string }) => {
      return await imageService.getImageByUrl({ url });
    },
    [
      getKeyPathsCache({
        functionName: "imageService.getImageByUrl",
        value: { url: getUrlWithProtocol(baseUrl.toString()) },
      }),
    ],
    {
      revalidate: 60 * 60, // revalidate at almost every hour
    },
  );

  const res = await getImageCached({ url: baseUrl.toString() });

  if (!res.data) {
    return NextResponse.json(res, { status: res.status });
  }

  return new Response(Buffer.from(res.data?.image), {
    headers: {
      "Content-Type": res.data?.contentType,
    },
  });
}
