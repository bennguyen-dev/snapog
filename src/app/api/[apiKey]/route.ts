import { NextRequest, NextResponse } from "next/server";

import { imageService } from "@/services/image";
import { cleanUrl, getCdnImageUrl, getUrlWithProtocol } from "@/utils";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { apiKey: string } },
) {
  try {
    const { apiKey } = params;
    const url = req.nextUrl.searchParams.get("url");

    if (!url || !apiKey) {
      return NextResponse.json(
        { error: "url or apiKey is required" },
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
        },
      );
    }

    const urlClean = cleanUrl(getUrlWithProtocol(url));
    const res = await imageService.generateOGImage({
      url: urlClean,
      apiKey,
      headers: {
        "user-agent": req.headers.get("user-agent") || undefined,
        "x-forwarded-for": req.headers.get("x-forwarded-for") || undefined,
        "x-real-ip": req.headers.get("x-real-ip") || undefined,
      },
    });

    if (!res.data?.imageSrc) {
      return NextResponse.json(res, {
        status: res.status,
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      });
    }

    const cdnUrl = getCdnImageUrl(res.data.imageSrc);

    return NextResponse.redirect(cdnUrl, {
      status: 302,
      headers: {
        ...CORS_HEADERS,
        "Cache-Control":
          "public, max-age=300, s-maxage=86400, stale-while-revalidate=86400",
        "CDN-Cache-Control": "public, max-age=86400",
        "Vercel-CDN-Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", timestamp: new Date().toISOString() },
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Cache-Control": "no-store" },
      },
    );
  }
}
