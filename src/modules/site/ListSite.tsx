"use client";

import { useEffect, useMemo, useRef } from "react";

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
import { useCallApi, useConfirmDialog, useMounted } from "@/hooks";
import { getLinkSmartOGImage, getSnippetHowToUse } from "@/lib/utils";
import {
  AddSiteDialog,
  EditSiteDialog,
  IAddSiteDialogRef,
  IEditSiteDialogRef,
} from "@/modules/site";
import { ICreateSite, ISiteDetail, IUpdateSiteBy } from "@/services/site";

export const ListSite = () => {
  const { mounted } = useMounted();
  const { confirmDialog, onCloseConfirm, ConfirmDialog } = useConfirmDialog();
  const { data: session } = useSession();

  const addSiteRef = useRef<IAddSiteDialogRef>(null);
  const editSiteRef = useRef<IEditSiteDialogRef>(null);

  const {
    data: sites,
    setLetCall: getSites,
    loading: fetching,
  } = useCallApi<ISiteDetail[], object, object>({
    url: `/api/sites`,
    options: {
      method: "GET",
    },
    nonCallInit: true,
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  const { promiseFunc: createSite, loading: creating } = useCallApi<
    object,
    object,
    Omit<ICreateSite, "userId">
  >({
    url: `/api/sites`,
    options: {
      method: "POST",
    },
    nonCallInit: true,
    handleSuccess() {
      getSites(true);

      addSiteRef.current?.close();
      toast({ variant: "success", title: "Create successfully" });
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  const { promiseFunc: deleteSite, loading: deleting } = useCallApi<
    object,
    object,
    null
  >({
    url: `/api/sites`,
    options: {
      method: "DELETE",
    },
    nonCallInit: true,
    handleSuccess() {
      getSites(true);

      onCloseConfirm();
      toast({ variant: "success", title: "Delete successfully" });
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  const { promiseFunc: updateSite, loading: updating } = useCallApi<
    object,
    null,
    Omit<IUpdateSiteBy, "id">
  >({
    url: `/api/sites`,
    options: {
      method: "PUT",
    },
    nonCallInit: true,
    handleSuccess() {
      getSites(true);

      editSiteRef.current?.close();
      toast({ variant: "success", title: "Update successfully" });
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  useEffect(() => {
    mounted && getSites(true);
  }, [mounted, getSites]);

  const columns: ColumnDef<ISiteDetail>[] = useMemo(() => {
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
                <Link href={urlExample} target="_blank" className="text-link">
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
                      deleteSite(null, `/api/sites/${site.id}`);
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
                  const data = await editSiteRef.current?.open(site);

                  if (data) {
                    updateSite(data, `/api/sites/${site.id}`);
                  }
                }}
              >
                <Pencil className="icon" />
              </Button>
            </div>
          );
        },
      },
    ];
  }, [confirmDialog, deleteSite, deleting, session, updateSite]);

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
      <div className="mb-4 flex items-center justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => getSites(true)}
          icon={<RefreshCw className="icon" />}
          loading={fetching}
        >
          Refresh
        </Button>
        <Button
          onClick={async () => {
            const data = await addSiteRef.current?.open();
            if (data) {
              createSite(data, "/api/sites");
            }
          }}
          icon={<Plus className="icon" />}
        >
          Add site
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sites</CardTitle>
          <CardDescription>
            List of sites where you can use social images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={sites || []} loading={fetching} />
        </CardContent>
      </Card>

      <AddSiteDialog ref={addSiteRef} loading={creating} />
      <EditSiteDialog ref={editSiteRef} loading={updating} />
      <ConfirmDialog loading={deleting} />
    </div>
  );
};
