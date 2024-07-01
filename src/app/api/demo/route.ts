import { NextRequest, NextResponse } from "next/server";

import { demoService } from "@/sevices/demo";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const domain = params.get("domain");

  if (!domain) {
    return NextResponse.json({
      message: "Domain is required",
      status: 400,
      data: null,
    });
  }

  const result = await demoService.getDemo({
    domain: domain,
    numberOfImages: 3,
  });

  return NextResponse.json(result);
}
