"use client";
import { Button } from "@/components/ui/button";
import {
  type appCollectionsType,
  useAppState,
} from "@/lib/providers/state-provider";
import type { Document } from "@/lib/supabase/supabase.types";
import { FileIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TrashPage = () => {
  const { state, workspaceId } = useAppState();
  const [collections, setCollections] = useState<appCollectionsType[] | []>([]);
  const [documents, setDocuments] = useState<Document[] | []>([]);

  useEffect(() => {
    const stateCollections =
      state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.collections.filter((collection) => collection.inTrash) || [];
    setCollections(stateCollections);

    const stateDocuments: Document[] = [];
    for (const collection of state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )?.collections || []) {
      for (const document of collection.documents) {
        if (document.inTrash) {
          stateDocuments.push(document);
        }
      }
    }
    setDocuments(stateDocuments);
  }, [state, workspaceId]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Nav for trash page */}
      {/* Content: table, has restore and delete permanent button */}
      <div className="flex flex-row justify-between items-center w-full h-16 px-4 border-b border-gray-200">
        <div className="flex flex-row items-center">
          <FolderIcon size={24} className="text-gray-400" />
          <span className="ml-2 text-lg font-bold">Trash</span>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <Button className="btn btn-primary">Restore</Button>
          <Button className="btn btn-danger">Delete Permanent</Button>
        </div>
      </div>
    </div>
  );
};

export default TrashPage;
