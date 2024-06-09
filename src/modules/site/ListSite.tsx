"use client";

import { Typography } from "@/components/ui/typography";
import { ColumnDef } from "@tanstack/table-core";
import { ISiteDetail } from "@/sevices/site";
import { useMounted } from "@/hooks/useMouted";
import { useEffect, useMemo, useState } from "react";
import { useCallApi } from "@/hooks/useCallApi";
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
import { getDomainName } from "@/lib/utils";
import Link from "next/link";
import { Plus, TrashIcon } from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export const ListSite = () => {
  const { mounted } = useMounted();
  const { confirmDialog, onCloseConfirm, ConfirmDialog } = useConfirmDialog();

  const [domain, setDomain] = useState<string>("");
  const [openedDialogCreate, setOpenedDialogCreate] = useState<boolean>(false);

  const { data: sites, setLetCall: getSites } = useCallApi<
    ISiteDetail[],
    {},
    {}
  >({
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
              href={`/sites/${row.original.id}`}
              className="text-right font-medium underline hover:text-blue-500"
            >
              {row.original.domain}
            </Link>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const site = row.original;

          return (
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
              <TrashIcon className="h-4 w-4" />
            </Button>
          );
        },
      },
    ];
  }, []);

  return (
    <div className="w-full py-8">
      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h2">Sites</Typography>
        <Button
          className="w-fit"
          onClick={() => {
            setDomain("");
            setOpenedDialogCreate(true);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Add site
        </Button>
      </div>
      <DataTable columns={columns} data={sites || []} />
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
    </div>
  );
};
