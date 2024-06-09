import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { pageService } from "@/sevices/page";

export const DELETE = auth(async function DELETE(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const siteId = res?.params?.siteId as string;
  const pageId = res?.params?.pageId as string;

  if (!siteId) {
    return NextResponse.json({
      message: "Site ID is required",
      status: 400,
      data: null,
    });
  }

  if (!pageId) {
    return NextResponse.json({
      message: "Page ID is required",
      status: 400,
      data: null,
    });
  }

  const pages = await pageService.deleteManyBy({
    siteId,
    id: pageId,
  });
  return NextResponse.json(pages, { status: pages.status });
});
