import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { statsService } from "@/services/stats";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const stats = await statsService.getStats({ userId: req.auth.user.id });

  return NextResponse.json(stats, { status: stats.status });
});
