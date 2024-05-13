import { NextRequest, NextResponse } from "next/server";
import { getImageByUrl } from "@/sevices/get-image-by-url";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  let url = params.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = `https://${url}`;
  }

  const image = await getImageByUrl({ url });

  return new Response(image, {
    headers: { "content-type": "image/png" },
  });
}
