"use client";
import { Checkbox } from "@/components/ui/checkbox";
import type { Tag } from "@/lib/supabase/supabase.types";
import type { ColumnDef } from "@tanstack/react-table";
import { TagIcon } from "lucide-react";
import TagActions from "./TagActions";

export const TagColumn: ColumnDef<Tag>[] = [
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
      const tag = row.original;
      return (
        <div className="flex items-center">
          <TagIcon className="h-4 w-4 mr-2" />
          <span className="font-semibold">{tag.name}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const tag = row.original;
      return <TagActions tag={tag} />;
    },
  },
];
