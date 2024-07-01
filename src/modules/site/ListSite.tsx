"use client";

import { Typography } from "@/components/ui/typography";
import { ColumnDef } from "@tanstack/table-core";
import { ISiteDetail, IUpdateSiteBy } from "@/sevices/site";
import { useCallApi, useConfirmDialog, useMounted } from "@/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  getDomainName,
  getLinkSmartOGImage,
  getSnippetHowToUse,
} from "@/lib/utils";
import Link from "next/link";
import { Pencil, Plus, RefreshCw, TrashIcon } from "lucide-react";
import { CodeSnippet } from "@/components/ui/code-snippet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EditSiteDialog, IEditSiteDialogRef } from "@/modules/site";

export const ListSite = () => {
  const { mounted } = useMounted();
  const { confirmDialog, onCloseConfirm, ConfirmDialog } = useConfirmDialog();

  const [domain, setDomain] = useState<string>("");
  const [openedDialogCreate, setOpenedDialogCreate] = useState<boolean>(false);

  const editSiteRef = useRef<IEditSiteDialogRef>(null);

  const {
    data: sites,
    setLetCall: getSites,
    loading: fetching,
  } = useCallApi<ISiteDetail[], {}, {}>({
    url: `/api/sites`,
    options: {
      method: "GET",
    },
    nonCallInit: true,
  });

  const { promiseFunc: createSite, loading: creating } = useCallApi<
    {},
    {},
    { domain: string }
  >({
    url: `/api/sites`,
    options: {
      method: "POST",
    },
    nonCallInit: true,
    handleSuccess() {
      getSites(true);

      setOpenedDialogCreate(false);
      setDomain("");
    },
  });

  const { promiseFunc: deleteSite, loading: deleting } = useCallApi<
    {},
    {},
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
    },
  });

  const { promiseFunc: updateSite, loading: updating } = useCallApi<
    {},
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
            <Link href={`/sites/${row.original.id}`} className="text-link">
              {row.original.domain}
            </Link>
          );
        },
      },
      {
        header: "How to use?",
        cell: ({ row }) => {
          const site = row.original;
          const urlExample = getLinkSmartOGImage(site.domain);

          return (
            <>
              <Typography affects="small" className="mb-4">
                Example URL:{" "}
                <Link href={urlExample} target="_blank" className="text-link">
                  {urlExample}
                </Link>
              </Typography>
              <CodeSnippet>{getSnippetHowToUse(site.domain)}</CodeSnippet>
            </>
          );
        },
      },
      {
        accessorKey: "cacheDurationDays",
        header: "Cache duration (days)",
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
  }, [confirmDialog, deleteSite, deleting, updateSite]);

  return (
    <div className="w-full py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
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
          onClick={() => {
            setDomain("");
            setOpenedDialogCreate(true);
          }}
          icon={<Plus className="icon" />}
        >
          Add site
        </Button>
      </div>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Sites</CardTitle>
          <CardDescription>
            List of sites where you can use social images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={sites || []} loading={fetching} />
        </CardContent>
      </Card>
      <Dialog open={openedDialogCreate} onOpenChange={setOpenedDialogCreate}>
        <DialogContent
          className="sm:max-w-screen-xs"
          onPointerDownOutside={(e) => {
            creating && e.preventDefault();
          }}
          onInteractOutside={(e) => {
            creating && e.preventDefault();
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle>Add new site</DialogTitle>
            <DialogDescription>
              This is the website where you want to use the social images on.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4 flex flex-col">
            <Label htmlFor="domain" className="mb-2 text-left">
              Domain
            </Label>
            <Input
              id="domain"
              placeholder="www.yoursite.com"
              value={domain}
              disabled={creating}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="submit"
              disabled={!domain.trim()}
              loading={creating}
              onClick={() => createSite({ domain: getDomainName(domain) })}
            >
              Add site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog loading={deleting} />
      <EditSiteDialog ref={editSiteRef} loading={updating} />
    </div>
  );
};
