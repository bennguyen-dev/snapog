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

  const pages = await pageService.getAllBy({ siteId });

  if (!pages.data || pages.data.length === 0) {
    return NextResponse.json(pages, { status: pages.status });
  }

  return NextResponse.json(pages, { status: pages.status });
});
