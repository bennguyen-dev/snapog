import { NextRequest, NextResponse } from "next/server";

import { cleanUrl, getUrlWithProtocol } from "@/lib/utils";
import { imageService } from "@/services/image";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const url = params.get("url");
  const apiKey = params.get("api_key");

  if (!url || !apiKey) {
    return NextResponse.json(
      { error: "url or apiKey is required", status: 400, data: null },
      { status: 400 },
    );
  }

  const urlClean = cleanUrl(getUrlWithProtocol(url));

  const res = await imageService.generateOGImage({
    url: urlClean,
    apiKey,
  });

  if (!res.data) {
    return NextResponse.json(res, { status: res.status });
  }

  return new Response(Buffer.from(res.data?.image), {
    status: 200,
    headers: {
      "Content-Type": res.data?.contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    },
  });
}
