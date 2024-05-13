"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { DocumentWithTags } from "@/lib/supabase/supabase.types";
import type { ColumnDef } from "@tanstack/react-table";
import { FileText } from "lucide-react";
import AssignTag from "../tags/AssignTag";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import FileActionsDropdown from "./FileActionsDropdown";

export const columns: ColumnDef<DocumentWithTags>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          <span className="font-semibold text-xl">{document.title}</span>
        </div>
      );
    },
  },
  {
    id: "tags",
    filterFn: "arrIncludesSome",
    accessorFn: (row) => row.tags,
    header: "Tags",
    cell: ({ row }) => {
      const document = row.original;
      return <AssignTag document={document} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Update" />
    ),
    cell: ({ row }) => {
      const document = row.original;
      const createdAt = new Date(document.createdAt);
      const formattedDate = `${createdAt.getDate()}-${
        createdAt.getMonth() + 1
      }-${createdAt.getFullYear().toString().slice(-2)}`;
      const formattedTime = ` ${createdAt.getHours()}:${createdAt.getMinutes()}`;
      return (
        <div>
          <span>{formattedDate}</span>
          <span>{formattedTime}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const document = row.original;

      return <FileActionsDropdown document={document} />;
    },
  },
];
