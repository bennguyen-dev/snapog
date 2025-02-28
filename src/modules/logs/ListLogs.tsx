"use client";

import * as React from "react";
import { useMemo, useState } from "react";

import { ColumnDef } from "@tanstack/table-core";
import { CircleCheckBig, CircleX, RefreshCw } from "lucide-react";
import { DateRange } from "react-day-picker";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useDebounce, useGetLogs } from "@/hooks";
import {
  IUserLog,
  IUserLogStatus,
  IUserLogType,
  MAPPING_USER_LOG_TYPE,
  USER_LOG_STATUS,
  USER_LOG_TYPE,
} from "@/services/userLog";
import { cn, formatDate } from "@/utils";

const STATUS_OPTIONS = [
  {
    label: "Success",
    value: USER_LOG_STATUS.SUCCESS,
    icon: <CircleCheckBig className="mr-2 h-4 w-4 text-success" />,
  },
  {
    label: "Error",
    value: USER_LOG_STATUS.ERROR,
    icon: <CircleX className="mr-2 h-4 w-4 text-destructive" />,
  },
];

const TYPE_OPTIONS = Object.keys(USER_LOG_TYPE).map((type) => ({
  label: MAPPING_USER_LOG_TYPE[type as IUserLogType],
  value: type as IUserLogType,
}));

const AMOUNT_OPTIONS = [
  {
    label: "Plus",
    value: "plus",
  },
  {
    label: "Minus",
    value: "minus",
  },
  {
    label: "Zero",
    value: "zero",
  },
];

const ListLogs = () => {
  const [search, setSearch] = useState<string>("");
  const [statuses, setStatuses] = useState<IUserLogStatus[]>([]);
  const [types, setTypes] = useState<IUserLogType[]>([]);
  const [amounts, setAmounts] = useState<string[]>([]);
  const [date, setDate] = useState<DateRange | undefined>();

  const debouncedSearchTerm = useDebounce(search, 500);

  const {
    data: logs,
    isLoading: fetching,
    isRefetching: refetching,
    refetch: getLogs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLogs({
    search: debouncedSearchTerm,
    filter: {
      statuses,
      types,
      amounts: amounts as ("plus" | "minus" | "zero")[],
      dateFrom: date?.from,
      dateTo: date?.to,
    },
  });

  const columns: ColumnDef<IUserLog>[] = useMemo(() => {
    return [
      {
        accessorKey: "status",
        header: "Status",
        headerClassName: "text-center",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex justify-center">
              {status === USER_LOG_STATUS.SUCCESS ? (
                <CircleCheckBig className="size-4 text-success" />
              ) : (
                <CircleX className="size-4 text-destructive" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
          const type = row.original.type;
          return (
            <Typography affects="muted" className="capitalize">
              {MAPPING_USER_LOG_TYPE[type as keyof typeof USER_LOG_TYPE]}
            </Typography>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Credits",
        cell: ({ row }) => {
          const amount = row.original.amount;
          return (
            <Typography
              affects="muted"
              className={cn("text-end font-bold", {
                "text-success": amount > 0,
                "text-destructive": amount < 0,
                "text-muted-foreground": amount === 0,
              })}
            >
              {amount > 0 ? "+" : ""}
              {amount}
            </Typography>
          );
        },
      },

      {
        accessorKey: "metadata",
        header: "Details",
        cell: ({ row }) => {
          const log = row.original;
          const metadata = log.metadata as Record<string, any>;
          const error = metadata?.error as Record<string, any>;
          const details = [];

          // Show error details if status is error
          if (log.status === USER_LOG_STATUS.ERROR && error) {
            details.push(`Error: ${error.message}`);
            if (error.details) {
              Object.entries(error.details).forEach(([key, value]) => {
                details.push(`${key}: ${value}`);
              });
            }
          }

          // Show normal metadata
          if (metadata.pageUrl) {
            details.push(`URL: ${metadata.pageUrl}`);
          }
          if (metadata.orderId) {
            details.push(`Order: #${metadata.orderId}`);
          }
          if (metadata.productName) {
            details.push(`Product: ${metadata.productName}`);
          }
          if (metadata.userAgent) {
            details.push(`User Agent: ${metadata.userAgent}`);
          }

          return (
            <Typography
              affects="muted"
              className="w-2xl min-w-96 whitespace-pre-wrap"
            >
              {details.join("\n")}
            </Typography>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          return (
            <Typography className="min-w-40" affects="muted">
              {formatDate(row.original.createdAt)}
            </Typography>
          );
        },
      },
    ];
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="left-0 top-0 flex items-center max-md:mb-4 md:absolute md:h-16 md:px-16">
        <div className="h-4 border-l border-l-border px-2 max-md:hidden" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Logs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription className="max-sm:hidden">
            View your credit usage history and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
            <Input
              id="search"
              placeholder="Enter url, user agent, product name or error to search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-full sm:max-w-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getLogs();
                }
              }}
            />
            <DataTableFacetedFilter
              title="Status"
              value={statuses}
              onChange={setStatuses}
              options={STATUS_OPTIONS}
            />
            <DataTableFacetedFilter
              title="Type"
              value={types}
              onChange={setTypes}
              options={TYPE_OPTIONS}
            />
            <DataTableFacetedFilter
              title="Amount"
              value={amounts}
              onChange={setAmounts}
              options={AMOUNT_OPTIONS}
            />
            <DatePicker
              placeholder="Created At"
              mode="range"
              initialDateRange={date}
              onDateRangeChange={setDate}
              presetDays={[-90, -30, -14, -7, 1]}
            />
            <Button
              variant="outline"
              onClick={() => getLogs()}
              icon={<RefreshCw className="icon" />}
              loading={fetching}
            >
              <span className="max-sm:hidden">Refresh</span>
            </Button>
          </div>
          <DataTable
            columns={columns}
            data={
              logs?.pages?.flatMap((page: { data: IUserLog[] }) => page.data) ||
              []
            }
            loading={fetching || refetching}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ListLogs;
