"use client";

import { useEffect, useMemo, useRef } from "react";

import { ColumnDef } from "@tanstack/table-core";
import { Pencil, RefreshCw, TrashIcon } from "lucide-react";

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
import { useCallApi, useConfirmDialog, useMounted } from "@/hooks";
import { getLinkSmartOGImage, getUrlWithProtocol } from "@/lib/utils";
import {
  EditPageDialog,
  IEditPageDialogRef,
} from "@/modules/page/EditPageDialog";
import { IPageDetail, IUpdatePagesBy } from "@/services/page";
import { ISiteDetail } from "@/services/site";

interface IProps {
  siteId: string;
}

export const ListPage = ({ siteId }: IProps) => {
  const { mounted } = useMounted();
  const { confirmDialog, onCloseConfirm, ConfirmDialog } = useConfirmDialog();
  const editPageRef = useRef<IEditPageDialogRef>(null);

  const {
    data: pages,
    setLetCall: getPages,
    loading: fetching,
  } = useCallApi<IPageDetail[], object, object>({
    url: `/api/sites/${siteId}/pages`,
    options: {
      method: "GET",
    },
    nonCallInit: true,
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  const {
    data: site,
    setLetCall: getSite,
    loading: fetchingSite,
  } = useCallApi<ISiteDetail, object, object>({
    url: `/api/sites/${siteId}`,
    options: {
      method: "GET",
    },
    nonCallInit: true,
  });

  const { promiseFunc: deletePage, loading: deleting } = useCallApi<
    object,
    object,
    null
  >({
    url: `/api/pages`,
    options: {
      method: "DELETE",
    },
    nonCallInit: true,
    handleSuccess() {
      getPages(true);

      onCloseConfirm();
      toast({ variant: "success", title: "Delete successfully" });
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  const { promiseFunc: updatePage, loading: updating } = useCallApi<
    object,
    null,
    Omit<IUpdatePagesBy, "id" | "siteId">
  >({
    url: `/api/pages`,
    options: {
      method: "PUT",
    },
    nonCallInit: true,
    handleSuccess() {
      getPages(true);

      editPageRef.current?.close();
      toast({ variant: "success", title: "Update successfully" });
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  const columns: ColumnDef<IPageDetail>[] = useMemo(
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
          if (!row.original?.OGImage) {
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
                  }),
                  "_blank",
                );
              }}
              src={row.original.OGImage.src}
              width={120}
              height={62}
              className="aspect-og-facebook max-w-40 cursor-pointer rounded"
              alt={row.original.OGImage.src}
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
          if (!row.original?.OGImage?.expiresAt) {
            return null;
          }
          return (
            <Typography affects="muted">
              {new Date(row.original?.OGImage?.expiresAt).toLocaleString()}
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
                      deletePage(null, `/api/pages/${page.id}`);
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
                onClick={async () => {
                  const data = await editPageRef.current?.open(page);

                  if (data) {
                    updatePage(data, `/api/pages/${page.id}`);
                  }
                }}
              >
                <Pencil className="icon" />
              </Button>
            </div>
          );
        },
      },
    ],
    [confirmDialog, deletePage, deleting, updatePage],
  );

  useEffect(() => {
    if (mounted) {
      getSite(true);
      getPages(true);
    }
  }, [mounted, getPages, getSite]);

  return (
    <div className="p-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {fetchingSite ? (
              <Skeleton className="-mb-0.5 inline-block h-3 w-40" />
            ) : (
              <BreadcrumbLink href={`/sites`}>{site?.domain}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>All pages</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-4 flex items-center justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => getPages(true)}
          icon={<RefreshCw className="icon" />}
          loading={fetching}
        >
          Refresh
        </Button>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Pages</CardTitle>
          <CardDescription>
            List of pages for the site{" "}
            {site && (
              <Link
                href={getUrlWithProtocol(site.domain)}
                target="_blank"
                className="text-link"
              >
                {site.domain}
              </Link>
            )}
            {fetchingSite && (
              <Skeleton className="-mb-0.5 inline-block h-3 w-40" />
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={pages || []} loading={fetching} />
        </CardContent>
      </Card>

      <ConfirmDialog loading={deleting} />
      <EditPageDialog ref={editPageRef} loading={updating} />
    </div>
  );
};
