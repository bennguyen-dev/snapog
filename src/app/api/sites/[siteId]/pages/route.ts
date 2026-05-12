import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pageService } from "@/services/page";

export const GET = auth(async function GET(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const siteId = res?.params?.siteId as string;

  if (!siteId) {
    return NextResponse.json({
      message: "Site ID is required",
      status: 400,
      data: null,
    });
  }

  const searchParams = req.nextUrl.searchParams;

  // Extract basic pagination parameters
  const cursor = searchParams.get("cursor") || undefined;
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || undefined;

  const pages = await pageService.getAllBy({
    siteId,
    cursor,
    pageSize,
    search,
  });

  return NextResponse.json(pages, { status: pages.status });
});
