"use client";

import { useMemo } from "react";

import { LOG_STATUS, UserLog } from "@prisma/client";
import { ColumnDef } from "@tanstack/table-core";
import { CircleCheckBig, CircleX, RefreshCw } from "lucide-react";

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
import { Typography } from "@/components/ui/typography";
import { useGetLogs } from "@/hooks";
import { cn, formatDate } from "@/utils";

const ListLogs = () => {
  const { data: logs, isFetching: fetching, refetch: getLogs } = useGetLogs();

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
              className={cn("text-center font-bold", {
                "text-success": amount > 0,
                "text-destructive": amount < 0,
                "text-muted": amount === 0,
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
              className="max-w-2xl whitespace-pre-wrap"
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
            <Typography affects="muted">
              {formatDate(row.original.createdAt)}
            </Typography>
          );
        },
      },
    ];
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/sites">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Logs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>
            View your credit usage history and transactions
          </CardDescription>
          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => getLogs()}
              icon={<RefreshCw className="icon" />}
              loading={fetching}
            >
              <span className="max-sm:hidden">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={logs?.data || []}
            loading={fetching}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ListLogs;
