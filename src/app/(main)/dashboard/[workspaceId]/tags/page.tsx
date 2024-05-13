"use client";
import { DataTable } from "@/components/files-table/data-table";
import { TagColumn } from "@/components/tags/TagColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import WorkspaceNavbar from "@/components/workspace/WorkspaceNavbar";
import { useAppState } from "@/lib/providers/state-provider";
import { createTag, getTags } from "@/lib/supabase/queries";
import type { Tag } from "@/lib/supabase/supabase.types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

const TagsPage = () => {
  const { workspaceId } = useAppState();
  const [tags, setTags] = useState<Tag[]>([]);
  const { state, dispatch } = useAppState();
  const [tagName, setTagName] = useState<string>(""); //

  useEffect(() => {
    if (!workspaceId) {
      redirect("/dashboard");
      return;
    }

    const fetchData = async () => {
      try {
        const { data, error } = await getTags(workspaceId);
        if (error) {
          return redirect("/dashboard");
        }

        setTags(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        // Handle error (e.g., show an error message)
      }
    };

    fetchData();
  }, [workspaceId]);

  useEffect(() => {
    setTags(state.tags || []);
  }, [state.tags]);

  const handleCreateTag = async () => {
    if (!workspaceId) {
      return;
    }

    const tag: Tag = {
      name: tagName,
      workspaceId: workspaceId,
      id: v4(),
      color: null,
      createdAt: new Date().toISOString(),
    };

    try {
      // check exits
      // if (error) {
      //   return redirect("/dashboard");
      // }

      const { error: createError } = await createTag(tag);
      if (createError) {
        return redirect("/dashboard");
      }

      setTags((prev) => [...prev, tag]);

      dispatch({
        type: "CREATE_TAG",
        payload: {
          workspaceId,
          tag,
        },
      });
      setTagName("");
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="container mx-auto px-5">
      {/* Workspace Navbar */}
      <WorkspaceNavbar />

      <div className="flex flex-1 w-full justify-end mt-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"default"}>Create Tag</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Create Tag</h4>
                <p className="text-sm text-muted-foreground">Create new tag</p>
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
                <Button variant={"secondary"} onClick={handleCreateTag}>
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Data Table */}
      <DataTable columns={TagColumn} data={tags} />
    </div>
  );
};

export default TagsPage;
