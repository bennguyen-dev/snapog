import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { userService } from "@/services/user";

export const POST = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const apiKeys = await userService.regenerateApiKey({
    userId: req.auth.user.id,
  });
  return NextResponse.json(apiKeys, { status: apiKeys.status });
});
