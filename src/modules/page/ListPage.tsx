"use client";

import { ColumnDef } from "@tanstack/table-core";
import { IPageDetail } from "@/sevices/page";
import { useCallApi } from "@/hooks/useCallApi";
import { useMounted } from "@/hooks/useMouted";
import { useEffect, useMemo } from "react";
import { Typography } from "@/components/ui/typography";
import { DataTable } from "@/components/ui/data-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, TrashIcon } from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import Link from "next/link";
import { getLinkSmartOGImage, getUrlWithProtocol } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IProps {
  siteId: string;
}

export const ListPage = ({ siteId }: IProps) => {
  const { mounted } = useMounted();
  const { confirmDialog, onCloseConfirm, ConfirmDialog } = useConfirmDialog();

  const {
    data: pages,
    setLetCall: getPages,
    loading: fetching,
  } = useCallApi<IPageDetail[], {}, {}>({
    url: `/api/sites/${siteId}/pages`,
    options: {
      method: "GET",
    },
    nonCallInit: true,
  });

  const { promiseFunc: deletePage, loading: deleting } = useCallApi<
    {},
    {},
    null
  >({
    url: `/api/sites/${siteId}/pages`,
    options: {
      method: "DELETE",
    },
    nonCallInit: true,
    handleSuccess() {
      getPages(true);

      onCloseConfirm();
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
                src={row.original.OGImage}
                width={120}
                height={60}
                className="aspect-[1200/628] max-w-40 rounded"
                alt={row.original.OGImage}
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const page = row.original;

          return (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                confirmDialog({
                  title: "Delete page",
                  content: "Are you sure you want to delete this page?",
                  onConfirm: () => {
                    deletePage(null, `/api/sites/${siteId}/pages/${page.id}`);
                  },
                  type: "danger",
                  onCancel: () => {},
                });
              }}
              disabled={deleting}
            >
              <TrashIcon className="icon" />
            </Button>
          );
        },
      },
    ],
    [confirmDialog, deletePage, deleting, siteId],
  );

  useEffect(() => {
    mounted && getPages(true);
  }, [mounted, getPages]);

  return (
    <div className="w-full py-8">
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
          <CardDescription>List of pages for the site</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={pages || []} />
        </CardContent>
      </Card>

      <ConfirmDialog loading={deleting} />
    </div>
  );
};
