"use client";

import { ColumnDef } from "@tanstack/table-core";
import { IPageDetail } from "@/sevices/page";
import { useCallApi } from "@/hooks/useCallApi";
import { useMounted } from "@/hooks/useMouted";
import { useEffect } from "react";
import { Typography } from "@/components/ui/typography";
import { DataTable } from "@/components/ui/data-table";
import Image from "next/image";

const columns: ColumnDef<IPageDetail>[] = [
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
          src={row.original.OGImage}
          width={120}
          height={60}
          className="aspect-[1200/628] max-w-40 rounded"
          alt={row.original.OGImage}
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
];

interface IProps {
  siteId: string;
}

export const ListPage = ({ siteId }: IProps) => {
  const { mounted } = useMounted();

  const { data: pages, setLetCall: getPages } = useCallApi<
    IPageDetail[],
    {},
    {}
  >({
    url: `/api/sites/${siteId}/pages`,
    options: {
      method: "GET",
    },
    nonCallInit: true,
  });

  useEffect(() => {
    mounted && getPages(true);
  }, [mounted, getPages]);

  return (
    <div className="w-full py-8">
      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h2" className="mb-4">
          Sites
        </Typography>
      </div>
      <DataTable columns={columns} data={pages || []} />
    </div>
  );
};
