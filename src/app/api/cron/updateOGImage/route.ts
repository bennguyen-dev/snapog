import { NextResponse } from "next/server";

import { cronService } from "@/sevices/cron";

export async function GET() {
  const result = await cronService.updateOGImage();
  return NextResponse.json(result, { status: result.status });
}
