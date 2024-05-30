import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { updateCollection } from "@/lib/supabase/queries";
import { Collection } from "@/lib/supabase/supabase.types";
import { cn } from "@/lib/utils";
import { Delete, Edit2, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";
import EmojiPicker from "../global/emoji-picker";
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
import { Button } from "../ui/button";

type Props = {
  collection: Collection;
  workspaceId: string;
};

const CollectionItem: React.FC<Props> = ({ collection, workspaceId }) => {
  const { dispatch } = useAppState();
  const [name, setName] = React.useState(collection.name);
  const { user } = useSupabaseUser();

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
        description: "Could not update the name for this collection",
      });
    } else {
      toast({
        title: "Success",
        description: "Update name for the collection",
      });
    }
  };
  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId) return;
    dispatch({
      type: "UPDATE_COLLECTION",
      payload: {
        workspaceId,
        collectionId: collection.id,
        collection: { icon: selectedEmoji },
      },
    });
    const { data, error } = await updateCollection(
      { icon: selectedEmoji },
      collection.id
    );
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not update the emoji for this collection",
      });
    } else {
      toast({
        title: "Success",
        description: "Update emoji for the collection",
      });
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    dispatch({
      type: "UPDATE_COLLECTION",
      payload: {
        collection: { inTrash: `Deleted by ${user?.email}` },
        collectionId: collectionId,
        workspaceId,
      },
    });
    const { error } = await updateCollection(
      { inTrash: `Deleted by ${user?.email}` },
      collectionId
    );
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not move the collection to trash",
      });
    } else {
      toast({
        title: "Success",
        description: "Moved collection to trash",
      });
    }
  };

  return (
    <li className="flex flex-1 w-full px-2 py-1 rounded-md hover:bg-muted justify-start items-center dark:text-white dark:hover:bg-muted dark:hover:text-white">
      <EmojiPicker getValue={onChangeEmoji}>{collection.icon}</EmojiPicker>
      <Link
        href={`/dashboard/${workspaceId}/collections/${collection.id}`}
        className={cn("flex-1 w-full justify-start ml-2")}
      >
        {collection.name}
      </Link>
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
            <SheetTitle>Edit collection</SheetTitle>
            <SheetDescription>
              Make changes to your collection here
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
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
    </li>
  );
};

export default CollectionItem;
