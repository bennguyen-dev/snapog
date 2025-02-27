import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { userLogService } from "@/services/userLog";
import { IFilterParams } from "@/types/global";

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

  // Extract and validate date filters
  const amounts = filter?.amounts;
  const types = filter?.types;
  const statuses = filter?.statuses;
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

  // Get credit logs for the user's balance with filters
  const logsRes = await userLogService.getLogs({
    userId: req.auth.user.id,
    cursor,
    pageSize,
    search,
    filter: {
      amounts,
      types,
      statuses,
      dateFrom: parsedDateFrom,
      dateTo: parsedDateTo,
    },
  });

  return NextResponse.json(logsRes, { status: logsRes.status });
});
