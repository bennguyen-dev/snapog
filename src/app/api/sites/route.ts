import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { inngest } from "@/lib/inngest";
import { getUrlWithoutProtocol, getUrlWithProtocol } from "@/lib/utils";
import { pageService } from "@/services/page";
import { siteService } from "@/services/site";

export const POST = auth(async function POST(req) {
  const body = await req.json();

  const domain = getUrlWithoutProtocol(body?.domain);

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
  });

  if (!page.data) {
    await siteService.deleteManyBy({
      id: site.data.id,
    });

    return NextResponse.json(page, { status: page.status });
  }

  // send event to inngest
  await inngest.send({
    name: "background/create.site",
    data: { siteId: site.data.id, cacheDurationDays },
  });

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
