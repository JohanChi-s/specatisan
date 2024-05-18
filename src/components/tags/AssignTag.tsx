"use client";
import { useAppState } from "@/lib/providers/state-provider";
import {
  assignTagToDocument,
  removeTagFromDocument,
} from "@/lib/supabase/queries";
import { DocumentWithTags, Tag } from "@/lib/supabase/supabase.types";
import { Plus, TagIcon, X } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "../ui/use-toast";
type Props = {
  document: DocumentWithTags;
};

const AssignTag: React.FC<Props> = ({ document }) => {
  const [doc, setDoc] = useState<DocumentWithTags>(document);
  const [tags, setTags] = useState<Tag[]>([]);
  const { state, dispatch, workspaceId } = useAppState();

  useEffect(() => {
    if (state.tags.length) {
      const unUseTag = state.tags.filter(
        (tag) => !doc?.tags?.find((t) => t.id === tag.id)
      );
      setTags(unUseTag);
    }
  }, [doc?.tags, state.tags]);

  const handleAssignTag = async (tag: Tag) => {
    if (!workspaceId) return redirect("/dashboard");
    const { error } = await assignTagToDocument(tag.id, document.id);
    if (error) {
      console.error("Error assigning tag to document:", error);
      return toast({
        variant: "destructive",
        description: "Error assigning tag to document",
      });
    }

    const documentTags: Tag[] = document.tags || [];
    documentTags.push(tag);

    dispatch({
      type: "UPDATE_FILE",
      payload: {
        document: { ...document, tags: documentTags },
        workspaceId,
        fileId: document.id,
      },
    });

    setDoc({ ...document, tags: documentTags });
    setTags(tags.filter((t) => t.id !== tag.id));

    toast({
      variant: "default",
      description: "Tag assigned to document",
    });
  };

  // unAssignTag
  const handleUnAssignTag = async (tag: Tag) => {
    if (!workspaceId) return redirect("/dashboard");
    const { error } = await removeTagFromDocument(tag.id, document.id);
    if (error) {
      console.error("Error unassigning tag to document:", error);
      return toast({
        variant: "destructive",
        description: "Error unassigning tag to document",
      });
    }
    setDoc({
      ...document,
      tags: document.tags?.filter((t) => t.id !== tag.id),
    });
    setTags([...tags, tag]);
  };

  return (
    <div className="flex items-center gap-x-1">
      {doc?.tags?.length
        ? doc?.tags?.map((tag) => <Badge key={tag.id}>{tag.name}</Badge>)
        : null}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            size={"smallIcon"}
            className="rounded-full hover:bg-slate-300"
          >
            <Plus className="text-slate-500" size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-50">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Assigned Tags">
                {doc?.tags?.map((tag) => (
                  <CommandItem key={tag.id} onSelect={() => {}}>
                    <div className="flex items-center justify-start">
                      <TagIcon className="mr-2 h-5 w-5" />
                      <span>{tag.name}</span>
                    </div>
                    <Button
                      size={"smallIcon"}
                      variant={"default"}
                      onClick={() => handleUnAssignTag(tag)}
                      className="ml-auto"
                    >
                      <X size={12} />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Tags">
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleAssignTag(tag)}
                  >
                    <div className="flex items-center">
                      <TagIcon className="mr-2 h-5 w-5" />
                      <span>{tag.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AssignTag;
