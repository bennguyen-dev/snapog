import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pageService } from "@/services/page";
import { siteService } from "@/services/site";
import { IFilterParams } from "@/types/global";
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

  const searchParams = req.nextUrl.searchParams;

  // Extract basic pagination parameters
  const cursor = searchParams.get("cursor") || undefined;
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || undefined;

  // Extract filter parameters from the filter query parameter
  const filterParam = searchParams.get("filter");
  let filter: IFilterParams["filter"] = {};

  if (filterParam) {
    try {
      filter = JSON.parse(filterParam);
    } catch (error) {
      console.error("Error parsing filter parameter:", error);
    }
  }

  const dateFrom = filter?.dateFrom;
  const dateTo = filter?.dateTo;

  let parsedDateFrom: Date | undefined = undefined;
  let parsedDateTo: Date | undefined = undefined;

  if (dateFrom) {
    const date = new Date(dateFrom);
    if (!isNaN(date.getTime())) {
      parsedDateFrom = date;
    }
  }

  if (dateTo) {
    const date = new Date(dateTo);
    if (!isNaN(date.getTime())) {
      parsedDateTo = date;
    }
  }

  const result = await siteService.getAllBy({
    userId: req.auth.user.id,
    cursor,
    pageSize,
    search,
    filter: {
      dateFrom: parsedDateFrom,
      dateTo: parsedDateTo,
    },
  });

  return NextResponse.json(result, { status: result.status });
});
