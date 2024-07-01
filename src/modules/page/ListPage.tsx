"use client";

import { ColumnDef } from "@tanstack/table-core";
import { IPageDetail, IUpdatePagesBy } from "@/sevices/page";
import { useCallApi, useConfirmDialog, useMounted } from "@/hooks";
import { useEffect, useMemo, useRef } from "react";
import { Typography } from "@/components/ui/typography";
import { DataTable } from "@/components/ui/data-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil, RefreshCw, TrashIcon } from "lucide-react";
import Link from "next/link";
import { getLinkSmartOGImage, getUrlWithProtocol } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ISiteDetail } from "@/sevices/site";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  EditPageDialog,
  IEditPageDialogRef,
} from "@/modules/page/EditPageDialog";

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
            <Link
              href={getLinkSmartOGImage(row.original.url)}
              target="_blank"
              className="text-link"
            >
              <Image
                src={row.original.OGImage.src}
                width={120}
                height={60}
                className="aspect-[1200/628] max-w-40 rounded"
                alt={row.original.OGImage.src}
              />
            </Link>
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
    <div className="w-full py-8">
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
