"use client";

import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import React from "react";
import { Tag } from "@/lib/supabase/supabase.types";
import { useAppState } from "@/lib/providers/state-provider";
import { DataTableViewOptions } from "../files-table/DataTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function CollectionDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [tags, setTags] = React.useState<Tag[]>([]);
  const { state } = useAppState();

  React.useEffect(() => {
    setTags(state.tags || []);
  }, [state.tags]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Collections..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
