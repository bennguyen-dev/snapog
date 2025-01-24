import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pageService } from "@/services/page";

export const POST = auth(async function POST(req, res) {
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

  // Get headers for logging
  const headers = {
    "user-agent": req.headers.get("user-agent") || undefined,
    "x-forwarded-for": req.headers.get("x-forwarded-for") || undefined,
    "x-real-ip": req.headers.get("x-real-ip") || undefined,
  };

  const result = await pageService.regenerate({
    id: pageId,
    userId: req.auth.user.id,
    headers,
  });

  return NextResponse.json(result, { status: result.status });
});
