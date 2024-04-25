"use client";
import useSupabaseRealtime from "@/lib/hooks/useSupabaseRealtime";
import { useAppState } from "@/lib/providers/state-provider";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { createCollection } from "@/server/api/queries";
import type { Collection } from "@/shared/supabase.types";
import { PlusIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import TooltipComponent from "../global/tooltip-component";
import { Accordion } from "../ui/accordion";
import { useToast } from "../ui/use-toast";
import Dropdown from "./Dropdown";

interface CollectionsDropdownListProps {
  workspaceCollections: Collection[];
  workspaceId: string;
}

const CollectionsDropdownList: React.FC<CollectionsDropdownListProps> = ({
  workspaceCollections,
  workspaceId,
}) => {
  useSupabaseRealtime();
  const { state, dispatch, collectionId } = useAppState();
  const { open, setOpen } = useSubscriptionModal();
  const { toast } = useToast();
  const [collections, setCollections] = useState(workspaceCollections);
  const { subscription } = useSupabaseUser();

  //effec set nitial satte server app state
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (workspaceCollections.length > 0) {
      dispatch({
        type: "SET_COLLECTIONS",
        payload: {
          workspaceId,
          collections: workspaceCollections.map((collection) => ({
            ...collection,
            documents:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.collections.find((f) => f.id === collection.id)?.documents ||
              [],
          })),
        },
      });
    }
  }, [workspaceCollections, workspaceId, dispatch]);
  //state

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
      documentStructure: null,
      id: v4(),
      createAt: new Date().toISOString(),
      name: "Untitled",
      icon: "📄",
      inTrash: null,
      workspaceId,
      bannerUrl: "",
      urlId: "",
      description: null,
      color: null,
      index: null,
      permission: null,
      maintainerApprovalRequired: null,
      sharing: null,
      importId: null,
      createdById: "",
    };
    dispatch({
      type: "ADD_COLLECTION",
      payload: { workspaceId, collection: { ...newCollection, documents: [] } },
    });
    const { data, error } = await createCollection(newCollection);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Could not create the collection",
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
      <Accordion
        type="multiple"
        defaultValue={[collectionId || ""]}
        className="pb-20"
      >
        {collections
          .filter((collection) => !collection.inTrash)
          .map((collection) => (
            <Dropdown
              key={collection.id}
              title={collection.name}
              listType="collection"
              id={collection.id}
              iconId={collection.icon}
            />
          ))}
      </Accordion>
    </>
  );
};

export default CollectionsDropdownList;
