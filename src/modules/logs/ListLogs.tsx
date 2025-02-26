"use client";

import { useMemo, useState } from "react";

import { LOG_STATUS, UserLog } from "@prisma/client";
import { ColumnDef } from "@tanstack/table-core";
import { CircleCheckBig, CircleX, RefreshCw } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useDebounce, useGetLogs } from "@/hooks";
import { IUserLog } from "@/services/userLog";
import { cn, formatDate } from "@/utils";

const ListLogs = () => {
  const [search, setSearch] = useState<string>("");

  const debouncedSearchTerm = useDebounce(search, 500);

  const {
    data: logs,
    isLoading: fetching,
    isRefetching: refetching,
    refetch: getLogs,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLogs({ search: debouncedSearchTerm });

  const columns: ColumnDef<UserLog>[] = useMemo(() => {
    return [
      {
        accessorKey: "status",
        header: "Status",
        headerClassName: "text-center",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex justify-center">
              {status === LOG_STATUS.SUCCESS ? (
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
              {type}
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
          if (log.status === LOG_STATUS.ERROR && error) {
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
        header: "Date",
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
          <div className="mb-4 flex items-center justify-between gap-2 sm:gap-4">
            <Input
              id="search"
              placeholder="Enter url, user agent, product name or error to search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="max-w-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getLogs();
                }
              }}
            />
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => getLogs()}
                icon={<RefreshCw className="icon" />}
                loading={fetching}
              >
                <span className="max-sm:hidden">Refresh</span>
              </Button>
            </div>
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
