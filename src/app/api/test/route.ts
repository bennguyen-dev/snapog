import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { crawlService } from "@/sevices/crawl";

export const POST = auth(async function POST(req) {
  const body = await req.json();

  const domain = body?.domain;
  const limit = body?.limit;

  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  if (!domain) {
    return NextResponse.json({
      message: "Domain is required",
      status: 400,
      data: null,
    });
  }

  const links = await crawlService.searchSiteLinks({ domain, limit });
  return NextResponse.json(links, { status: links.status });
});
