import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUrlWithoutProtocol, getUrlWithProtocol } from "@/lib/utils";
import { pageService } from "@/sevices/page";
import { siteService } from "@/sevices/site";
import { imageService } from "@/sevices/image";

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

  const res = await imageService.getImageByUrl({ url });

  if (!res.data) {
    return NextResponse.json(res, { status: res.status });
  }

  return new Response(res.data?.image, {
    headers: {
      "Content-Type": res.data?.contentType,
    },
  });
}
