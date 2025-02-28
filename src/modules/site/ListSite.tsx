"use client";

import { useMemo, useRef, useState } from "react";
import * as React from "react";

import { Site } from "@prisma/client";
import { ColumnDef } from "@tanstack/table-core";
import { Pencil, Plus, RefreshCw, TrashIcon } from "lucide-react";
import { useSession } from "next-auth/react";
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
import { CodeBlock } from "@/components/ui/code-block";
import { DataTable } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import {
  useConfirmDialog,
  useDebounce,
  useDeleteSiteById,
  useGetSites,
} from "@/hooks";
import {
  AddSiteDialog,
  EditSiteDialog,
  IAddSiteDialogRef,
  IEditSiteDialogRef,
} from "@/modules/site";
import { formatDate, getLinkSmartOGImage, getSnippetHowToUse } from "@/utils";

const ListSite = () => {
  const { confirmDialog, onCloseConfirm, ConfirmDialog } = useConfirmDialog();
  const { data: session } = useSession();

  const addSiteRef = useRef<IAddSiteDialogRef>(null);
  const editSiteRef = useRef<IEditSiteDialogRef>(null);

  const [search, setSearch] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>();

  const debouncedSearchTerm = useDebounce(search, 500);

  const {
    data: sites,
    isLoading: fetching,
    isRefetching: refetching,
    refetch: getSites,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSites({
    search: debouncedSearchTerm,
    filter: { dateFrom: date?.from, dateTo: date?.to },
  });
  const { mutate: deleteSite, isPending: deleting } = useDeleteSiteById();

  const columns: ColumnDef<Site>[] = useMemo(() => {
    return [
      {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => {
          return <Typography affects="small">{row.index + 1}</Typography>;
        },
      },
      {
        accessorKey: "domain",
        header: "Domain",
        cell: ({ row }) => {
          return (
            <Link
              href={`/dashboard/sites/${row.original.id}`}
              className="text-link"
            >
              {row.original.domain}
            </Link>
          );
        },
      },
      {
        header: "How to use?",
        cell: ({ row }) => {
          const site = row.original;
          const urlExample = getLinkSmartOGImage({
            host: window.location.host,
            url: site.domain,
            apiKey: session?.user.apiKey,
          });

          return (
            <div className="max-w-2xl">
              <Typography affects="small" className="mb-4">
                Example URL:{" "}
                <Link
                  href={urlExample}
                  target="_blank"
                  className="text-link break-all"
                >
                  {urlExample}
                </Link>
              </Typography>
              <CodeBlock
                language="html"
                filename="index.html"
                code={getSnippetHowToUse({
                  host: window.location.host,
                  domain: site.domain,
                  apiKey: session?.user?.apiKey,
                })}
              />
            </div>
          );
        },
      },
      {
        accessorKey: "cacheDurationDays",
        header: "Cache duration (days)",
        cell: ({ row }) => {
          return (
            <Typography className="text-center" affects="small">
              {row.original.cacheDurationDays}
            </Typography>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created at",
        cell: ({ row }) => {
          if (!row.original?.createdAt) {
            return null;
          }
          return (
            <Typography affects="muted">
              {formatDate(row.original?.createdAt)}
            </Typography>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const site = row.original;

          return (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  confirmDialog({
                    title: "Delete site",
                    content: "Are you sure you want to delete this site?",
                    onConfirm: () => {
                      deleteSite(
                        { id: site.id },
                        {
                          onSuccess(data) {
                            toast({
                              variant: "success",
                              title: data.message,
                            });
                            onCloseConfirm();
                          },
                          onError(data) {
                            toast({
                              variant: "destructive",
                              title: data.message,
                            });
                          },
                        },
                      );
                    },
                    type: "danger",
                    onCancel: () => {},
                  });
                }}
                disabled={deleting}
              >
                <TrashIcon className="icon" />
              </Button>
              <Button
                size="icon"
                onClick={() => {
                  editSiteRef.current?.open(site);
                }}
              >
                <Pencil className="icon" />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [confirmDialog, deleteSite, deleting, onCloseConfirm, session]);

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
              <BreadcrumbPage>All sites</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sites</CardTitle>
          <CardDescription className="max-sm:hidden">
            List of sites where you can use social images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
            <Input
              id="search"
              placeholder="Enter domain to search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-full lg:max-w-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getSites();
                }
              }}
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
              onClick={async () => {
                await getSites();
              }}
              icon={<RefreshCw className="icon" />}
              loading={refetching}
            >
              <span className="max-sm:hidden">Refresh</span>
            </Button>
            <Button
              onClick={() => {
                addSiteRef.current?.open();
              }}
              icon={<Plus className="icon" />}
            >
              <span className="max-sm:hidden">Add site</span>
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={
              sites?.pages?.flatMap((page: { data: Site[] }) => page.data) || []
            }
            loading={fetching || refetching}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </CardContent>
      </Card>

      <AddSiteDialog ref={addSiteRef} />
      <EditSiteDialog ref={editSiteRef} />
      <ConfirmDialog loading={deleting} />
    </div>
  );
};

export default ListSite;
