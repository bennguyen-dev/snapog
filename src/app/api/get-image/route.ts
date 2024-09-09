import { NextRequest, NextResponse } from "next/server";

import { cleanUrl, getUrlWithProtocol } from "@/lib/utils";
import { imageService } from "@/services/image";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const url = params.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL is required", status: 400, data: null },
      { status: 400 },
    );
  }

  const baseUrl = new URL(cleanUrl(getUrlWithProtocol(url)));
  baseUrl.search = ""; // Remove the query string

  const res = await imageService.getImageByUrl({
    url: baseUrl.toString(),
  });

  if (!res.data) {
    return NextResponse.json(res, { status: res.status });
  }

  return new Response(Buffer.from(res.data?.image), {
    headers: {
      "Content-Type": res.data?.contentType,
    },
  });
}
