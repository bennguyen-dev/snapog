import { NextResponse } from "next/server";
import cronJobService from "@/sevices/cronJob/cronJob.service";

export async function GET() {
  const result = await cronJobService.updateOGImage();
  return NextResponse.json(result, { status: result.status });
}
