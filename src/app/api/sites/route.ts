import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pageService } from "@/services/page";
import { siteService } from "@/services/site";
import { getDomainName, getUrlWithProtocol } from "@/utils";

export const POST = auth(async function POST(req) {
  const body = await req.json();

  const domain = getDomainName(body?.domain);

  const cacheDurationDays = body?.cacheDurationDays;

  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  if (!domain) {
    return NextResponse.json({
      message: "Domain is required",
      status: 400,
      data: null,
    });
  }

  const site = await siteService.create({
    userId: req.auth.user.id,
    domain,
    cacheDurationDays,
  });

  if (!site.data) {
    return NextResponse.json(site, { status: site.status });
  }

  // Create home page
  const urlHomepage = getUrlWithProtocol(site.data.domain);

  const page = await pageService.create({
    siteId: site.data.id,
    url: urlHomepage,
    headers: {
      "user-agent": req.headers.get("user-agent") || undefined,
      "x-forwarded-for": req.headers.get("x-forwarded-for") || undefined,
      "x-real-ip": req.headers.get("x-real-ip") || undefined,
    },
  });

  if (!page.data) {
    await siteService.deleteManyBy({
      id: site.data.id,
    });

    return NextResponse.json(page, { status: page.status });
  }

  // send event to inngest
  // await inngest.send({
  //   name: "background/create.site",
  //   data: { siteId: site.data.id, cacheDurationDays },
  // });

  const res = {
    status: site.status,
    data: {
      ...site.data,
      page: page.data,
    },
    message: site.message,
  };

  return NextResponse.json(res, { status: site.status });
});

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
  const search = req.nextUrl.searchParams.get("search") || undefined;

  const result = await siteService.getAllBy({
    userId: req.auth.user.id,
    cursor,
    pageSize,
    search,
  });

  return NextResponse.json(result, { status: result.status });
});
