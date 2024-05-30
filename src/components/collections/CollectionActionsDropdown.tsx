"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { updateCollection } from "@/lib/supabase/queries";
import type { Collection } from "@/lib/supabase/supabase.types";
import {
  CornerDownLeft,
  Delete,
  Edit2,
  ExternalLink,
  Link2,
  Settings,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { toast } from "../ui/use-toast";

type Props = {
  collection: Collection;
};

const CollectionActionsDropdown: React.FC<Props> = ({ collection }) => {
  const { dispatch, workspaceId } = useAppState();
  const [name, setName] = React.useState(collection.name);
  const { user } = useSupabaseUser();
  const router = useRouter();
  if (!workspaceId) return redirect("/dashboard");

  const handleSaveChange = async () => {
    if (!workspaceId) return;
    dispatch({
      type: "UPDATE_COLLECTION",
      payload: {
        workspaceId,
        collectionId: collection.id,
        collection: { name },
      },
    });
    const { data, error } = await updateCollection({ name }, collection.id);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not update the name for this Collection",
      });
    } else {
      toast({
        title: "Success",
        description: "Update name for the Collection",
      });
    }
  };

  const handleDeleteCollection = async (CollectionId: string) => {
    dispatch({
      type: "UPDATE_COLLECTION",
      payload: {
        collection: { inTrash: `Deleted by ${user?.email}` },
        collectionId: collection.id,
        workspaceId,
      },
    });
    const { error } = await updateCollection(
      { inTrash: `Deleted by ${user?.email}` },
      CollectionId
    );
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not move the Collection to trash",
      });
    } else {
      toast({
        title: "Success",
        description: "Moved Collection to trash",
      });
    }
  };

  const handleAccessCollection = (collection: Collection) => {
    return router.push(
      `/dashboard/${workspaceId}/collections/${collection.id}`
    );
  };

  const hanldeCopyLink = (collection: Collection) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/dashboard/${workspaceId}/collections/${collection.id}`
    );
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="flex items-center gap-x-2 ml-auto">
      <Button
        variant="default"
        className="text-sm bg-green-500 hover:bg-green-600"
        size="sm"
        onClick={() => handleAccessCollection(collection)}
      >
        <CornerDownLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        className="text-sm"
        size="sm"
        onClick={() => hanldeCopyLink(collection)}
      >
        <Link2 className="h-4 w-4" />
      </Button>
      <Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} onClick={() => {}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-ellipsis text-slate-600"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Collection</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <SheetTrigger asChild>
                <DropdownMenuItem>
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              </SheetTrigger>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDeleteCollection(collection.id)}
            >
              <Delete className="mr-2 h-4 w-4" />
              <span>Delete</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Edit Collection</SheetTitle>
            <SheetDescription>
              Make changes to your Collection here
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tile" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={name}
                className="col-span-3"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleSaveChange}>
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CollectionActionsDropdown;
