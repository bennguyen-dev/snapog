import { NextResponse } from "next/server";
import { siteService } from "@/sevices/site";
import { auth } from "@/auth";
import { pageService } from "@/sevices/page";
import { getUrlWithProtocol } from "@/lib/utils";

export const POST = auth(async function POST(req) {
  const body = await req.json();
  const { domain } = body;

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
  });

  if (!site.data) {
    return NextResponse.json(site, { status: site.status });
  }

  // Create home page
  const urlHomepage = getUrlWithProtocol(site.data.domain);

  const page = await pageService.create({
    siteId: site.data.id,
    url: urlHomepage,
  });

  if (!page.data) {
    return NextResponse.json(page, { status: page.status });
  }

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

  const sites = await siteService.getAllBy({
    userId: req.auth.user.id,
  });
  return NextResponse.json(sites, { status: sites.status });
});
