"use client";

import { Document } from "@/lib/supabase/supabase.types";
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tag } from "@/lib/supabase/supabase.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, TagIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { deleteTag, updateTag } from "@/lib/supabase/queries";
import { toast } from "../ui/use-toast";

type TagActionsProps = {
  tag: Tag;
};

const TagActions: React.FC<TagActionsProps> = ({ tag }) => {
  const [tagName, setTagName] = React.useState<string>(tag.name);
  const [openEdit, setOpenEdit] = React.useState<boolean>(false);
  const handleUpdateTag = async () => {
    // Update tag
    const { error } = await updateTag({ ...tag, name: tagName });
    if (error) {
      console.error("Error updating tag:", error);
      toast({
        title: "Error updating tag",
        type: "foreground",
      });
      // Handle error (e.g., show an error message)
    } else {
      toast({
        title: "Tag updated",
        type: "foreground",
      });
    }
    setOpenEdit(false);
  };

  const handleDeleteTag = async () => {
    // Delete tag
    const { error } = await deleteTag(tag.id);
    if (error) {
      console.error("Error deleting tag:", error);
      toast({
        title: "Error deleting tag",
        type: "foreground",
        variant: "destructive",
      });
      // Handle error (e.g., show an error message)
    } else {
      toast({
        title: "Tag deleted",
        variant: "default",
      });
    }
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"default"}
            className="h-8 w-8 p-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setOpenEdit(true);
            }}
          >
            Edit tag
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteTag}>
            Delete tag
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover open={openEdit}>
        <PopoverTrigger />
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Edit Tag</h4>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Name</Label>
                <Input
                  id="width"
                  defaultValue={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className="col-span-2 h-8"
                />
              </div>
              <Button variant={"secondary"} onClick={handleUpdateTag}>
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagActions;
