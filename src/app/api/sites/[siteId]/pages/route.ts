import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { pageService } from "@/services/page";
import { IFilterParams } from "@/types/global";

export const GET = auth(async function GET(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const siteId = res?.params?.siteId as string;

  if (!siteId) {
    return NextResponse.json({
      message: "Site ID is required",
      status: 400,
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

  const pages = await pageService.getAllBy({
    siteId,
    cursor,
    pageSize,
    search,
    filter: {
      dateFrom: parsedDateFrom,
      dateTo: parsedDateTo,
    },
  });

  return NextResponse.json(pages, { status: pages.status });
});
