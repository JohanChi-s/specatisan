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
import type { Collection } from "@/lib/supabase/supabase.types";
import type { ColumnDef } from "@tanstack/react-table";
import { FolderIcon, FileText, MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
// import { priorities, statuses } from "./DataTableToolbar";

export const collectionColumns: ColumnDef<Collection>[] = [
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
    header: "Title",
    cell: ({ row }) => {
      const collection = row.original;
      return (
        <div className="flex items-center">
          <FolderIcon className="h-4 w-4 mr-2" />
          <span className="font-bold">{collection.name}</span>
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
      const collection = row.original;
      const createdAt = new Date(collection.createdAt);
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
  // {
  // 	accessorKey: "priority",
  // 	header: ({ column }) => (
  // 		<DataTableColumnHeader column={column} title="Priority" />
  // 	),
  // 	cell: ({ row }) => {
  // 		const priority = priorities.find(
  // 			(priority) => priority.value === row.getValue("priority"),
  // 		);

  // 		if (!priority) {
  // 			return null;
  // 		}

  // 		return (
  // 			<div className="flex items-center">
  // 				{priority.icon && (
  // 					<priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  // 				)}
  // 				<span>{priority.label}</span>
  // 			</div>
  // 		);
  // 	},
  // 	filterFn: (row, id, value) => {
  // 		return value.includes(row.getValue(id));
  // 	},
  // },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const collection = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(collection.name)}
            >
              Copy collection ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Show hisoty actions</DropdownMenuItem>
            <DropdownMenuItem>Delete Document</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
