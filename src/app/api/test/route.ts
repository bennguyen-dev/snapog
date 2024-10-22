import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { puppeteerService } from "@/services/puppeteer";

export const GET = auth(async function GET(req) {
  // get url from params
  const url = req.nextUrl.searchParams.get("url") as string;

  const info = await puppeteerService.getInfo({
    url,
  });
  return NextResponse.json(info, { status: info.status });
});
