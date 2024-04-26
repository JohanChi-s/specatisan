"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import {
  createDocument,
  updateCollection,
  updateDocument,
} from "@/lib/supabase/queries";
import { Document } from "@/shared/supabase.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";
import { PlusIcon, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { v4 } from "uuid";
import EmojiPicker from "../global/emoji-picker";
import TooltipComponent from "../global/tooltip-component";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useToast } from "../ui/use-toast";

interface DropdownProps {
  title: string;
  id: string;
  listType: "collection" | "document";
  iconId: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  id,
  listType,
  iconId,
  children,
  disabled,
  ...props
}) => {
  const { toast } = useToast();
  const { user } = useSupabaseUser();
  const { state, dispatch, workspaceId, collectionId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  //collection Title synced with server data and local
  const collectionTitle: string | undefined = useMemo(() => {
    if (listType === "collection") {
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.collections.find((collection) => collection.id === id)?.name;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  //documentItitle

  const documentTitle: string | undefined = useMemo(() => {
    if (listType === "document") {
      const documentAndCollectionId = id.split("collection");
      const stateTitle = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.collections.find(
          (collection) => collection.id === documentAndCollectionId[0]
        )
        ?.documents.find(
          (document) => document.id === documentAndCollectionId[1]
        )?.title;
      if (title === stateTitle || !stateTitle) return title;
      return stateTitle;
    }
  }, [state, listType, workspaceId, id, title]);

  //Navigate the user to a different page
  const navigatatePage = (accordionId: string, type: string) => {
    if (type === "collection") {
      router.push(`/dashboard/${workspaceId}/${accordionId}`);
    }
    if (type === "document") {
      router.push(
        `/dashboard/${workspaceId}/${collectionId}/${
          accordionId.split("collection")[1]
        }`
      );
    }
  };

  //double click handler
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  //blur

  const handleBlur = async () => {
    if (!isEditing) return;
    setIsEditing(false);
    const fId = id.split("collection");
    if (fId?.length === 1) {
      if (!collectionTitle) return;
      toast({
        title: "Success",
        description: "Collection title changed.",
      });
      await updateCollection(fId[0], { name: title });
    }

    if (fId.length === 2 && fId[1]) {
      if (!documentTitle) return;
      const { data, error } = await updateDocument(fId[1], {
        title: documentTitle,
      });
      if (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not update the title for this document",
        });
      } else
        toast({
          title: "Success",
          description: "Document title changed.",
        });
    }
  };

  //onchanges
  const onChangeEmoji = async (selectedEmoji: string) => {
    if (!workspaceId) return;
    if (listType === "collection") {
      dispatch({
        type: "UPDATE_COLLECTION",
        payload: {
          workspaceId,
          collectionId: id,
          collection: { iconId: selectedEmoji },
        },
      });
      const { data, error } = await updateCollection(id, {
        icon: selectedEmoji,
      });
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
    }
  };
  const collectionTitleChange = (e: any) => {
    if (!workspaceId) return;
    const fid = id.split("collection");
    if (fid.length === 1) {
      dispatch({
        type: "UPDATE_COLLECTION",
        payload: {
          collection: { title: e.target.value },
          collectionId: fid[0],
          workspaceId,
        },
      });
    }
  };
  const documentTitleChange = (e: any) => {
    if (!workspaceId || !collectionId) return;
    const fid = id.split("collection");
    if (fid.length === 2 && fid[1]) {
      dispatch({
        type: "UPDATE_DOCUMENT",
        payload: {
          document: { title: e.target.value },
          collectionId,
          workspaceId,
          documentId: fid[1],
        },
      });
    }
  };

  //move to trash
  const moveToTrash = async () => {
    if (!user?.email || !workspaceId) return;
    const pathId = id.split("collection");
    if (listType === "collection") {
      dispatch({
        type: "UPDATE_COLLECTION",
        payload: {
          collection: { inTrash: `Deleted by ${user?.email}` },
          collectionId: pathId[0],
          workspaceId,
        },
      });
      const { data, error } = await updateCollection(pathId[0], {
        inTrash: `Deleted by ${user?.email}`,
      });
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
    }

    if (listType === "document") {
      dispatch({
        type: "UPDATE_DOCUMENT",
        payload: {
          document: { inTrash: `Deleted by ${user?.email}` },
          collectionId: pathId[0],
          workspaceId,
          documentId: pathId[1],
        },
      });
      const { data, error } = await updateDocument(pathId[1], {
        inTrash: `Deleted by ${user?.email}`,
      });
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
    }
  };

  const isCollection = listType === "collection";
  const groupIdentifies = clsx(
    "dark:text-white whitespace-nowrap flex justify-between items-center w-full relative",
    {
      "group/collection": isCollection,
      "group/document": !isCollection,
    }
  );

  const listStyles = useMemo(
    () =>
      clsx("relative", {
        "border-none text-md": isCollection,
        "border-none ml-6 text-[16px] py-1": !isCollection,
      }),
    [isCollection]
  );

  const hoverStyles = useMemo(
    () =>
      clsx(
        "h-full hidden rounded-sm absolute right-0 items-center justify-center",
        {
          "group-hover/document:block": listType === "document",
          "group-hover/collection:block": listType === "collection",
        }
      ),
    [isCollection]
  );

  const addNewDocument = async () => {
    if (!workspaceId) return;
    const newDocument: Document = {
      collectionId: id,
      data: null,
      createdAt: new Date().toISOString(),
      inTrash: null,
      title: "Untitled",
      iconId: "📄",
      id: v4(),
      workspaceId,
      bannerUrl: "",
    };
    dispatch({
      type: "ADD_DOCUMENT",
      payload: { document: newDocument, collectionId: id, workspaceId },
    });
    const { data, error } = await createDocument(newDocument);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not create a document",
      });
    } else {
      toast({
        title: "Success",
        description: "Document created.",
      });
    }
  };

  return (
    <AccordionItem
      value={id}
      className={listStyles}
      onClick={(e) => {
        e.stopPropagation();
        navigatatePage(id, listType);
      }}
    >
      <AccordionTrigger
        id={listType}
        className="hover:no-underline 
        p-2 
        dark:text-muted-foreground 
        text-sm"
        disabled={listType === "document"}
      >
        <div className={groupIdentifies}>
          <div
            className="flex 
          gap-4 
          items-center 
          justify-center 
          overflow-hidden"
          >
            <div className="relative">
              <EmojiPicker getValue={onChangeEmoji}>{iconId}</EmojiPicker>
            </div>
            <input
              type="text"
              value={
                listType === "collection" ? collectionTitle : documentTitle
              }
              className={clsx(
                "outline-none overflow-hidden w-[140px] text-Neutrals/neutrals-7",
                {
                  "bg-muted cursor-text": isEditing,
                  "bg-transparent cursor-pointer": !isEditing,
                }
              )}
              readOnly={!isEditing}
              onDoubleClick={handleDoubleClick}
              onBlur={handleBlur}
              onChange={
                listType === "collection"
                  ? collectionTitleChange
                  : documentTitleChange
              }
            />
          </div>
          <div className={hoverStyles}>
            <TooltipComponent message="Delete Collection">
              <Trash
                onClick={moveToTrash}
                size={15}
                className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
              />
            </TooltipComponent>
            {listType === "collection" && !isEditing && (
              <TooltipComponent message="Add Document">
                <PlusIcon
                  onClick={addNewDocument}
                  size={15}
                  className="hover:dark:text-white dark:text-Neutrals/neutrals-7 transition-colors"
                />
              </TooltipComponent>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {state.workspaces
          .find((workspace) => workspace.id === workspaceId)
          ?.collections.find((collection) => collection.id === id)
          ?.documents.filter((document) => !document.inTrash)
          .map((document) => {
            const customDocumentId = `${id}collection${document.id}`;
            return (
              <Dropdown
                key={document.id}
                title={document.title}
                listType="document"
                id={customDocumentId}
                iconId={document.iconId}
              />
            );
          })}
      </AccordionContent>
    </AccordionItem>
  );
};

export default Dropdown;
