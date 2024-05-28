import { demoService } from "@/sevices/demo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  let domain = params.get("domain");
  let numberOfImages = params.get("numberOfImages");

  if (!domain) {
    return NextResponse.json({
      message: "Domain is required",
      status: 400,
      data: null,
    });
  }

  const result = await demoService.getDemo({
    domain: domain,
    numberOfImages: numberOfImages ? parseInt(numberOfImages, 10) : 4,
  });

  return NextResponse.json(result);
}
