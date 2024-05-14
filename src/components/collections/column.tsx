"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { Collection } from "@/lib/supabase/supabase.types";
import type { ColumnDef } from "@tanstack/react-table";
import { FolderIcon } from "lucide-react";
import { DataTableColumnHeader } from "../files-table/DataTableColumnHeader";
import CollectionActionsDropdown from "./CollectionActionsDropdown";

export const CollectionColumns: ColumnDef<Collection>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="flex items-center">
          <FolderIcon className="h-4 w-4 mr-2" />
          <span className="font-semibold text-xl">{document.name}</span>
        </div>
      );
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
      const collection = row.original;

      return <CollectionActionsDropdown collection={collection} />;
    },
  },
];
