import { NextRequest, NextResponse } from "next/server";

import { getUrlWithoutProtocol } from "@/lib/utils";
import { demoService } from "@/sevices/demo";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const domain = body?.domain;

  if (!domain) {
    return NextResponse.json({
      message: "Domain is required",
      status: 400,
      data: null,
    });
  }

  const res = await demoService.createDemo({
    domain: getUrlWithoutProtocol(domain),
  });

  return NextResponse.json(res, { status: res.status });
}
