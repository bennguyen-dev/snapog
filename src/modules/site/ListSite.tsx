"use client";

import { useMemo, useRef } from "react";

import { Site } from "@prisma/client";
import { ColumnDef } from "@tanstack/table-core";
import { Pencil, Plus, RefreshCw, TrashIcon } from "lucide-react";
import { useSession } from "next-auth/react";

import Link from "next/link";

import { CodeSnippet } from "@/components/customs/code-snippet";
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
import { toast } from "@/components/ui/use-toast";
import { useConfirmDialog, useDeleteSiteById, useGetSites } from "@/hooks";
import {
  AddSiteDialog,
  EditSiteDialog,
  IAddSiteDialogRef,
  IEditSiteDialogRef,
} from "@/modules/site";
import { getLinkSmartOGImage, getSnippetHowToUse } from "@/utils";

export const ListSite = () => {
  const { confirmDialog, onCloseConfirm, ConfirmDialog } = useConfirmDialog();
  const { data: session } = useSession();

  const addSiteRef = useRef<IAddSiteDialogRef>(null);
  const editSiteRef = useRef<IEditSiteDialogRef>(null);

  const {
    data: sites,
    isFetching: fetching,
    refetch: getSites,
  } = useGetSites();
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
            <>
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
              <CodeSnippet>
                {getSnippetHowToUse({
                  host: window.location.host,
                  domain: site.domain,
                  apiKey: session?.user?.apiKey,
                })}
              </CodeSnippet>
            </>
          );
        },
      },
      {
        accessorKey: "cacheDurationDays",
        header: "Cache duration (days)",
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
              {new Date(row.original?.createdAt).toLocaleString()}
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
    <div className="p-4 sm:p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/sites">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>All sites</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between space-y-0">
          <div className="flex flex-col space-y-1.5 max-md:w-full">
            <CardTitle>Sites</CardTitle>
            <CardDescription>
              List of sites where you can use social images
            </CardDescription>
          </div>
          <div className="flex items-center justify-end gap-4 max-md:w-full">
            <Button
              variant="outline"
              onClick={async () => {
                await getSites();
              }}
              icon={<RefreshCw className="icon" />}
              loading={fetching}
            >
              Refresh
            </Button>
            <Button
              onClick={() => {
                addSiteRef.current?.open();
              }}
              icon={<Plus className="icon" />}
            >
              Add site
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={sites?.data || []}
            loading={fetching}
          />
        </CardContent>
      </Card>

      <AddSiteDialog ref={addSiteRef} />
      <EditSiteDialog ref={editSiteRef} />
      <ConfirmDialog loading={deleting} />
    </div>
  );
};
