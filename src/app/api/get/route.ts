import { NextRequest, NextResponse } from "next/server";

import { cleanUrl, getUrlWithProtocol } from "@/lib/utils";
import { imageService } from "@/services/image";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const url = params.get("url");
    const apiKey = params.get("api_key");

    // Add logging
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const referer = req.headers.get("referer") || "Unknown";
    console.log(`Request from:`, {
      userAgent,
      referer,
      url,
      timestamp: new Date().toISOString(),
    });

    if (!url || !apiKey) {
      return NextResponse.json(
        { error: "url or apiKey is required" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const urlClean = cleanUrl(getUrlWithProtocol(url));
    const res = await imageService.generateOGImage({
      url: urlClean,
      apiKey,
    });

    if (!res.data) {
      return NextResponse.json(res, {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      });
    }

    // Validate image buffer
    if (!res.data.image || res.data.image.length === 0) {
      return NextResponse.json(
        { error: "Invalid image data" },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return new Response(Buffer.from(res.data.image), {
      status: 200,
      headers: {
        "Accept-Ranges": "bytes",
        // Essential image headers
        "Content-Type": res.data.contentType,
        "Content-Length": res.data.image.length.toString(),

        // Cache control - reduced for Vercel
        "Cache-Control":
          "public, max-age=300, s-maxage=300, stale-while-revalidate=60", // 5 minutes cache, 1 minute stale

        // Security headers
        "X-Content-Type-Options": "nosniff",

        // CORS headers
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Expose-Headers": "Content-Length, Content-Type",

        // Additional headers for better compatibility
        "Content-Disposition": "inline",
        Vary: "Accept, User-Agent",

        // Service identification
        "X-Powered-By": "SnapOG Image Service",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
