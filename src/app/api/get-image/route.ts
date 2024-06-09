import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { imageService } from "@/sevices/image";
import { getUrlWithProtocol } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  let url = params.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL is required", status: 400, data: null },
      { status: 400 },
    );
  }

  const urlClean = new URL(getUrlWithProtocol(url));
  urlClean.search = ""; // Remove the query string

  const res = await imageService.getImageByUrl({ url: urlClean.toString() });

  if (!res.data) {
    return NextResponse.json(res, { status: res.status });
  }

  return new Response(res.data?.image, {
    headers: {
      "Content-Type": res.data?.contentType,
    },
  });
}
