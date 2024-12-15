"use client";

import { useMemo, useRef } from "react";

import { Page } from "@prisma/client";
import { ColumnDef } from "@tanstack/table-core";
import { Pencil, RefreshCw, TrashIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import Image from "next/image";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import {
  useConfirmDialog,
  useDeletePageById,
  useGetPages,
  useGetSiteById,
} from "@/hooks";
import {
  EditPageDialog,
  IEditPageDialogRef,
} from "@/modules/page/EditPageDialog";
import { getLinkSmartOGImage, getUrlWithProtocol } from "@/utils";

interface IProps {
  siteId: string;
}

export const ListPage = ({ siteId }: IProps) => {
  const { data: session } = useSession();
  const { confirmDialog, onCloseConfirm, ConfirmDialog } = useConfirmDialog();
  const editPageRef = useRef<IEditPageDialogRef>(null);

  const {
    data: pages,
    isFetching: fetching,
    refetch: getPages,
  } = useGetPages({ siteId });
  const { data: site, isFetching: fetchingSite } = useGetSiteById({ siteId });
  const { mutate: deletePage, isPending: deleting } = useDeletePageById({
    siteId,
  });

  const columns: ColumnDef<Page>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "No.",
        cell: ({ row }) => {
          return <Typography affects="small">{row.index + 1}</Typography>;
        },
      },
      {
        accessorKey: "url",
        header: "URL",
        cell: ({ row }) => {
          return (
            <Link
              href={getUrlWithProtocol(row.original.url)}
              target="_blank"
              className="text-link"
            >
              {row.original.url}
            </Link>
          );
        },
      },
      {
        accessorKey: "OGImage",
        header: "Image",
        cell: ({ row }) => {
          if (!row.original?.imageSrc) {
            return null;
          }
          return (
            <Image
              unoptimized
              onClick={() => {
                window.open(
                  getLinkSmartOGImage({
                    host: window.location.host,
                    url: row.original.url,
                    apiKey: session?.user.apiKey || "",
                  }),
                  "_blank",
                );
              }}
              src={row.original.imageSrc}
              width={120}
              height={62}
              className="aspect-og-facebook max-w-40 cursor-pointer rounded"
              alt={row.original.imageSrc}
            />
          );
        },
      },
      {
        accessorKey: "OGTitle",
        header: "Title",
      },
      {
        accessorKey: "OGDescription",
        header: "Description",
      },
      {
        accessorKey: "cacheDurationDays",
        header: "Cache duration (days)",
      },
      {
        accessorKey: "expiredAt",
        header: "Expired at",
        cell: ({ row }) => {
          if (!row.original?.imageExpiresAt) {
            return null;
          }
          return (
            <Typography affects="muted">
              {new Date(row.original?.imageExpiresAt).toLocaleString()}
            </Typography>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const page = row.original;

          return (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  confirmDialog({
                    title: "Delete page",
                    content: "Are you sure you want to delete this page?",
                    onConfirm: () => {
                      deletePage(
                        { id: page.id },
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
                  editPageRef.current?.open(page);
                }}
              >
                <Pencil className="icon" />
              </Button>
            </div>
          );
        },
      },
    ],
    [confirmDialog, deletePage, deleting, onCloseConfirm, session],
  );

  return (
    <div className="p-4 sm:p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/sites">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {fetchingSite ? (
              <Skeleton className="-mb-0.5 inline-block h-3 w-40" />
            ) : (
              <BreadcrumbLink asChild>
                <Link href="/dashboard/sites">{site?.data.domain}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>All pages</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between space-y-0">
          <div className="flex flex-col space-y-1.5 max-md:w-full">
            <CardTitle>Pages</CardTitle>
            <CardDescription>
              List of pages for the site{" "}
              {site && (
                <Link
                  href={getUrlWithProtocol(site.data.domain)}
                  target="_blank"
                  className="text-link"
                >
                  {site.data.domain}
                </Link>
              )}
              {fetchingSite && (
                <Skeleton className="-mb-0.5 inline-block h-3 w-40" />
              )}
            </CardDescription>
          </div>
          <div className="flex items-center justify-end gap-4 max-md:w-full">
            <Button
              variant="outline"
              onClick={() => getPages()}
              icon={<RefreshCw className="icon" />}
              loading={fetching}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={pages?.data || []}
            loading={fetching}
          />
        </CardContent>
      </Card>

      <ConfirmDialog loading={deleting} />
      <EditPageDialog ref={editPageRef} siteId={siteId} />
    </div>
  );
};
