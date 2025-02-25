import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { userLogService } from "@/services/userLog";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
  const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") || "10");

  // Get credit logs for the user's balance
  const logsRes = await userLogService.getLogs({
    userId: req.auth.user.id,
    cursor,
    pageSize,
  });

  return NextResponse.json(logsRes, { status: logsRes.status });
});
