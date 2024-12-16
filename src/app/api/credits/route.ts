import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { userBalanceService } from "@/services/userBalance";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const userBalance = await userBalanceService.getByUserId({
    userId: req.auth.user.id,
  });
  return NextResponse.json(userBalance, { status: userBalance.status });
});
