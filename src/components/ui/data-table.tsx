"use client";

import * as React from "react";
import { useCallback, useRef } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  loading?: boolean;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  loading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const observer = useRef<IntersectionObserver>();
  const lastRowRef = useCallback(
    (node: HTMLTableRowElement) => {
      if (loading || !hasNextPage || isFetchingNextPage || !fetchNextPage)
        return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && fetchNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const rows = table.getRowModel().rows;

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={cn(loading && "pointer-events-none", "relative")}>
          {loading && (
            <TableRow className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-primary-foreground/70">
              <TableCell colSpan={columns.length}>
                <Loader2 className="icon animate-spin text-primary" />
              </TableCell>
            </TableRow>
          )}
          {rows?.length ? (
            rows.map((row, index) => {
              const isLastRow = index === rows.length - 1;
              return (
                <TableRow
                  key={row.id}
                  ref={isLastRow ? lastRowRef : null}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
          {isFetchingNextPage && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Loader2 className="icon animate-spin text-primary" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
