"use client";
import { Button } from "@/components/ui/button";
import {
  type appFoldersType,
  useAppState,
} from "@/lib/providers/state-provider";
import type { File } from "@/lib/supabase/supabase.types";
import { FileIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const TrashPage = () => {
  const { state, workspaceId } = useAppState();
  const [folders, setFolders] = useState<appFoldersType[] | []>([]);
  const [files, setFiles] = useState<File[] | []>([]);

  useEffect(() => {
    const stateFolders =
      state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.filter((folder) => folder.inTrash) || [];
    setFolders(stateFolders);

    const stateFiles: File[] = [];
    for (const folder of state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )?.folders || []) {
      for (const file of folder.files) {
        if (file.inTrash) {
          stateFiles.push(file);
        }
      }
    }
    setFiles(stateFiles);
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
