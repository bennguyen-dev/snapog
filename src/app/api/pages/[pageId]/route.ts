import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pageService } from "@/sevices/page";

export const GET = auth(async function GET(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const pageId = res?.params?.pageId as string;

  if (!pageId) {
    return NextResponse.json({
      message: "Page ID is required",
      status: 400,
      data: null,
    });
  }

  const page = await pageService.getBy({
    id: pageId,
  });
  return NextResponse.json(page, { status: page.status });
});

export const PUT = auth(async function PUT(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const pageId = res?.params?.pageId as string;
  const body = await req.json();

  const pages = await pageService.updateManyBy({
    id: pageId,
    ...body,
  });

  return NextResponse.json(pages, { status: pages.status });
});

export const DELETE = auth(async function DELETE(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const pageId = res?.params?.pageId as string;

  if (!pageId) {
    return NextResponse.json({
      message: "Page ID is required",
      status: 400,
      data: null,
    });
  }

  const pages = await pageService.deleteManyBy({
    id: pageId,
  });
  return NextResponse.json(pages, { status: pages.status });
});
