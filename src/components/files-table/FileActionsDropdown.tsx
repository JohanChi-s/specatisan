"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { createFavorite, updateDocument } from "@/lib/supabase/queries";
import type { Document, Star } from "@/lib/supabase/supabase.types";
import {
  CornerDownLeft,
  Delete,
  Edit2,
  ExternalLink,
  Link2,
  Settings,
  StarIcon,
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
import { v4 } from "uuid";

type Props = {
  document: Document;
};

const FileActionsDropdown: React.FC<Props> = ({ document }) => {
  const { dispatch, workspaceId } = useAppState();
  const [title, setTitle] = React.useState(document.title);
  const { user } = useSupabaseUser();
  const router = useRouter();
  if (!workspaceId) {
    toast({
      title: "Error",
      description: "Workspace ID is missing",
      variant: "destructive",
    });
    return redirect("/dashboard");
  }

  const handleSaveChange = async () => {
    if (!workspaceId) return;
    dispatch({
      type: "UPDATE_FILE",
      payload: {
        workspaceId,
        fileId: document.id,
        document: { title },
      },
    });
    const { data, error } = await updateDocument({ title }, document.id);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not update the name for this Document",
      });
    } else {
      toast({
        title: "Success",
        description: "Update name for the Document",
      });
    }
  };

  const handleDeleteDocument = async (DocumentId: string) => {
    dispatch({
      type: "UPDATE_FILE",
      payload: {
        document: { inTrash: `Deleted by ${user?.email}` },
        fileId: document.id,
        workspaceId,
      },
    });
    const { error } = await updateDocument(
      { inTrash: `Deleted by ${user?.email}` },
      DocumentId
    );
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not move the Document to trash",
      });
    } else {
      toast({
        title: "Success",
        description: "Moved Document to trash",
      });
    }
  };

  const handleAddStar = async (document: Document) => {
    if (!user || !workspaceId) return;
    try {
      const { error } = await createFavorite(
        document.id,
        user?.id,
        workspaceId
      );
      if (error) throw new Error("Error adding favorite");
      const newFavorite: Star = {
        documentId: document.id,
        userId: user.id,
        workspaceId,
        id: v4(),
        createdAt: new Date().toISOString(),
        index: null,
      };
      dispatch({
        type: "ADD_FAVORITE",
        payload: {
          favorite: { ...newFavorite, document: document },
          workspaceId,
        },
      });
      toast({
        title: "Success",
        description: "Document added to favorites",
      });
    } catch (error) {
      console.log("Error adding favorite", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not add document to favorites",
      });
    }
  };

  const handleRedirectToEditor = (document: Document) => {
    return router.push(`/dashboard/${workspaceId}/${document.id}`);
  };

  const hanldeOpenEditor = (document: Document) => {
    return router.push(`/dashboard/${workspaceId}/${document.id}`);
  };

  const hanldeCopyLink = (document: Document) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/dashboard/${workspaceId}/${document.id}`
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
        onClick={() => handleRedirectToEditor(document)}
      >
        <CornerDownLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        className="text-sm"
        size="sm"
        onClick={() => hanldeOpenEditor(document)}
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <Button
        variant="default"
        className="text-sm"
        size="sm"
        onClick={() => hanldeCopyLink(document)}
      >
        <Link2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        className="text-sm hover:bg-slate-300 rounded-full"
        size="sm"
        onClick={() => handleAddStar(document)}
      >
        <StarIcon className="font-extralight text-slate-600" />
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
            <DropdownMenuLabel>Document</DropdownMenuLabel>
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
            <DropdownMenuItem onClick={() => handleDeleteDocument(document.id)}>
              <Delete className="mr-2 h-4 w-4" />
              <span>Delete</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Edit Document</SheetTitle>
            <SheetDescription>
              Make changes to your Document here
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tile" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                className="col-span-3"
                onChange={(e) => setTitle(e.target.value)}
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

export default FileActionsDropdown;
