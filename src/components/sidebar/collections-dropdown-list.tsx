"use client";
import useSupabaseRealtime from "@/lib/hooks/useSupabaseRealtime";
import { useAppState } from "@/lib/providers/state-provider";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { createCollection } from "@/lib/supabase/queries";
import { Collection } from "@/lib/supabase/supabase.types";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import TooltipComponent from "../global/tooltip-component";
import { useToast } from "../ui/use-toast";
import CollectionItem from "./CollectionItem";

interface CollectionsDropdownListProps {
  workspaceCollections: Collection[];
  workspaceId: string;
}

const CollectionsDropdownList: React.FC<CollectionsDropdownListProps> = ({
  workspaceCollections,
  workspaceId,
}) => {
  // useSupabaseRealtime();
  const { state, dispatch, collectionId } = useAppState();
  const { user } = useSupabaseUser();
  const { open, setOpen } = useSubscriptionModal();
  const { toast } = useToast();
  const [collections, setCollections] = useState(workspaceCollections);

  const { subscription } = useSupabaseUser();

  useEffect(() => {
    if (workspaceCollections.length > 0) {
      dispatch({
        type: "SET_FOLDERS",
        payload: {
          workspaceId,
          collections: workspaceCollections,
        },
      });
    }
  }, [dispatch, workspaceCollections, workspaceId]);

  useEffect(() => {
    setCollections(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.collections || []
    );
  }, [state, workspaceId]);

  //add collection
  const addCollectionHandler = async () => {
    if (collections.length >= 3 && !subscription) {
      setOpen(true);
      return;
    }
    const newCollection: Collection = {
      id: v4(),
      createdAt: new Date().toISOString(),
      name: "Untitled",
      icon: "📄",
      inTrash: null,
      workspaceId,
      bannerUrl: "",
      urlId: null,
      description: null,
      color: null,
      index: null,
      permission: null,
      maintainerApprovalRequired: null,
      documentStructure: undefined,
      sharing: null,
      importId: null,
      createdById: user?.id || null,
    };
    dispatch({
      type: "ADD_FOLDER",
      payload: { workspaceId, collection: { ...newCollection } },
    });
    const { data, error } = await createCollection(newCollection);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not create the collection" + error.toString(),
      });
    } else {
      toast({
        title: "Success",
        description: "Created collection.",
      });
    }
  };

  return (
    <>
      <div
        className="flex
        sticky 
        z-20 
        top-0 
        w-full  
        h-10 
        group/title 
        justify-between 
        items-center 
        pr-4 
        text-Neutrals/neutrals-8
  "
      >
        <span
          className="text-Neutrals-8 
        font-bold 
        text-xs"
        >
          Collections
        </span>
        <TooltipComponent message="Create Collection">
          <PlusIcon
            onClick={addCollectionHandler}
            size={16}
            className="group-hover/title:inline-block
            hidden 
            cursor-pointer
            hover:dark:text-white
          "
          />
        </TooltipComponent>
      </div>
      <ul className="flex flex-col w-full items-start flex-1">
        {collections
          .filter((collection) => !collection.inTrash)
          .map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              workspaceId={collection.workspaceId}
            />
          ))}
      </ul>
    </>
  );
};

export default CollectionsDropdownList;
