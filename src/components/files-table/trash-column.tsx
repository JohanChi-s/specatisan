"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Document } from "@/lib/supabase/supabase.types";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArchiveRestoreIcon,
  File as FileIcon,
  FileText,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
// import { priorities, statuses } from "./DataTableToolbar";

export const trashColumns: ColumnDef<Document>[] = [
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
          <FileIcon className="h-4 w-4 mr-2" />
          <span className="font-bold">{document.title}</span>
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
      const document = row.original;

      return (
        <div className="flex items-center">
          <Button variant={"ghost"}>
            <ArchiveRestoreIcon size={24} />
            <span>Restore</span>
          </Button>
          <Button variant={"destructive"}>
            <Trash2Icon size={24} />
            <span>Delete</span>
          </Button>
        </div>
      );
    },
  },
];
